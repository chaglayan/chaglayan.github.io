import React, { useState } from 'react';
import { Modal } from './Modal';
import { useApp } from '../context/AppContext';
import { getCryptoById } from '../data/cryptocurrencies';
import { simulateTransaction, completeTransaction } from '../utils/simulation';
import { formatCurrency, formatCrypto } from '../utils/format';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellModal: React.FC<SellModalProps> = ({ isOpen, onClose }) => {
  const {
    wallets,
    updateUsdBalance,
    updateWallet,
    addTransaction,
    updateTransaction,
    addNotification,
  } = useApp();

  const [selectedWallet, setSelectedWallet] = useState(wallets[0]?.id || '');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const wallet = wallets.find((w) => w.id === selectedWallet);
  const crypto = wallet ? getCryptoById(wallet.cryptoId) : null;
  const usdAmount = crypto && cryptoAmount ? parseFloat(cryptoAmount) * crypto.currentPrice : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sellAmount = parseFloat(cryptoAmount);

    if (!sellAmount || sellAmount <= 0) {
      addNotification({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }

    if (!wallet || sellAmount > wallet.amount) {
      addNotification({
        type: 'error',
        title: 'Insufficient Balance',
        message: 'You do not have enough crypto to sell',
      });
      return;
    }

    if (!crypto) return;

    setIsProcessing(true);

    try {
      const transaction = await simulateTransaction({
        type: 'sell',
        fromCurrency: crypto.symbol,
        toCurrency: 'USD',
        fromAmount: sellAmount,
        toAmount: usdAmount,
        usdAmount: usdAmount,
      });

      addTransaction(transaction);
      addNotification({
        type: 'info',
        title: 'Sale Initiated',
        message: `Selling ${formatCrypto(sellAmount, 6)} ${crypto.symbol}...`,
      });

      const completedTransaction = await completeTransaction(transaction);
      updateTransaction(completedTransaction.id, { status: 'completed' });

      // Update balances
      updateWallet(wallet.cryptoId, -sellAmount);
      updateUsdBalance(usdAmount);

      addNotification({
        type: 'success',
        title: 'Sale Completed',
        message: `Successfully sold ${formatCrypto(sellAmount, 6)} ${crypto.symbol} for ${formatCurrency(usdAmount)}!`,
      });

      setCryptoAmount('');
      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: 'There was an error processing your sale',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (wallets.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Sell Crypto">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You don't have any crypto to sell.</p>
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sell Crypto">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Cryptocurrency
          </label>
          <select
            value={selectedWallet}
            onChange={(e) => {
              setSelectedWallet(e.target.value);
              setCryptoAmount('');
            }}
            className="input-field"
            disabled={isProcessing}
          >
            {wallets.map((w) => {
              const c = getCryptoById(w.cryptoId);
              return c ? (
                <option key={w.id} value={w.id}>
                  {c.name} ({c.symbol}) - {formatCrypto(w.amount, 6)} available
                </option>
              ) : null;
            })}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Sell ({crypto?.symbol})
          </label>
          <input
            type="number"
            step="0.00000001"
            min="0"
            max={wallet?.amount || 0}
            value={cryptoAmount}
            onChange={(e) => setCryptoAmount(e.target.value)}
            className="input-field"
            placeholder="0.00000000"
            disabled={isProcessing}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Available: {wallet ? formatCrypto(wallet.amount, 8) : '0'} {crypto?.symbol}
          </p>
        </div>

        {crypto && cryptoAmount && parseFloat(cryptoAmount) > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">You will receive:</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(usdAmount)}
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
            className="btn-danger flex-1"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Sell'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
