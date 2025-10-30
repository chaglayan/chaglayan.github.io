import { Transaction } from '../types';

export const simulateTransaction = async (
  transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>
): Promise<Transaction> => {
  const newTransaction: Transaction = {
    ...transaction,
    id: Math.random().toString(36).substring(7),
    timestamp: new Date(),
    status: 'pending',
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...newTransaction, status: 'processing' });
    }, 500);
  });
};

export const completeTransaction = async (transaction: Transaction): Promise<Transaction> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...transaction, status: 'completed' });
    }, 2000);
  });
};
