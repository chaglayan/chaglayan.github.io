import React, { useState } from 'react';
import { Modal } from './Modal';
import { useApp } from '../context/AppContext';
import { cryptocurrencies, getCryptoById } from '../data/cryptocurrencies';
import { simulateTransaction, completeTransaction } from '../utils/simulation';
import { formatCurrency, formatCrypto } from '../utils/format';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({ isOpen, onClose }) => {
  const {
    usdBalance,
    updateUsdBalance,
    updateWallet,
    addTransaction,
    updateTransaction,
    addNotification,
  } = useApp();

  const [selectedCrypto, setSelectedCrypto] = useState(cryptocurrencies[0].id);
  const [usdAmount, setUsdAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const crypto = getCryptoById(selectedCrypto);
  const cryptoAmount = crypto && usdAmount ? parseFloat(usdAmount) / crypto.currentPrice : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const buyAmount = parseFloat(usdAmount);

    if (!buyAmount || buyAmount <= 0) {
      addNotification({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }

    if (buyAmount > usdBalance) {
      addNotification({
        type: 'error',
        title: 'Insufficient Funds',
        message: 'You do not have enough USD balance',
      });
      return;
    }

    if (!crypto) return;

    setIsProcessing(true);

    try {
      const transaction = await simulateTransaction({
        type: 'buy',
        fromCurrency: 'USD',
        toCurrency: crypto.symbol,
        fromAmount: buyAmount,
        toAmount: cryptoAmount,
        usdAmount: buyAmount,
      });

      addTransaction(transaction);
      addNotification({
        type: 'info',
        title: 'Purchase Initiated',
        message: `Buying ${formatCrypto(cryptoAmount, 6)} ${crypto.symbol}...`,
      });

      const completedTransaction = await completeTransaction(transaction);
      updateTransaction(completedTransaction.id, { status: 'completed' });

      // Update balances
      updateUsdBalance(-buyAmount);
      updateWallet(selectedCrypto, cryptoAmount);

      addNotification({
        type: 'success',
        title: 'Purchase Completed',
        message: `Successfully purchased ${formatCrypto(cryptoAmount, 6)} ${crypto.symbol}!`,
      });

      setUsdAmount('');
      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: 'There was an error processing your purchase',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buy Crypto">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Cryptocurrency
          </label>
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="input-field"
            disabled={isProcessing}
          >
            {cryptocurrencies.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol}) - {formatCurrency(crypto.currentPrice)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Spend (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500 text-lg">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              max={usdBalance}
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              className="input-field pl-8"
              placeholder="0.00"
              disabled={isProcessing}
              required
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Available: {formatCurrency(usdBalance)}
          </p>
        </div>

        {crypto && usdAmount && parseFloat(usdAmount) > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">You will receive:</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCrypto(cryptoAmount, 6)} {crypto.symbol}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-success flex-1"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Buy'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
