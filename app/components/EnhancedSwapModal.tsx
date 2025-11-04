import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cryptocurrencies, getCryptoById } from '../data/cryptocurrencies';
import { simulateTransaction, completeTransaction } from '../utils/simulation';
import { formatCrypto } from '../utils/format';

interface EnhancedSwapModalProps {
  onClose: () => void;
}

export const EnhancedSwapModal: React.FC<EnhancedSwapModalProps> = ({ onClose }) => {
  const { wallets, updateWallet, addTransaction, updateTransaction, addNotification } = useApp();

  const [step, setStep] = useState<'select' | 'confirm'>('select');
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

  const handleContinue = () => {
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

    if (fromCrypto?.id === toCrypto?.id) {
      addNotification({
        type: 'error',
        title: 'Invalid Swap',
        message: 'Cannot swap to the same cryptocurrency',
      });
      return;
    }

    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!fromCrypto || !toCrypto || !fromWallet) return;

    setIsProcessing(true);

    try {
      const transaction = await simulateTransaction({
        type: 'swap',
        fromCurrency: fromCrypto.symbol,
        toCurrency: toCrypto.symbol,
        fromAmount: parseFloat(fromAmount),
        toAmount: toAmount,
      });

      addTransaction(transaction);
      addNotification({
        type: 'info',
        title: 'Swap Initiated',
        message: `Swapping ${formatCrypto(parseFloat(fromAmount), 6)} ${fromCrypto.symbol} to ${toCrypto.symbol}...`,
      });

      const completedTransaction = await completeTransaction(transaction);
      updateTransaction(completedTransaction.id, { status: 'completed' });

      updateWallet(fromWallet.cryptoId, -parseFloat(fromAmount));
      updateWallet(toCryptoId, toAmount);

      addNotification({
        type: 'success',
        title: 'Swap Completed',
        message: `Successfully swapped ${formatCrypto(parseFloat(fromAmount), 6)} ${fromCrypto.symbol} for ${formatCrypto(toAmount, 6)} ${toCrypto.symbol}!`,
      });

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
      <div className="fixed inset-0 z-50 flex items-end animate-slide-up">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto p-6">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold mb-2">No Wallets Found</h2>
            <p className="text-gray-600 mb-6">
              You need to create a wallet and have crypto before you can swap.
            </p>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="fixed inset-0 z-50 flex items-end animate-slide-up">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setStep('select')} />
        <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Confirm Swap</h2>
            <button onClick={() => setStep('select')} className="text-gray-400 text-2xl">×</button>
          </div>

          <div className="ios-card mb-4">
            <div className="text-center py-6">
              <div className="text-6xl mb-4">🔄</div>
              <p className="text-gray-600 mb-2">You're swapping</p>
              <p className="text-2xl font-bold mb-1">
                {formatCrypto(parseFloat(fromAmount), 6)} {fromCrypto?.symbol}
              </p>
              <p className="text-gray-600 mb-4">for</p>
              <p className="text-2xl font-bold">
                {formatCrypto(toAmount, 6)} {toCrypto?.symbol}
              </p>
            </div>
          </div>

          <div className="ios-card space-y-3 mb-4">
            <h3 className="font-semibold">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">From</span>
                <span className="font-medium">{fromCrypto?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To</span>
                <span className="font-medium">{toCrypto?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Exchange Rate</span>
                <span className="font-medium">
                  1 {fromCrypto?.symbol} = {(toAmount / parseFloat(fromAmount)).toFixed(6)} {toCrypto?.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fee</span>
                <span className="font-medium text-green-500">$0.00</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="btn-primary w-full"
          >
            {isProcessing ? 'Processing...' : 'Confirm Swap'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end animate-slide-up">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Swap Crypto</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl">×</button>
        </div>

        {/* From Wallet */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <select
            value={fromWalletId}
            onChange={(e) => {
              setFromWalletId(e.target.value);
              setFromAmount('');
            }}
            className="ios-input"
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

        {/* Amount */}
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
            className="ios-input text-xl"
            placeholder="0.00000000"
          />
          <p className="text-sm text-gray-500 mt-1">
            Available: {fromWallet ? formatCrypto(fromWallet.amount, 8) : '0'} {fromCrypto?.symbol}
          </p>
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 rounded-full p-3">
            <span className="text-3xl">⇅</span>
          </div>
        </div>

        {/* To Crypto */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <select
            value={toCryptoId}
            onChange={(e) => setToCryptoId(e.target.value)}
            className="ios-input"
          >
            {cryptocurrencies.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol})
              </option>
            ))}
          </select>
          {fromCrypto && toCrypto && fromAmount && parseFloat(fromAmount) > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              You'll receive: {formatCrypto(toAmount, 6)} {toCrypto.symbol}
            </p>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={!fromAmount || parseFloat(fromAmount) <= 0}
          className="btn-primary w-full disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
