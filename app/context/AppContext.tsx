import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, Transaction, Notification } from '../types';

interface AppContextType extends AppState {
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  updateUsdBalance: (amount: number) => void;
  updateWallet: (cryptoId: string, amount: number) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  toggleBalancesHidden: () => void;
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

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    usdBalance: 10000.00,
    wallets: [
      { id: '1', cryptoId: 'bitcoin', amount: 0.5 },
      { id: '2', cryptoId: 'ethereum', amount: 2.5 },
      { id: '3', cryptoId: 'solana', amount: 10.0 },
    ],
    transactions: [],
    notifications: [],
    balancesHidden: false,
  });

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
        return {
          ...prev,
          wallets: [
            ...prev.wallets,
            {
              id: Math.random().toString(36).substring(7),
              cryptoId,
              amount,
            },
          ],
        };
      }
    });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
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

  const toggleBalancesHidden = () => {
    setState(prev => ({
      ...prev,
      balancesHidden: !prev.balancesHidden,
    }));
  };

  const value: AppContextType = {
    ...state,
    addTransaction,
    updateTransaction,
    updateUsdBalance,
    updateWallet,
    addNotification,
    removeNotification,
    toggleBalancesHidden,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
