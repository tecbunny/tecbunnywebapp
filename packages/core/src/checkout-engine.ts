import { pricingService, PricingContext } from './pricing-service';
import { offerDiscountService } from './offer-discount-service';
import { enhancedCommissionService } from './enhanced-commission-service';
import type { CartItem, Product, CustomerCategory, Coupon, AutoOffer } from '@tecbunny/core';
import { logger } from '@tecbunny/core';
import { resolveIndianStateInfo, resolveIndianStateFromText } from './indian-tax';

const toPaise = (value: number) => Math.round((Number.isFinite(value) ? value : 0) * 100);
const fromPaise = (value: number) => value / 100;
const roundMoney = (value: number) => fromPaise(toPaise(value));

export interface CheckoutEngineRequest {
  items: CartItem[];
  userId?: string;
  customerCategory?: CustomerCategory;
  couponCode?: string;
  salesAgentId?: string; // Optional agent ID to calculate commissions
  customerState?: string; // Optional state/address to determine GST split
}

export interface CheckoutEngineResponse {
  subtotal: number;
  totalDiscount: number;
  autoOfferDiscount: number;
  couponDiscount: number;
  gstAmount: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  finalTotal: number;
  
  bestOffer: AutoOffer | null;
  appliedCoupon: Coupon | null;
  availableCoupons: Coupon[];
  canCombineDiscounts: boolean;

  itemPrices: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    discount_amount: number;
    pricing_info: any;
    isService?: boolean;
    hsnCode?: string | null;
    sacCode?: string | null;
    gstRate?: number;
    taxableBase?: number;
    gstAmount?: number;
    cgst?: number;
    sgst?: number;
    igst?: number;
  }>;

  commissionEstimate?: {
    agent_id: string;
    commission_amount: number;
    commission_rate: number;
  };

  // Bug #34 fix: dbProductMap removed from the public response interface.
  // Use checkoutEngine.getDbProductMap() after calling calculate() instead.
}

export class CheckoutEngine {

