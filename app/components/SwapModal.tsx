import React, { useState } from 'react';
import { Modal } from './Modal';
import { useApp } from '../context/AppContext';
import { cryptocurrencies, getCryptoById } from '../data/cryptocurrencies';
import { simulateTransaction, completeTransaction } from '../utils/simulation';
import { formatCrypto } from '../utils/format';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({ isOpen, onClose }) => {
  const { wallets, updateWallet, addTransaction, updateTransaction, addNotification } = useApp();

  const [fromWalletId, setFromWalletId] = useState(wallets[0]?.id || '');
  const [toCryptoId, setToCryptoId] = useState(cryptocurrencies[0]?.id || '');
  const [fromAmount, setFromAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fromWallet = wallets.find((w) => w.id === fromWalletId);
  const fromCrypto = fromWallet ? getCryptoById(fromWallet.cryptoId) : null;
  const toCrypto = getCryptoById(toCryptoId);

  const toAmount =
    fromCrypto && toCrypto && fromAmount
      ? (parseFloat(fromAmount) * fromCrypto.currentPrice) / toCrypto.currentPrice
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const swapAmount = parseFloat(fromAmount);

    if (!swapAmount || swapAmount <= 0) {
      addNotification({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }

    if (!fromWallet || swapAmount > fromWallet.amount) {
      addNotification({
        type: 'error',
        title: 'Insufficient Balance',
        message: 'You do not have enough crypto to swap',
      });
      return;
    }

    if (!fromCrypto || !toCrypto) return;

    if (fromCrypto.id === toCrypto.id) {
      addNotification({
        type: 'error',
        title: 'Invalid Swap',
        message: 'Cannot swap to the same cryptocurrency',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const transaction = await simulateTransaction({
        type: 'swap',
        fromCurrency: fromCrypto.symbol,
        toCurrency: toCrypto.symbol,
        fromAmount: swapAmount,
        toAmount: toAmount,
      });

      addTransaction(transaction);
      addNotification({
        type: 'info',
        title: 'Swap Initiated',
        message: `Swapping ${formatCrypto(swapAmount, 6)} ${fromCrypto.symbol} to ${toCrypto.symbol}...`,
      });

      const completedTransaction = await completeTransaction(transaction);
      updateTransaction(completedTransaction.id, { status: 'completed' });

      // Update balances
      updateWallet(fromWallet.cryptoId, -swapAmount);
      updateWallet(toCryptoId, toAmount);

      addNotification({
        type: 'success',
        title: 'Swap Completed',
        message: `Successfully swapped ${formatCrypto(swapAmount, 6)} ${fromCrypto.symbol} for ${formatCrypto(toAmount, 6)} ${toCrypto.symbol}!`,
      });

      setFromAmount('');
      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: 'There was an error processing your swap',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (wallets.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Swap Crypto">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You don't have any crypto to swap.</p>
          <button onClick={onClose} className="btn-primary">
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Swap Crypto">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <select
            value={fromWalletId}
            onChange={(e) => {
              setFromWalletId(e.target.value);
              setFromAmount('');
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
            Amount ({fromCrypto?.symbol})
          </label>
          <input
            type="number"
            step="0.00000001"
            min="0"
            max={fromWallet?.amount || 0}
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="input-field"
            placeholder="0.00000000"
            disabled={isProcessing}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Available: {fromWallet ? formatCrypto(fromWallet.amount, 8) : '0'} {fromCrypto?.symbol}
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 rounded-full p-2">
            <span className="text-2xl">⇅</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <select
            value={toCryptoId}
            onChange={(e) => setToCryptoId(e.target.value)}
            className="input-field"
            disabled={isProcessing}
          >
            {cryptocurrencies.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol})
              </option>
            ))}
          </select>
        </div>

        {fromCrypto && toCrypto && fromAmount && parseFloat(fromAmount) > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">You will receive:</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCrypto(toAmount, 6)} {toCrypto.symbol}
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
            className="btn-primary flex-1"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Swap'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
