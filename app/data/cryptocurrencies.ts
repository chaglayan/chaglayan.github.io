import { Cryptocurrency } from '../types';

export const cryptocurrencies: Cryptocurrency[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '₿',
    currentPrice: 67845.32,
    change24h: 2.45,
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'Ξ',
    currentPrice: 3421.18,
    change24h: -1.23,
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    icon: '◎',
    currentPrice: 178.92,
    change24h: 5.67,
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    icon: '₳',
    currentPrice: 0.58,
    change24h: -0.89,
  },
  {
    id: 'polkadot',
    symbol: 'DOT',
    name: 'Polkadot',
    icon: '●',
    currentPrice: 7.23,
    change24h: 3.12,
  },
];

export const getCryptoById = (id: string): Cryptocurrency | undefined => {
  return cryptocurrencies.find(crypto => crypto.id === id);
};

export const getCryptoBySymbol = (symbol: string): Cryptocurrency | undefined => {
  return cryptocurrencies.find(crypto => crypto.symbol === symbol);
};
