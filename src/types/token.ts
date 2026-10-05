export type TokenTransactionType =
  | 'PURCHASE'
  | 'FREE_CREDIT'
  | 'EARNED'
  | 'SPENT'
  | 'REFUND'
  | 'ADMIN_ADJUSTMENT'
  | 'EXPIRATION';

export type TokenTransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REVERSED';

export interface TokenTransaction {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  type: TokenTransactionType;
  amount: number; // positive for credits (+100), negative for spends (-50)
  balance_after: number;
  reference_type?:
    | 'package_purchase'
    | 'welcome_bonus'
    | 'reward_rule'
    | 'study_material'
    | 'admin_support'
    | 'refund'
    | 'system';
  reference_id?: string;
  description: string;
  status: TokenTransactionStatus;
  created_at: string;
  admin_id?: string;
  admin_name?: string;
  admin_reason?: string;
}

export interface TokenPackage {
  id: string;
  name: string;
  rupee_amount: number; // e.g. 10 (₹10)
  token_amount: number; // e.g. 100 VT
  bonus_tokens: number; // e.g. 20 VT
  active: boolean;
  display_order: number;
  created_at: string;
  badge?: string;
  popular?: boolean;
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export interface PaymentRecord {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  package_id: string;
  package_name: string;
  amount: number; // INR ₹
  currency: string; // 'INR'
  tokens_to_credit: number;
  provider: string; // 'Razorpay' | 'UPI_Gateway' | 'Stripe' | 'Direct'
  provider_payment_id?: string;
  status: PaymentStatus;
  created_at: string;
  verified_at?: string;
  refunded_at?: string;
  failure_reason?: string;
}

export interface TokenUnlock {
  id: string;
  user_id: string;
  resource_type: 'material' | 'course' | 'pack' | 'feature';
  resource_id: string;
  resource_title: string;
  token_price: number;
  token_transaction_id: string;
  created_at: string;
}

export type RewardEventType =
  | 'ACCEPTED_COMMUNITY_ANSWER'
  | 'HELPFUL_COMMUNITY_CONTRIBUTION'
  | 'HIGH_QUALITY_DISCUSSION'
  | 'ACCEPTED_DOUBT_ANSWER'
  | 'ADMIN_APPROVED_CONTRIBUTION';

export interface RewardRule {
  id: string;
  event_type: RewardEventType;
  title: string;
  description: string;
  token_amount: number; // e.g. 10 VT
  active: boolean;
  daily_limit: number; // e.g. 3 per day
  requires_admin_approval: boolean;
  created_at: string;
}

export type RewardStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ContributorReward {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  rule_id: string;
  rule_title: string;
  event_type: RewardEventType;
  source_event_id: string; // e.g. replyId or discussionId
  source_title: string;
  amount: number; // VT
  status: RewardStatus;
  notes?: string;
  created_at: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
}

export interface TokenWalletSummary {
  user_id: string;
  available_balance: number;
  total_earned: number;
  total_spent: number;
  total_purchased: number;
  total_free_received: number;
  total_unlocked_resources: number;
  last_transaction_at?: string;
}

export interface TokenSettings {
  welcome_tokens_enabled: boolean;
  welcome_token_amount: number; // default 100 VT
  conversion_rate_inr_to_vt: number; // default 10 (1 INR = 10 VT)
  payments_enabled: boolean; // default false for unconfigured live gateway
  payment_gateway_mode: 'disabled' | 'sandbox_test' | 'live';
  active_provider_name: string;
  updated_at: string;
}

export interface AdminBalanceAdjustmentDTO {
  user_id: string;
  amount: number; // positive or negative
  reason: string;
  admin_id: string;
  admin_name: string;
}
