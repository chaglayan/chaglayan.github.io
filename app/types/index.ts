export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  currentPrice: number;
  change24h: number;
}

export interface Wallet {
  id: string;
  cryptoId: string;
  amount: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'swap' | 'topup';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: Date;
  fromCurrency?: string;
  toCurrency?: string;
  fromAmount?: number;
  toAmount?: number;
  usdAmount?: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
}

export interface AppState {
  usdBalance: number;
  wallets: Wallet[];
  transactions: Transaction[];
  notifications: Notification[];
  balancesHidden: boolean;
}
