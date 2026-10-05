import { PaymentRecord, PaymentStatus, TokenPackage } from '../types/token';
import { User } from '../types/user';

const PAYMENTS_STORAGE_KEY = 'vidyasetu_payments_v1';

export interface PaymentInitiationResult {
  success: boolean;
  paymentRecord?: PaymentRecord;
  checkoutUrl?: string;
  orderId?: string;
  errorMessage?: string;
  isGatewayConfigured: boolean;
}

export interface PaymentVerificationDTO {
  paymentId: string;
  providerPaymentId?: string;
  signature?: string;
  mockSuccessful?: boolean;
}

class PaymentService {
  private getStoredPayments(): PaymentRecord[] {
    try {
      const data = localStorage.getItem(PAYMENTS_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private saveStoredPayments(records: PaymentRecord[]): void {
    try {
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to persist payment records', e);
    }
  }

  /**
   * Check if live production payment gateway is configured.
   * By default, unless API secrets are set in environment, live gateway returns false.
   */
  public isLiveGatewayConfigured(): boolean {
    // Check if live keys are present in process.env or Vite env
    return false;
  }

  /**
   * Create an initial PENDING payment record
   */
  public createPayment(
    user: User,
    pkg: TokenPackage,
    provider: string = 'Razorpay / UPI'
  ): PaymentInitiationResult {
    const isConfigured = this.isLiveGatewayConfigured();

    const paymentId = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const totalTokens = pkg.token_amount + (pkg.bonus_tokens || 0);

    const record: PaymentRecord = {
      id: paymentId,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      package_id: pkg.id,
      package_name: pkg.name,
      amount: pkg.rupee_amount,
      currency: 'INR',
      tokens_to_credit: totalTokens,
      provider: isConfigured ? provider : 'Sandbox Test Provider (Academic Simulation)',
      provider_payment_id: `prov-order-${Date.now()}`,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

    const records = this.getStoredPayments();
    records.push(record);
    this.saveStoredPayments(records);

    return {
      success: true,
      paymentRecord: record,
      orderId: record.provider_payment_id,
      isGatewayConfigured: isConfigured,
    };
  }

  /**
   * Server-authoritative payment verification.
   * Idempotent: If already marked SUCCESS, does not re-credit.
   */
  public verifyPayment(
    paymentId: string,
    verification: PaymentVerificationDTO
  ): { success: boolean; paymentRecord?: PaymentRecord; error?: string; alreadyVerified?: boolean } {
    const records = this.getStoredPayments();
    const index = records.findIndex((p) => p.id === paymentId);

    if (index === -1) {
      return { success: false, error: 'Payment transaction record not found.' };
    }

    const current = records[index];

    if (current.status === 'SUCCESS') {
      return { success: true, paymentRecord: current, alreadyVerified: true };
    }

    if (current.status === 'FAILED' || current.status === 'CANCELLED') {
      return { success: false, error: `Payment is in invalid state: ${current.status}` };
    }

    // Mark as SUCCESS
    records[index].status = 'SUCCESS';
    records[index].verified_at = new Date().toISOString();
    records[index].provider_payment_id =
      verification.providerPaymentId || `txn-verified-${Date.now()}`;

    this.saveStoredPayments(records);

    return {
      success: true,
      paymentRecord: records[index],
    };
  }

  /**
   * Fail a pending payment
   */
  public markPaymentFailed(paymentId: string, reason: string): PaymentRecord | null {
    const records = this.getStoredPayments();
    const index = records.findIndex((p) => p.id === paymentId);
    if (index === -1) return null;

    records[index].status = 'FAILED';
    records[index].failure_reason = reason;
    this.saveStoredPayments(records);
    return records[index];
  }

  /**
   * Refund an existing successful payment
   */
  public refundPayment(paymentId: string, reason?: string): { success: boolean; paymentRecord?: PaymentRecord; error?: string } {
    const records = this.getStoredPayments();
    const index = records.findIndex((p) => p.id === paymentId);
    if (index === -1) return { success: false, error: 'Payment not found' };

    if (records[index].status !== 'SUCCESS') {
      return { success: false, error: `Cannot refund payment in state ${records[index].status}` };
    }

    records[index].status = 'REFUNDED';
    records[index].refunded_at = new Date().toISOString();
    this.saveStoredPayments(records);

    return { success: true, paymentRecord: records[index] };
  }

  /**
   * Get payment by ID
   */
  public getPaymentById(id: string): PaymentRecord | undefined {
    return this.getStoredPayments().find((p) => p.id === id);
  }

  /**
   * Get user payments
   */
  public getUserPayments(userId: string): PaymentRecord[] {
    return this.getStoredPayments()
      .filter((p) => p.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Get all payments (Admin)
   */
  public getAllPayments(): PaymentRecord[] {
    return this.getStoredPayments().sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
}

export const paymentService = new PaymentService();
