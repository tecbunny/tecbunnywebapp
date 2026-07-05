const fs = require('fs');
let content = fs.readFileSync('packages/core/src/enhanced-commission-service.ts', 'utf8');

const replacement = `import { createServiceClient, isSupabaseServiceConfigured } from "@tecbunny/core";
/**
 * Enhanced Commission Service
 * Handles agent commission calculation with product-specific rules and pre-tax calculations
 */

import type {
  AgentCommissionRule,
  OrderItem
} from '@tecbunny/core';

import { logger } from '@tecbunny/core';

export interface CommissionCalculation {
  order_id: string;
  agent_id: string;
  pre_tax_amount: number;
  gst_amount: number;
  commission_rate: number;
  commission_amount: number;
  rule_id?: string;
  breakdown: CommissionBreakdown[];
}

export interface CommissionBreakdown {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  commission_rate: number;
  commission_amount: number;
  rule_applied?: string;
}`;

content = content.replace(/^.*?(?=export interface CommissionRule \{)/s, replacement + '\n\n');
fs.writeFileSync('packages/core/src/enhanced-commission-service.ts', content);
