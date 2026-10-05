import {
  TokenTransaction,
  TokenTransactionType,
  TokenPackage,
  PaymentRecord,
  TokenUnlock,
  RewardRule,
  RewardEventType,
  ContributorReward,
  TokenWalletSummary,
  TokenSettings,
  AdminBalanceAdjustmentDTO,
} from '../types/token';
import { User } from '../types/user';
import { activityService } from './activityService';
import { notificationService } from './notificationService';
import { paymentService } from './paymentService';

const TRANSACTIONS_STORAGE_KEY = 'vidyasetu_token_transactions_v2';
const PACKAGES_STORAGE_KEY = 'vidyasetu_token_packages_v2';
const UNLOCKS_STORAGE_KEY = 'vidyasetu_token_unlocks_v2';
const REWARD_RULES_STORAGE_KEY = 'vidyasetu_reward_rules_v2';
const REWARDS_STORAGE_KEY = 'vidyasetu_rewards_v2';
const SETTINGS_STORAGE_KEY = 'vidyasetu_token_settings_v2';
const WELCOME_AWARDED_USERS_KEY = 'vidyasetu_welcome_awarded_users_v2';

export const INITIAL_PACKAGES: TokenPackage[] = [
  {
    id: 'pkg-starter-10',
    name: 'Starter Pack',
    rupee_amount: 10,
    token_amount: 100,
    bonus_tokens: 0,
    active: true,
    display_order: 1,
    badge: 'Popular',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'pkg-student-50',
    name: 'Student Scholar Pack',
    rupee_amount: 50,
    token_amount: 500,
    bonus_tokens: 50,
    active: true,
    display_order: 2,
    popular: true,
    badge: '+10% Bonus',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'pkg-master-100',
    name: 'Mastery Learning Pack',
    rupee_amount: 100,
    token_amount: 1000,
    bonus_tokens: 150,
    active: true,
    display_order: 3,
    badge: '+15% Bonus',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'pkg-pro-250',
    name: 'Semester Pro Pack',
    rupee_amount: 250,
    token_amount: 2500,
    bonus_tokens: 500,
    active: true,
    display_order: 4,
    badge: 'Best Value (+20%)',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
];

export const INITIAL_REWARD_RULES: RewardRule[] = [
  {
    id: 'rule-accepted-community-answer',
    event_type: 'ACCEPTED_COMMUNITY_ANSWER',
    title: 'Accepted Community Solution',
    description: 'Awarded when the author or admin marks your community explanation as the accepted answer.',
    token_amount: 10,
    active: true,
    daily_limit: 5,
    requires_admin_approval: false, // Auto-awarded upon question author/admin verification
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'rule-helpful-contribution',
    event_type: 'HELPFUL_COMMUNITY_CONTRIBUTION',
    title: 'High-Impact Peer Insight',
    description: 'Awarded when your academic explanation receives 5+ helpful votes from peer students.',
    token_amount: 2,
    active: true,
    daily_limit: 10,
    requires_admin_approval: false,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'rule-accepted-doubt-answer',
    event_type: 'ACCEPTED_DOUBT_ANSWER',
    title: 'Accepted Doubt Solution',
    description: 'Awarded when your answer to a student doubt is accepted.',
    token_amount: 10,
    active: true,
    daily_limit: 5,
    requires_admin_approval: false,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'rule-admin-educational-contrib',
    event_type: 'ADMIN_APPROVED_CONTRIBUTION',
    title: 'Admin-Verified Academic Contribution',
    description: 'Awarded for exceptional academic solutions, curated peer study summaries, or outstanding help.',
    token_amount: 25,
    active: true,
    daily_limit: 2,
    requires_admin_approval: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
];

export const INITIAL_SETTINGS: TokenSettings = {
  welcome_tokens_enabled: true,
  welcome_token_amount: 100,
  conversion_rate_inr_to_vt: 10, // 1 INR = 10 VT (₹10 = 100 VT)
  payments_enabled: true, // Enabled for sandbox / demo purchase flow
  payment_gateway_mode: 'sandbox_test',
  active_provider_name: 'YuvaSetu Secure UPI & NetBanking Gateway',
  updated_at: new Date().toISOString(),
};

// Seed realistic ledger transactions for demo accounts
export const INITIAL_TRANSACTIONS: TokenTransaction[] = [
  {
    id: 'txn-seed-aryan-welcome',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    type: 'FREE_CREDIT',
    amount: 100,
    balance_after: 100,
    reference_type: 'welcome_bonus',
    description: 'Welcome Gift: 100 VidyaTokens for joining YuvaSetu',
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'txn-seed-aryan-earn-1',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    type: 'EARNED',
    amount: 10,
    balance_after: 110,
    reference_type: 'reward_rule',
    reference_id: 'reply-gate-prep-1',
    description: 'Contributor Reward: Accepted Community Solution in GATE CSE 2027',
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'txn-seed-aryan-purchase',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    type: 'PURCHASE',
    amount: 100,
    balance_after: 210,
    reference_type: 'package_purchase',
    reference_id: 'pkg-starter-10',
    description: 'Purchased Starter Pack (₹10 → 100 VT)',
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'txn-seed-aryan-spend-1',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    type: 'SPENT',
    amount: -50,
    balance_after: 160,
    reference_type: 'study_material',
    reference_id: 'material-dsa-advanced-trees',
    description: 'Unlocked "Advanced Binary Search Trees & AVL Rotations Masterclass"',
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'txn-seed-priya-welcome',
    user_id: 'student-priya-sharma',
    user_name: 'Priya Sharma',
    user_email: 'priya.sharma@pict.edu',
    type: 'FREE_CREDIT',
    amount: 100,
    balance_after: 100,
    reference_type: 'welcome_bonus',
    description: 'Welcome Gift: 100 VidyaTokens for joining YuvaSetu',
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'txn-seed-priya-earn-1',
    user_id: 'student-priya-sharma',
    user_name: 'Priya Sharma',
    user_email: 'priya.sharma@pict.edu',
    type: 'EARNED',
    amount: 25,
    balance_after: 125,
    reference_type: 'reward_rule',
    description: 'Admin-Approved Academic Contribution: Curated Discrete Mathematics Cheatsheet',
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const INITIAL_UNLOCKS: TokenUnlock[] = [
  {
    id: 'unlock-aryan-1',
    user_id: 'user-student-aryan',
    resource_type: 'material',
    resource_id: 'material-dsa-advanced-trees',
    resource_title: 'Advanced Binary Search Trees & AVL Rotations Masterclass',
    token_price: 50,
    token_transaction_id: 'txn-seed-aryan-spend-1',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const INITIAL_REWARDS: ContributorReward[] = [
  {
    id: 'rew-1',
    user_id: 'user-student-aryan',
    user_name: 'Aryan Sharma',
    user_email: 'aryan@yuvasetu.com',
    rule_id: 'rule-accepted-community-answer',
    rule_title: 'Accepted Community Solution',
    event_type: 'ACCEPTED_COMMUNITY_ANSWER',
    source_event_id: 'reply-gate-prep-1',
    source_title: 'GATE CSE 2027 Strategy Discussion',
    amount: 10,
    status: 'APPROVED',
    notes: 'Verified accepted solution by discussion author',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    approved_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    approved_by: 'System (Verified Solution)',
  },
  {
    id: 'rew-2',
    user_id: 'student-priya-sharma',
    user_name: 'Priya Sharma',
    user_email: 'priya.sharma@pict.edu',
    rule_id: 'rule-admin-educational-contrib',
    rule_title: 'Admin-Verified Academic Contribution',
    event_type: 'ADMIN_APPROVED_CONTRIBUTION',
    source_event_id: 'contrib-dm-cheatsheet',
    source_title: 'Curated Discrete Mathematics Formulas & Graph Theory Cheatsheet',
    amount: 25,
    status: 'APPROVED',
    notes: 'Comprehensive and clean formulas with no errors',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    approved_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    approved_by: 'Om Tajane (Admin)',
  },
  {
    id: 'rew-3',
    user_id: 'student-sneha-kulkarni',
    user_name: 'Sneha Kulkarni',
    user_email: 'sneha.k@iitb.ac.in',
    rule_id: 'rule-admin-educational-contrib',
    rule_title: 'Admin-Verified Academic Contribution',
    event_type: 'ADMIN_APPROVED_CONTRIBUTION',
    source_event_id: 'contrib-cn-socket-guide',
    source_title: 'Step-by-step Socket Programming Guide with CUBIC Packet Captures',
    amount: 25,
    status: 'PENDING',
    notes: 'Submitted for peer learning verification',
    created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
  },
];

class TokenService {
  // ----------------------------------------------------
  // STORAGE HELPERS
  // ----------------------------------------------------

  private getStoredTransactions(): TokenTransaction[] {
    try {
      const data = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
        return INITIAL_TRANSACTIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  }

  private saveTransactions(records: TokenTransaction[]): void {
    try {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to persist token transactions', e);
    }
  }

  private getStoredPackages(): TokenPackage[] {
    try {
      const data = localStorage.getItem(PACKAGES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(INITIAL_PACKAGES));
        return INITIAL_PACKAGES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PACKAGES;
    }
  }

  private savePackages(packages: TokenPackage[]): void {
    try {
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
    } catch (e) {
      console.error('Failed to persist token packages', e);
    }
  }

  private getStoredUnlocks(): TokenUnlock[] {
    try {
      const data = localStorage.getItem(UNLOCKS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(UNLOCKS_STORAGE_KEY, JSON.stringify(INITIAL_UNLOCKS));
        return INITIAL_UNLOCKS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_UNLOCKS;
    }
  }

  private saveUnlocks(unlocks: TokenUnlock[]): void {
    try {
      localStorage.setItem(UNLOCKS_STORAGE_KEY, JSON.stringify(unlocks));
    } catch (e) {
      console.error('Failed to persist token unlocks', e);
    }
  }

  private getStoredRules(): RewardRule[] {
    try {
      const data = localStorage.getItem(REWARD_RULES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(REWARD_RULES_STORAGE_KEY, JSON.stringify(INITIAL_REWARD_RULES));
        return INITIAL_REWARD_RULES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_REWARD_RULES;
    }
  }

  private saveRules(rules: RewardRule[]): void {
    try {
      localStorage.setItem(REWARD_RULES_STORAGE_KEY, JSON.stringify(rules));
    } catch (e) {
      console.error('Failed to persist reward rules', e);
    }
  }

  private getStoredRewards(): ContributorReward[] {
    try {
      const data = localStorage.getItem(REWARDS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(INITIAL_REWARDS));
        return INITIAL_REWARDS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_REWARDS;
    }
  }

  private saveRewards(rewards: ContributorReward[]): void {
    try {
      localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(rewards));
    } catch (e) {
      console.error('Failed to persist contributor rewards', e);
    }
  }

  public getSettings(): TokenSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
        return INITIAL_SETTINGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  public updateSettings(updates: Partial<TokenSettings>): TokenSettings {
    const current = this.getSettings();
    const updated: TokenSettings = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update token settings', e);
    }
    return updated;
  }

  private getWelcomeAwardedUsers(): string[] {
    try {
      const data = localStorage.getItem(WELCOME_AWARDED_USERS_KEY);
      if (!data) return ['user-student-aryan', 'student-priya-sharma'];
      return JSON.parse(data);
    } catch {
      return ['user-student-aryan', 'student-priya-sharma'];
    }
  }

  private markWelcomeAwarded(userId: string): void {
    const list = this.getWelcomeAwardedUsers();
    if (!list.includes(userId)) {
      list.push(userId);
      try {
        localStorage.setItem(WELCOME_AWARDED_USERS_KEY, JSON.stringify(list));
      } catch {
        // ignore
      }
    }
  }

  // ----------------------------------------------------
  // WALLET & BALANCE (LEDGER AUTHORITATIVE)
  // ----------------------------------------------------

  /**
   * Get total available balance derived safely from the transaction ledger
   */
  public getUserBalance(userId: string): number {
    const txns = this.getStoredTransactions().filter(
      (t) => t.user_id === userId && t.status === 'COMPLETED'
    );
    return txns.reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Get detailed wallet summary for a student
   */
  public getWalletSummary(user: User): TokenWalletSummary {
    // If student has never received welcome tokens, award them once
    this.awardWelcomeTokensIfNeeded(user);

    const txns = this.getStoredTransactions().filter((t) => t.user_id === user.id);
    const completed = txns.filter((t) => t.status === 'COMPLETED');

    const available_balance = completed.reduce((sum, t) => sum + t.amount, 0);

    const total_earned = completed
      .filter((t) => t.type === 'EARNED')
      .reduce((sum, t) => sum + t.amount, 0);

    const total_spent = Math.abs(
      completed
        .filter((t) => t.type === 'SPENT')
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const total_purchased = completed
      .filter((t) => t.type === 'PURCHASE')
      .reduce((sum, t) => sum + t.amount, 0);

    const total_free_received = completed
      .filter((t) => t.type === 'FREE_CREDIT')
      .reduce((sum, t) => sum + t.amount, 0);

    const unlocks = this.getStoredUnlocks().filter((u) => u.user_id === user.id);

    const sortedTxns = [...txns].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      user_id: user.id,
      available_balance,
      total_earned,
      total_spent,
      total_purchased,
      total_free_received,
      total_unlocked_resources: unlocks.length,
      last_transaction_at: sortedTxns[0]?.created_at,
    };
  }

  /**
   * Award welcome tokens to a new student (strictly once per student account)
   */
  public awardWelcomeTokensIfNeeded(user: User): boolean {
    if (user.role === 'admin') return false; // Admins don't have personal token wallets

    const settings = this.getSettings();
    if (!settings.welcome_tokens_enabled || settings.welcome_token_amount <= 0) {
      return false;
    }

    const awarded = this.getWelcomeAwardedUsers();
    if (awarded.includes(user.id)) {
      return false;
    }

    const txns = this.getStoredTransactions();
    const existingWelcome = txns.find(
      (t) => t.user_id === user.id && t.reference_type === 'welcome_bonus'
    );
    if (existingWelcome) {
      this.markWelcomeAwarded(user.id);
      return false;
    }

    const currentBalance = this.getUserBalance(user.id);
    const amount = settings.welcome_token_amount;
    const newBalance = currentBalance + amount;

    const welcomeTxn: TokenTransaction = {
      id: `txn-welcome-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      type: 'FREE_CREDIT',
      amount: amount,
      balance_after: newBalance,
      reference_type: 'welcome_bonus',
      description: `Welcome Gift: ${amount} VidyaTokens for joining YuvaSetu`,
      status: 'COMPLETED',
      created_at: new Date().toISOString(),
    };

    txns.push(welcomeTxn);
    this.saveTransactions(txns);
    this.markWelcomeAwarded(user.id);

    // Activity Log
    activityService.logEvent({
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      event_type: 'TOKEN_EARNED',
      resource_type: 'token_wallet',
      resource_id: welcomeTxn.id,
      resource_title: `Welcome bonus of ${amount} VT credited`,
      metadata: {
        amount,
        type: 'FREE_CREDIT',
      },
    });

    // Notification
    notificationService.notifyTokenCredited(user.id, amount, 'Welcome bonus for joining YuvaSetu');

    return true;
  }

  // ----------------------------------------------------
  // RESOURCE UNLOCKING & TOKEN SPENDING
  // ----------------------------------------------------

  /**
   * Check if a resource is unlocked by the user
   */
  public isResourceUnlocked(userId: string, resourceId: string): boolean {
    if (!userId) return false;
    const unlocks = this.getStoredUnlocks();
    return unlocks.some((u) => u.user_id === userId && u.resource_id === resourceId);
  }

  /**
   * Get all unlocked resources for a user
   */
  public getUserUnlockedResources(userId: string): TokenUnlock[] {
    return this.getStoredUnlocks()
      .filter((u) => u.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Secure, Atomic Token Spending to Unlock a Resource.
   * Server-authoritative validation & Idempotency.
   */
  public spendTokensToUnlock(
    user: User,
    resourceType: 'material' | 'course' | 'pack' | 'feature',
    resourceId: string,
    resourceTitle: string,
    tokenPrice: number
  ): { success: boolean; unlock?: TokenUnlock; error?: string; alreadyUnlocked?: boolean } {
    if (!user || !user.id) {
      return { success: false, error: 'User must be authenticated to unlock resources.' };
    }

    if (tokenPrice <= 0) {
      return { success: false, error: 'Cannot spend tokens on a free resource.' };
    }

    // 1. Idempotency check: Already unlocked?
    const existingUnlocks = this.getStoredUnlocks();
    const already = existingUnlocks.find(
      (u) => u.user_id === user.id && u.resource_id === resourceId
    );
    if (already) {
      return { success: true, unlock: already, alreadyUnlocked: true };
    }

    // 2. Validate current balance
    const currentBalance = this.getUserBalance(user.id);
    if (currentBalance < tokenPrice) {
      return {
        success: false,
        error: `Insufficient VidyaTokens. You need ${tokenPrice} VT, but your current balance is ${currentBalance} VT.`,
      };
    }

    const txns = this.getStoredTransactions();
    const newBalance = currentBalance - tokenPrice;

    // 3. Create SPENT ledger entry
    const txnId = `txn-spend-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const spendTxn: TokenTransaction = {
      id: txnId,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      type: 'SPENT',
      amount: -tokenPrice,
      balance_after: newBalance,
      reference_type: 'study_material',
      reference_id: resourceId,
      description: `Unlocked "${resourceTitle}"`,
      status: 'COMPLETED',
      created_at: new Date().toISOString(),
    };

    // 4. Create UNLOCK record
    const unlockRecord: TokenUnlock = {
      id: `unlock-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: user.id,
      resource_type: resourceType,
      resource_id: resourceId,
      resource_title: resourceTitle,
      token_price: tokenPrice,
      token_transaction_id: txnId,
      created_at: new Date().toISOString(),
    };

    txns.push(spendTxn);
    existingUnlocks.push(unlockRecord);

    this.saveTransactions(txns);
    this.saveUnlocks(existingUnlocks);

    // 5. Activity log
    activityService.logEvent({
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      event_type: 'RESOURCE_UNLOCKED',
      resource_type: 'token_unlock',
      resource_id: resourceId,
      resource_title: `Unlocked "${resourceTitle}" for ${tokenPrice} VT`,
      metadata: {
        tokenPrice,
        resourceType,
        newBalance,
      },
    });

    activityService.logEvent({
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      event_type: 'TOKEN_SPENT',
      resource_type: 'token_transaction',
      resource_id: txnId,
      resource_title: `Spent ${tokenPrice} VT on "${resourceTitle}"`,
      metadata: {
        amount: tokenPrice,
        balance_after: newBalance,
      },
    });

    // 6. Notification
    notificationService.notifyTokenSpent(user.id, tokenPrice, resourceTitle);

    return {
      success: true,
      unlock: unlockRecord,
    };
  }

  // ----------------------------------------------------
  // VERIFIED TOKEN PURCHASES
  // ----------------------------------------------------

  /**
   * Credit tokens after verified payment from PaymentService
   */
  public processVerifiedPayment(paymentRecord: PaymentRecord): {
    success: boolean;
    transaction?: TokenTransaction;
    error?: string;
  } {
    if (paymentRecord.status !== 'SUCCESS') {
      return { success: false, error: 'Cannot credit tokens for unverified payment' };
    }

    const txns = this.getStoredTransactions();
    // Idempotency: Check if transaction already exists for this payment ID
    const existing = txns.find(
      (t) => t.reference_id === paymentRecord.id && t.type === 'PURCHASE'
    );
    if (existing) {
      return { success: true, transaction: existing };
    }

    const currentBalance = this.getUserBalance(paymentRecord.user_id);
    const tokensToAdd = paymentRecord.tokens_to_credit;
    const newBalance = currentBalance + tokensToAdd;

    const txnId = `txn-buy-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const purchaseTxn: TokenTransaction = {
      id: txnId,
      user_id: paymentRecord.user_id,
      user_name: paymentRecord.user_name,
      user_email: paymentRecord.user_email,
      type: 'PURCHASE',
      amount: tokensToAdd,
      balance_after: newBalance,
      reference_type: 'package_purchase',
      reference_id: paymentRecord.id,
      description: `Purchased ${paymentRecord.package_name} (₹${paymentRecord.amount} → ${tokensToAdd} VT)`,
      status: 'COMPLETED',
      created_at: new Date().toISOString(),
    };

    txns.push(purchaseTxn);
    this.saveTransactions(txns);

    // Activity Log
    activityService.logEvent({
      user_id: paymentRecord.user_id,
      user_name: paymentRecord.user_name,
      user_email: paymentRecord.user_email,
      event_type: 'TOKEN_PURCHASED',
      resource_type: 'token_package',
      resource_id: paymentRecord.package_id,
      resource_title: `Purchased ${tokensToAdd} VT for ₹${paymentRecord.amount}`,
      metadata: {
        rupee_amount: paymentRecord.amount,
        token_amount: tokensToAdd,
        payment_id: paymentRecord.id,
      },
    });

    // Notification
    notificationService.notifyPurchaseSuccess(
      paymentRecord.user_id,
      paymentRecord.amount,
      tokensToAdd,
      txnId
    );

    return {
      success: true,
      transaction: purchaseTxn,
    };
  }

  // ----------------------------------------------------
  // LEARN & EARN CONTRIBUTOR REWARDS
  // ----------------------------------------------------

  public getRewardRules(activeOnly: boolean = false): RewardRule[] {
    const rules = this.getStoredRules();
    if (activeOnly) return rules.filter((r) => r.active);
    return rules;
  }

  public updateRewardRule(ruleId: string, updates: Partial<RewardRule>): RewardRule | null {
    const rules = this.getStoredRules();
    const index = rules.findIndex((r) => r.id === ruleId);
    if (index === -1) return null;

    rules[index] = { ...rules[index], ...updates };
    this.saveRules(rules);
    return rules[index];
  }

  public getContributorRewards(userId?: string): ContributorReward[] {
    const rewards = this.getStoredRewards();
    if (userId) {
      return rewards
        .filter((r) => r.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return rewards.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  /**
   * Create a contributor reward for an approved community event.
   */
  public triggerRewardEvent(
    user: User,
    eventType: RewardEventType,
    sourceEventId: string,
    sourceTitle: string,
    customAmount?: number
  ): { success: boolean; reward?: ContributorReward; alreadyAwarded?: boolean } {
    if (user.role === 'admin') return { success: false }; // Admins do not earn student tokens

    const rules = this.getStoredRules();
    const rule = rules.find((r) => r.event_type === eventType && r.active);
    if (!rule) {
      return { success: false };
    }

    const rewards = this.getStoredRewards();
    // Check if already awarded for this specific source event
    const existing = rewards.find(
      (r) =>
        r.user_id === user.id &&
        r.event_type === eventType &&
        r.source_event_id === sourceEventId &&
        r.status !== 'REJECTED'
    );
    if (existing) {
      return { success: true, reward: existing, alreadyAwarded: true };
    }

    const tokenAmount = customAmount || rule.token_amount;
    const isAutoApproved = !rule.requires_admin_approval;

    const rewardRecord: ContributorReward = {
      id: `rew-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      rule_id: rule.id,
      rule_title: rule.title,
      event_type: eventType,
      source_event_id: sourceEventId,
      source_title: sourceTitle,
      amount: tokenAmount,
      status: isAutoApproved ? 'APPROVED' : 'PENDING',
      created_at: new Date().toISOString(),
      approved_at: isAutoApproved ? new Date().toISOString() : undefined,
      approved_by: isAutoApproved ? 'System (Verified Action)' : undefined,
    };

    rewards.push(rewardRecord);
    this.saveRewards(rewards);

    // If auto-approved, credit tokens immediately
    if (isAutoApproved) {
      this.creditRewardTokens(rewardRecord);
    }

    return {
      success: true,
      reward: rewardRecord,
    };
  }

  private creditRewardTokens(reward: ContributorReward): void {
    const txns = this.getStoredTransactions();
    const currentBalance = this.getUserBalance(reward.user_id);
    const newBalance = currentBalance + reward.amount;

    const earnTxn: TokenTransaction = {
      id: `txn-earn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: reward.user_id,
      user_name: reward.user_name,
      user_email: reward.user_email,
      type: 'EARNED',
      amount: reward.amount,
      balance_after: newBalance,
      reference_type: 'reward_rule',
      reference_id: reward.source_event_id,
      description: `Contributor Reward: ${reward.rule_title} for "${reward.source_title}"`,
      status: 'COMPLETED',
      created_at: new Date().toISOString(),
    };

    txns.push(earnTxn);
    this.saveTransactions(txns);

    // Activity Log
    activityService.logEvent({
      user_id: reward.user_id,
      user_name: reward.user_name,
      user_email: reward.user_email,
      event_type: 'TOKEN_EARNED',
      resource_type: 'token_reward',
      resource_id: reward.id,
      resource_title: `Earned ${reward.amount} VT for ${reward.rule_title}`,
      metadata: {
        amount: reward.amount,
        rule_title: reward.rule_title,
        source_title: reward.source_title,
      },
    });

    // Notification
    notificationService.notifyRewardApproved(
      reward.user_id,
      reward.amount,
      reward.source_title
    );
  }

  /**
   * Admin approves a pending reward
   */
  public approveReward(
    rewardId: string,
    admin: User,
    notes?: string
  ): { success: boolean; reward?: ContributorReward; error?: string } {
    if (admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin role required.' };
    }

    const rewards = this.getStoredRewards();
    const index = rewards.findIndex((r) => r.id === rewardId);
    if (index === -1) return { success: false, error: 'Reward record not found' };

    const current = rewards[index];
    if (current.status === 'APPROVED') {
      return { success: true, reward: current };
    }

    rewards[index].status = 'APPROVED';
    rewards[index].approved_at = new Date().toISOString();
    rewards[index].approved_by = admin.name;
    if (notes) rewards[index].notes = notes;

    this.saveRewards(rewards);

    // Credit tokens
    this.creditRewardTokens(rewards[index]);

    // Activity Log
    activityService.logEvent({
      user_id: admin.id,
      user_name: admin.name,
      user_email: admin.email,
      event_type: 'REWARD_APPROVED',
      resource_type: 'token_reward',
      resource_id: rewardId,
      resource_title: `Approved reward of ${current.amount} VT for ${current.user_name}`,
      metadata: {
        student_id: current.user_id,
        amount: current.amount,
      },
    });

    return { success: true, reward: rewards[index] };
  }

  /**
   * Admin rejects a pending reward
   */
  public rejectReward(
    rewardId: string,
    admin: User,
    reason: string
  ): { success: boolean; reward?: ContributorReward; error?: string } {
    if (admin.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin role required.' };
    }

    const rewards = this.getStoredRewards();
    const index = rewards.findIndex((r) => r.id === rewardId);
    if (index === -1) return { success: false, error: 'Reward record not found' };

    rewards[index].status = 'REJECTED';
    rewards[index].rejected_at = new Date().toISOString();
    rewards[index].rejected_by = admin.name;
    rewards[index].rejection_reason = reason;

    this.saveRewards(rewards);

    // Activity Log
    activityService.logEvent({
      user_id: admin.id,
      user_name: admin.name,
      user_email: admin.email,
      event_type: 'REWARD_REJECTED',
      resource_type: 'token_reward',
      resource_id: rewardId,
      resource_title: `Rejected reward claim for ${rewards[index].user_name}: ${reason}`,
      metadata: {
        student_id: rewards[index].user_id,
        reason,
      },
    });

    // Notification
    notificationService.notifyRewardRejected(
      rewards[index].user_id,
      rewards[index].source_title,
      reason
    );

    return { success: true, reward: rewards[index] };
  }

  // ----------------------------------------------------
  // ADMIN ADJUSTMENTS & REFUNDS (AUDIT CONTROLLED)
  // ----------------------------------------------------

  /**
   * Manual Admin Balance Adjustment with mandatory audit trail
   */
  public adminAdjustBalance(
    dto: AdminBalanceAdjustmentDTO,
    targetUser: User
  ): { success: boolean; transaction?: TokenTransaction; error?: string } {
    if (!dto.reason || !dto.reason.trim()) {
      return { success: false, error: 'A mandatory audit reason is required for any balance adjustment.' };
    }

    if (dto.amount === 0) {
      return { success: false, error: 'Adjustment amount cannot be zero.' };
    }

    const currentBalance = this.getUserBalance(dto.user_id);
    const newBalance = currentBalance + dto.amount;

    if (newBalance < 0) {
      return {
        success: false,
        error: `Cannot apply negative adjustment. Resulting balance would be ${newBalance} VT (negative balance forbidden).`,
      };
    }

    const txns = this.getStoredTransactions();
    const txnId = `txn-adj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const adjustmentTxn: TokenTransaction = {
      id: txnId,
      user_id: dto.user_id,
      user_name: targetUser.name,
      user_email: targetUser.email,
      type: 'ADMIN_ADJUSTMENT',
      amount: dto.amount,
      balance_after: newBalance,
      reference_type: 'admin_support',
      reference_id: `admin-${dto.admin_id}`,
      description: `Admin Adjustment (${dto.amount > 0 ? `+${dto.amount}` : dto.amount} VT): ${dto.reason.trim()}`,
      status: 'COMPLETED',
      created_at: new Date().toISOString(),
      admin_id: dto.admin_id,
      admin_name: dto.admin_name,
      admin_reason: dto.reason.trim(),
    };

    txns.push(adjustmentTxn);
    this.saveTransactions(txns);

    // Activity Log
    activityService.logEvent({
      user_id: dto.admin_id,
      user_name: dto.admin_name,
      event_type: 'TOKEN_ADJUSTED',
      resource_type: 'token_wallet',
      resource_id: txnId,
      resource_title: `Adjusted balance for ${targetUser.name}: ${dto.amount > 0 ? `+${dto.amount}` : dto.amount} VT`,
      metadata: {
        student_id: dto.user_id,
        amount: dto.amount,
        reason: dto.reason,
        balance_after: newBalance,
      },
    });

    // Notification
    if (dto.amount > 0) {
      notificationService.notifyTokenCredited(
        dto.user_id,
        dto.amount,
        `Admin adjustment: ${dto.reason}`
      );
    }

    return {
      success: true,
      transaction: adjustmentTxn,
    };
  }

  /**
   * Process a refund for a spent or purchased transaction
   */
  public processRefund(
    transactionId: string,
    admin: User,
    reason: string
  ): { success: boolean; transaction?: TokenTransaction; error?: string } {
    if (admin.role !== 'admin') {
      return { success: false, error: 'Only admins can issue refunds.' };
    }

    const txns = this.getStoredTransactions();
    const origIndex = txns.findIndex((t) => t.id === transactionId);
    if (origIndex === -1) {
      return { success: false, error: 'Original transaction not found.' };
    }

    const orig = txns[origIndex];
    if (orig.status === 'REVERSED') {
      return { success: false, error: 'Transaction has already been refunded/reversed.' };
    }

    // If it was a SPEND, we restore the spent tokens (+amount)
    // If it was a PURCHASE, payment refund is also triggered
    const refundAmount = Math.abs(orig.amount);
    const currentBalance = this.getUserBalance(orig.user_id);
    const newBalance = currentBalance + refundAmount;

    // Mark original as REVERSED
    txns[origIndex].status = 'REVERSED';

    const refundTxnId = `txn-ref-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const refundTxn: TokenTransaction = {
      id: refundTxnId,
      user_id: orig.user_id,
      user_name: orig.user_name,
      user_email: orig.user_email,
      type: 'REFUND',
      amount: refundAmount,
      balance_after: newBalance,
      reference_type: 'refund',
      reference_id: orig.id,
      description: `Refund for ${orig.description}: ${reason}`,
      status: 'COMPLETED',
      created_at: new Date().toISOString(),
      admin_id: admin.id,
      admin_name: admin.name,
      admin_reason: reason,
    };

    txns.push(refundTxn);
    this.saveTransactions(txns);

    // If original was linked to payment, refund payment too
    if (orig.type === 'PURCHASE' && orig.reference_id) {
      paymentService.refundPayment(orig.reference_id, reason);
    }

    // Activity Log
    activityService.logEvent({
      user_id: admin.id,
      user_name: admin.name,
      event_type: 'TOKEN_REFUNDED',
      resource_type: 'token_transaction',
      resource_id: refundTxnId,
      resource_title: `Refunded ${refundAmount} VT to ${orig.user_name}`,
      metadata: {
        orig_txn_id: orig.id,
        amount: refundAmount,
        reason,
      },
    });

    // Notification
    notificationService.notifyRefundProcessed(orig.user_id, refundAmount, reason);

    return {
      success: true,
      transaction: refundTxn,
    };
  }

  // ----------------------------------------------------
  // PACKAGES CRUD (ADMIN MANAGED)
  // ----------------------------------------------------

  public getPackages(activeOnly: boolean = true): TokenPackage[] {
    const pkgs = this.getStoredPackages();
    const sorted = [...pkgs].sort((a, b) => a.display_order - b.display_order);
    if (activeOnly) return sorted.filter((p) => p.active);
    return sorted;
  }

  public getPackageById(id: string): TokenPackage | undefined {
    return this.getStoredPackages().find((p) => p.id === id);
  }

  public createPackage(pkgData: Partial<TokenPackage>): TokenPackage {
    const pkgs = this.getStoredPackages();
    const newPkg: TokenPackage = {
      id: `pkg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: pkgData.name || 'Custom Token Pack',
      rupee_amount: Number(pkgData.rupee_amount) || 10,
      token_amount: Number(pkgData.token_amount) || 100,
      bonus_tokens: Number(pkgData.bonus_tokens) || 0,
      active: pkgData.active !== undefined ? pkgData.active : true,
      display_order: pkgs.length + 1,
      badge: pkgData.badge || '',
      popular: !!pkgData.popular,
      created_at: new Date().toISOString(),
    };

    pkgs.push(newPkg);
    this.savePackages(pkgs);
    return newPkg;
  }

  public updatePackage(id: string, updates: Partial<TokenPackage>): TokenPackage | null {
    const pkgs = this.getStoredPackages();
    const index = pkgs.findIndex((p) => p.id === id);
    if (index === -1) return null;

    pkgs[index] = { ...pkgs[index], ...updates };
    this.savePackages(pkgs);
    return pkgs[index];
  }

  public deletePackage(id: string): boolean {
    const pkgs = this.getStoredPackages();
    const filtered = pkgs.filter((p) => p.id !== id);
    if (filtered.length !== pkgs.length) {
      this.savePackages(filtered);
      return true;
    }
    return false;
  }

  // ----------------------------------------------------
  // TRANSACTIONS QUERYING & ADMIN REPORTS
  // ----------------------------------------------------

  public getUserTransactions(
    userId: string,
    filterType?: TokenTransactionType | 'ALL'
  ): TokenTransaction[] {
    const txns = this.getStoredTransactions().filter((t) => t.user_id === userId);
    let filtered = txns;
    if (filterType && filterType !== 'ALL') {
      filtered = filtered.filter((t) => t.type === filterType);
    }
    return filtered.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public getAllTransactions(options: {
    type?: TokenTransactionType | 'ALL';
    searchQuery?: string;
    studentId?: string;
    startDate?: string;
    endDate?: string;
  } = {}): TokenTransaction[] {
    let txns = this.getStoredTransactions();

    if (options.type && options.type !== 'ALL') {
      txns = txns.filter((t) => t.type === options.type);
    }

    if (options.studentId) {
      txns = txns.filter((t) => t.user_id === options.studentId);
    }

    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      txns = txns.filter(
        (t) =>
          t.user_name.toLowerCase().includes(q) ||
          t.user_email.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }

    if (options.startDate) {
      const start = new Date(options.startDate).getTime();
      txns = txns.filter((t) => new Date(t.created_at).getTime() >= start);
    }

    if (options.endDate) {
      const end = new Date(options.endDate).getTime();
      txns = txns.filter((t) => new Date(t.created_at).getTime() <= end);
    }

    return txns.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  // ----------------------------------------------------
  // PLATFORM TOKEN ANALYTICS & METRICS
  // ----------------------------------------------------

  public getPlatformTokenStats() {
    const txns = this.getStoredTransactions().filter((t) => t.status === 'COMPLETED');
    const unlocks = this.getStoredUnlocks();
    const rewards = this.getStoredRewards();
    const packages = this.getStoredPackages();

    const totalPurchased = txns
      .filter((t) => t.type === 'PURCHASE')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalEarned = txns
      .filter((t) => t.type === 'EARNED')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalFreeCredited = txns
      .filter((t) => t.type === 'FREE_CREDIT')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpent = Math.abs(
      txns.filter((t) => t.type === 'SPENT').reduce((sum, t) => sum + t.amount, 0)
    );

    const totalRefunded = txns
      .filter((t) => t.type === 'REFUND')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalAdjustments = txns
      .filter((t) => t.type === 'ADMIN_ADJUSTMENT')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOutstandingInCirculation =
      totalPurchased + totalEarned + totalFreeCredited + totalAdjustments + totalRefunded - totalSpent;

    const pendingRewardsCount = rewards.filter((r) => r.status === 'PENDING').length;
    const activePackagesCount = packages.filter((p) => p.active).length;

    return {
      totalPurchased,
      totalEarned,
      totalFreeCredited,
      totalSpent,
      totalRefunded,
      totalOutstandingInCirculation: Math.max(0, totalOutstandingInCirculation),
      totalUnlocksCount: unlocks.length,
      pendingRewardsCount,
      activePackagesCount,
      totalTransactionsCount: txns.length,
    };
  }
}

export const tokenService = new TokenService();
