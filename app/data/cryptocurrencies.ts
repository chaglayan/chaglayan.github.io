import { Cryptocurrency, PaymentMethod } from '../types';

export const cryptocurrencies: Cryptocurrency[] = [
  // Top Cryptocurrencies
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '₿',
    currentPrice: 67845.32,
    change24h: 2.45,
    type: 'crypto',
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'Ξ',
    currentPrice: 3421.18,
    change24h: -1.23,
    type: 'crypto',
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    icon: '◎',
    currentPrice: 178.92,
    change24h: 5.67,
    type: 'crypto',
  },
  {
    id: 'xrp',
    symbol: 'XRP',
    name: 'XRP',
    icon: '✕',
    currentPrice: 0.62,
    change24h: 1.85,
    type: 'crypto',
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    icon: '₳',
    currentPrice: 0.58,
    change24h: -0.89,
    type: 'crypto',
  },
  {
    id: 'avalanche',
    symbol: 'AVAX',
    name: 'Avalanche',
    icon: '🔺',
    currentPrice: 36.42,
    change24h: 4.21,
    type: 'crypto',
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    icon: '●',
    currentPrice: 7.23,
    change24h: 3.12,
    type: 'crypto',
  },
  {
    id: 'polygon',
    symbol: 'MATIC',
    name: 'Polygon',
    icon: '⬡',
    currentPrice: 0.89,
    change24h: -2.14,
    type: 'crypto',
  },
  // Stablecoins
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether',
    icon: '₮',
    currentPrice: 1.00,
    change24h: 0.01,
    type: 'stablecoin',
  },
  {
    id: 'usd-coin',
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '$',
    currentPrice: 1.00,
    change24h: 0.00,
    type: 'stablecoin',
  },
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'usd_account',
    type: 'usd_account',
    name: 'USD Account',
    fee: 0,
    isInstant: true,
    label: 'Lowest Fee • Instant',
  },
  {
    id: 'credit_card',
    type: 'credit_card',
    name: 'Credit Card',
    fee: 2.99,
    isInstant: true,
    label: 'Instant',
  },
  {
    id: 'debit_card',
    type: 'debit_card',
    name: 'Debit Card',
    fee: 1.49,
    isInstant: true,
    label: 'Instant',
  },
  {
    id: 'skrill',
    type: 'skrill',
    name: 'Skrill',
    fee: 1.99,
    isInstant: true,
    label: 'Instant',
  },
  {
    id: 'paypal',
    type: 'paypal',
    name: 'PayPal',
    fee: 2.49,
    isInstant: false,
    label: '1-3 days',
  },
];

export const getCryptoById = (id: string): Cryptocurrency | undefined => {
  return cryptocurrencies.find(crypto => crypto.id === id);
};

export const getCryptoBySymbol = (symbol: string): Cryptocurrency | undefined => {
  return cryptocurrencies.find(crypto => crypto.symbol === symbol);
};

export const generateWalletAddress = (cryptoSymbol: string): string => {
  const prefixes: { [key: string]: string } = {
    BTC: '1',
    ETH: '0x',
    SOL: 'Sol',
    XRP: 'r',
    ADA: 'addr1',
    AVAX: '0x',
    DOT: '1',
    MATIC: '0x',
    USDT: '0x',
    USDC: '0x',
  };

  const prefix = prefixes[cryptoSymbol] || '0x';
  const randomPart = Math.random().toString(36).substring(2, 15) +
                     Math.random().toString(36).substring(2, 15);

  return prefix + randomPart.substring(0, 40);
};
