import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, Transaction, Notification, UserProfile, Wallet, ExternalWallet } from '../types';
import { generateWalletAddress, getCryptoById } from '../data/cryptocurrencies';

interface AppContextType extends AppState {
  login: (profile: UserProfile) => void;
  logout: () => void;
  register: (profile: UserProfile) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  updateUsdBalance: (amount: number) => void;
  createWallet: (cryptoId: string) => Wallet;
  updateWallet: (cryptoId: string, amount: number) => void;
  addExternalWallet: (wallet: ExternalWallet) => void;
  removeExternalWallet: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  toggleBalancesHidden: () => void;
  getWalletByCrypto: (cryptoId: string) => Wallet | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

const DEFAULT_STATE: AppState = {
  isAuthenticated: false,
  userProfile: null,
  usdBalance: 0,
  wallets: [],
  externalWallets: [],
  transactions: [],
  notifications: [],
  balancesHidden: false,
};

// Demo user with existing data (for login)
const DEMO_USER_STATE: AppState = {
  isAuthenticated: true,
  userProfile: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'demo@xcoins.com',
    phone: '+1234567890',
    dateOfBirth: '1990-01-01',
    address: '123 Main St, New York, NY 10001',
    tier: 'gold',
  },
  usdBalance: 10000.00,
  wallets: [
    { id: '1', cryptoId: 'bitcoin', amount: 0.5, address: generateWalletAddress('BTC') },
    { id: '2', cryptoId: 'ethereum', amount: 2.5, address: generateWalletAddress('ETH') },
    { id: '3', cryptoId: 'solana', amount: 10.0, address: generateWalletAddress('SOL') },
  ],
  externalWallets: [],
  transactions: [],
  notifications: [],
  balancesHidden: false,
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);

  const login = (profile: UserProfile) => {
    setState({ ...DEMO_USER_STATE, userProfile: profile, isAuthenticated: true });
  };

  const logout = () => {
    setState(DEFAULT_STATE);
  };

  const register = (profile: UserProfile) => {
    setState({
      ...DEFAULT_STATE,
      isAuthenticated: true,
      userProfile: profile,
      usdBalance: 0,
    });
  };

  const addTransaction = (transaction: Transaction) => {
    setState(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions],
    }));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  };

  const updateUsdBalance = (amount: number) => {
    setState(prev => ({
      ...prev,
      usdBalance: prev.usdBalance + amount,
    }));
  };

  const createWallet = (cryptoId: string): Wallet => {
    const crypto = getCryptoById(cryptoId);
    if (!crypto) throw new Error('Invalid crypto');

    const newWallet: Wallet = {
      id: Math.random().toString(36).substring(7),
      cryptoId,
      amount: 0,
      address: generateWalletAddress(crypto.symbol),
    };

    setState(prev => ({
      ...prev,
      wallets: [...prev.wallets, newWallet],
    }));

    return newWallet;
  };

  const updateWallet = (cryptoId: string, amount: number) => {
    setState(prev => {
      const existingWallet = prev.wallets.find(w => w.cryptoId === cryptoId);

      if (existingWallet) {
        return {
          ...prev,
          wallets: prev.wallets.map(w =>
            w.cryptoId === cryptoId
              ? { ...w, amount: w.amount + amount }
              : w
          ),
        };
      } else {
        const crypto = getCryptoById(cryptoId);
        return {
          ...prev,
          wallets: [
            ...prev.wallets,
            {
              id: Math.random().toString(36).substring(7),
              cryptoId,
              amount,
              address: generateWalletAddress(crypto?.symbol || ''),
            },
          ],
        };
      }
    });
  };

  const addExternalWallet = (wallet: ExternalWallet) => {
    setState(prev => ({
      ...prev,
      externalWallets: [...prev.externalWallets, wallet],
    }));
  };

  const removeExternalWallet = (id: string) => {
    setState(prev => ({
      ...prev,
      externalWallets: prev.externalWallets.filter(w => w.id !== id),
    }));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      read: false,
    };

    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications],
    }));

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  };

  const markNotificationAsRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  };

  const toggleBalancesHidden = () => {
    setState(prev => ({
      ...prev,
      balancesHidden: !prev.balancesHidden,
    }));
  };

  const getWalletByCrypto = (cryptoId: string): Wallet | undefined => {
    return state.wallets.find(w => w.cryptoId === cryptoId);
  };

  const value: AppContextType = {
    ...state,
    login,
    logout,
    register,
    addTransaction,
    updateTransaction,
    updateUsdBalance,
    createWallet,
    updateWallet,
    addExternalWallet,
    removeExternalWallet,
    addNotification,
    removeNotification,
    markNotificationAsRead,
    toggleBalancesHidden,
    getWalletByCrypto,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
