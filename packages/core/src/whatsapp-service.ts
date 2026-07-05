export const sendWhatsAppNotification = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendShipmentNotification = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendPaymentActionRequired = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendPaymentConfirmationNotification = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendOrderCancelled = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendOrderDelayed = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendOrderActionNeeded = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendOrderPickupReady = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendDeliveryConfirmation = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendPaymentReminder = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendWelcomeNotification = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendOrderNotification = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendOrderStatusUpdate = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendPickupNotification = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });
export const sendOutForDeliveryNotification = async (...args: any[]) => ({ messages: [{ id: 'dummy' }] });

export class WhatsAppService {
  async checkWhatsAppConsent(...args: any[]) { return false; }
  async sendOTP(...args: any[]) {
    // WhatsApp is disabled
    return { messages: [{ id: 'dummy' }] };
  }
  async sendMessage(...args: any[]) {
    return { messages: [{ id: 'dummy' }] };
  }
}