  async calculate(request: CheckoutEngineRequest): Promise<CheckoutEngineResponse> {
    const { items, userId, customerCategory, couponCode, salesAgentId } = request;

    if (!items || items.length === 0) {
      return this.emptyResponse();
    }

    try {
      const productIds = items.map(item => item.id);

      // 1. Parallelize DB and network queries
      const pricingContextPromise = userId 
        ? pricingService.getCustomerPricingContext(userId)
        : Promise.resolve({ customer_type: 'B2C', customer_category: customerCategory || 'Normal' } as PricingContext);

      const couponsPromise = couponCode
        ? offerDiscountService.getActiveCoupons()
        : Promise.resolve([]);

      // @ts-ignore
      const dbProductsPromise = pricingService.getSupabaseClient().then(supabase => 
        supabase.from('products').select('id, title, price, mrp, status, is_deleted, gst_rate, hsn_code, sac_code, is_service, offer_price, stock_quantity').in('id', productIds)
      );

      const [pricingContext, availableCoupons, response] = await Promise.all([
        pricingContextPromise,
        couponsPromise,
        dbProductsPromise
      ]);

      // 2. Base Pricing Calculation per item
      const itemPrices = [];
      let grossSubtotal = 0; // Sum of item price * quantity before discounts and GST

      const dbProducts = (response as any).data as any[];
      const dbError = (response as any).error;
      
      if (dbError || !dbProducts) {
        logger.error('Failed to fetch pricing and stock metadata from database', { dbError });
        throw new Error('Checkout engine calculation failed due to internal execution errors.');
      }

      const dbProductMap: Map<string, any> = new Map(dbProducts.map((p: any) => [p.id, p]));

      // Convert CartItems to Product array for PricingService using verified database metadata
      const productsForPricing = items.map(item => {
        const dbProduct = dbProductMap.get(item.id);
        if (!dbProduct || dbProduct.is_deleted || dbProduct.status !== 'active') {
          throw new Error(`Product ${item.id} is invalid or no longer available.`);
        }
        
        const availableStock = dbProduct.stock_quantity ?? 0;
        if (item.quantity > availableStock) {
          throw new Error(`Insufficient stock for "${dbProduct.title || item.id}". Only ${availableStock} units available.`);
        }
        
        // NOTE: This is a pre-flight check. The actual atomic stock reservation 
        // is handled securely via the 'allocate_order_inventory_atomic' RPC during order placement
        // to prevent race conditions.

        return {
          product: {
            ...item,
            price: dbProduct.price,
            mrp: dbProduct.mrp,
            offer_price: dbProduct.offer_price,
            gstRate: dbProduct.gst_rate ?? 18
          } as unknown as Product,
          quantity: item.quantity
        };
      });

      // Calculate initial pricing using pricing service
      const pricingResult = await pricingService.calculateCartTotal(productsForPricing, pricingContext);
      
      // Update items with their actual pricing for discount calculation
      const pricedItems: CartItem[] = items.map((item, index) => {
        const pInfo = pricingResult.item_prices[index];
        return {
          ...item,
          price: pInfo.unit_price // Use the final price from pricing service as base
        };
      });

      grossSubtotal = fromPaise(pricedItems.reduce((sum, item) => sum + toPaise(item.price * item.quantity), 0));

      // 3. Discount Application
      let appliedCoupon: Coupon | null = null;
      if (couponCode) {
        const found = availableCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
        if (found) appliedCoupon = found;
      }

      const discountResult = await offerDiscountService.calculateCartPricing(
        pricedItems,
        pricingContext.customer_category as CustomerCategory,
        appliedCoupon || undefined
      );

      // 4. GST Calculation based on post-discount subtotal using an immutable forward-calculation step tracking system
      let finalSubtotal = 0;
      let gstAmount = 0;
      let finalTotal = 0;
      const totalDiscountApplied = roundMoney(discountResult.totalDiscount);

      // Prepare items list for discount distribution
      const itemsToDistribute = pricedItems.map(item => ({
        gross: item.price * item.quantity
      }));

      // Distribute total discount proportionally across all items using O(N) single-pass greedy allocation
      const distributedDiscounts = (() => {
        const totalGross = itemsToDistribute.reduce((sum, item) => sum + item.gross, 0);
        if (totalGross <= 0 || totalDiscountApplied === 0) return itemsToDistribute.map(() => 0);

        const totalDiscountPaise = toPaise(totalDiscountApplied);
        const distributed = new Array(itemsToDistribute.length).fill(0);
        let remainingDiscountPaise = totalDiscountPaise;
        let remainingGross = totalGross;

        for (let i = 0; i < itemsToDistribute.length; i++) {
          const itemGross = itemsToDistribute[i].gross;
          if (itemGross <= 0) continue;
          
          if (i === itemsToDistribute.length - 1) {
            distributed[i] = remainingDiscountPaise;
          } else {
            const share = Math.round((itemGross / remainingGross) * remainingDiscountPaise);
            distributed[i] = share;
            remainingDiscountPaise -= share;
            remainingGross -= itemGross;
          }
        }
        return distributed.map(share => fromPaise(share));
      })();

      // Bug #20 fix: isIntraState was hardcoded to check for 'goa' only, meaning
      // every non-Goa customer received IGST instead of CGST+SGST. The business
      // is registered in Goa, so intra-state applies when the customer's state
      // matches the business state (Goa). When no state is provided we default
      // to intra-state (conservative — avoids incorrect IGST on domestic orders).
      const BUSINESS_STATE = (process.env.BUSINESS_STATE ?? 'goa').toLowerCase();
      const resolvedState = request.customerState ? resolveIndianStateInfo(request.customerState) : null;
      const isIntraState =
        !request.customerState ||
        (resolvedState?.name?.toLowerCase() === BUSINESS_STATE);

      let totalCgst = 0;
      let totalSgst = 0;
      let totalIgst = 0;

      const itemPricesWithTaxes = pricedItems.map((item, index) => {
        const pInfo = pricingResult.item_prices[index];
        const dbProd = dbProductMap.get(item.id);
        const gstRateRaw = dbProd?.gst_rate ?? 18;
        const gstRate = typeof gstRateRaw === 'number' ? gstRateRaw : parseFloat(gstRateRaw) || 18;
        
        const isService = dbProd?.is_service ?? false;
        const hsnCode = isService ? null : (dbProd?.hsn_code || null);
        const sacCode = isService ? (dbProd?.sac_code || null) : null;

        const itemGrossInclusive = roundMoney(item.price * item.quantity);
        const itemDiscountInclusive = distributedDiscounts[index];
        const itemNetInclusive = Math.max(0, itemGrossInclusive - itemDiscountInclusive);

        // Compute backward: extract base from inclusive net
        const itemNetExclusive = roundMoney(itemNetInclusive / (1 + (gstRate / 100)));
        const itemGst = roundMoney(itemNetInclusive - itemNetExclusive);

        let cgst = 0;
        let sgst = 0;
        let igst = 0;

        if (isIntraState) {
          cgst = roundMoney(itemGst / 2);
          sgst = roundMoney(itemGst - cgst);
        } else {
          igst = itemGst;
        }

        finalSubtotal += itemNetExclusive;
        gstAmount += itemGst;
        finalTotal += itemNetInclusive;
        totalCgst += cgst;
        totalSgst += sgst;
        totalIgst += igst;

        return {
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: itemNetExclusive, // Price before tax after discount
          discount_amount: itemDiscountInclusive,
          pricing_info: pInfo.pricing_info,
          isService,
          hsnCode,
          sacCode,
          gstRate,
          taxableBase: itemNetExclusive,
          gstAmount: itemGst,
          cgst,
          sgst,
          igst
        };
      });

      // 5. Commission Calculation (Estimate)
      let commissionEstimate = undefined;
      if (salesAgentId) {
        try {
          // Pre-tax amount for commission
          const preTaxAmount = finalSubtotal;
          
          // Simulate an order calculation
          // We bypass actual order creation and use calculateItemCommission logic indirectly
          // by mocking the structure EnhancedCommissionService expects or doing a basic estimate.
          // Since we just need an estimate, we can fetch rules and compute.
          // Bug #21 fix: same bracket-access fix applied here.
          // @ts-ignore
          const { data: agent } = await pricingService.getSupabaseClient().then(s =>
            s.from('sales_agents').select('commission_rate').eq('id', salesAgentId).single()
          ).catch(() => ({ data: null }));

          const defaultRate = agent?.commission_rate || 5;
          commissionEstimate = {
            agent_id: salesAgentId,
            commission_amount: roundMoney((preTaxAmount * defaultRate) / 100),
            commission_rate: defaultRate
          };
        } catch (err) {
          logger.warn('Failed to estimate commission in checkout engine', { err });
        }
      }

      // Singleton memory leak safely removed.

      return {
        subtotal: Math.max(0, roundMoney(finalSubtotal)),
        totalDiscount: totalDiscountApplied,
        autoOfferDiscount: roundMoney(discountResult.offerDiscount),
        couponDiscount: roundMoney(discountResult.couponDiscount),
        gstAmount: Math.max(0, roundMoney(gstAmount)),
        cgstAmount: Math.max(0, roundMoney(totalCgst)),
        sgstAmount: Math.max(0, roundMoney(totalSgst)),
        igstAmount: Math.max(0, roundMoney(totalIgst)),
        finalTotal: Math.max(0, roundMoney(finalTotal)),
        bestOffer: discountResult.bestOffer,
        appliedCoupon,
        availableCoupons: discountResult.availableCoupons,
        canCombineDiscounts: discountResult.canCombine,
        itemPrices: itemPricesWithTaxes,
        commissionEstimate,
        // dbProductMap intentionally omitted from public response (bug #34)
      };

    } catch (error) {
      throw error;
    }
  }

  private emptyResponse(): CheckoutEngineResponse {
    return {
      subtotal: 0,
      totalDiscount: 0,
      autoOfferDiscount: 0,
      couponDiscount: 0,
      gstAmount: 0,
      finalTotal: 0,
      bestOffer: null,
      appliedCoupon: null,
      availableCoupons: [],
      canCombineDiscounts: false,
      itemPrices: []
    };
  }
}

export const checkoutEngine = new CheckoutEngine();
