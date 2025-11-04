export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  currentPrice: number;
  change24h: number;
  type: 'crypto' | 'stablecoin';
}

export interface Wallet {
  id: string;
  cryptoId: string;
  amount: number;
  address: string;
}

export interface ExternalWallet {
  id: string;
  name: string;
  address: string;
  cryptoId: string;
}

export interface PaymentMethod {
  id: string;
  type: 'usd_account' | 'credit_card' | 'debit_card' | 'skrill' | 'paypal';
  name: string;
  fee: number;
  isInstant: boolean;
  label?: string;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'swap' | 'topup' | 'withdraw_usd' | 'deposit_crypto' | 'withdraw_crypto';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: Date;
  fromCurrency?: string;
  toCurrency?: string;
  fromAmount?: number;
  toAmount?: number;
  usdAmount?: number;
  paymentMethod?: string;
  address?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export type UserTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  tier: UserTier;
}

export interface AppState {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  usdBalance: number;
  wallets: Wallet[];
  externalWallets: ExternalWallet[];
  transactions: Transaction[];
  notifications: Notification[];
  balancesHidden: boolean;
}
