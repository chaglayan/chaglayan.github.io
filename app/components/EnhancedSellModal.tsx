import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getCryptoById } from '../data/cryptocurrencies';
import { simulateTransaction, completeTransaction } from '../utils/simulation';
import { formatCurrency, formatCrypto } from '../utils/format';

interface EnhancedSellModalProps {
  onClose: () => void;
  preselectedWallet?: string;
}

export const EnhancedSellModal: React.FC<EnhancedSellModalProps> = ({ onClose, preselectedWallet }) => {
  const {
    wallets,
    updateUsdBalance,
    updateWallet,
    addTransaction,
    updateTransaction,
    addNotification,
  } = useApp();

  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const [selectedWallet, setSelectedWallet] = useState(preselectedWallet || wallets[0]?.id || '');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const wallet = wallets.find(w => w.id === selectedWallet);
  const crypto = wallet ? getCryptoById(wallet.cryptoId) : null;
  const usdAmount = crypto && cryptoAmount ? parseFloat(cryptoAmount) * crypto.currentPrice : 0;

  const handleContinue = () => {
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

    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!crypto || !wallet) return;

    setIsProcessing(true);

    try {
      const transaction = await simulateTransaction({
        type: 'sell',
        fromCurrency: crypto.symbol,
        toCurrency: 'USD',
        fromAmount: parseFloat(cryptoAmount),
        toAmount: usdAmount,
        usdAmount: usdAmount,
      });

      addTransaction(transaction);
      addNotification({
        type: 'info',
        title: 'Sale Initiated',
        message: `Selling ${formatCrypto(parseFloat(cryptoAmount), 6)} ${crypto.symbol}...`,
      });

      const completedTransaction = await completeTransaction(transaction);
      updateTransaction(completedTransaction.id, { status: 'completed' });

      updateWallet(wallet.cryptoId, -parseFloat(cryptoAmount));
      updateUsdBalance(usdAmount);

      addNotification({
        type: 'success',
        title: 'Sale Completed',
        message: `Successfully sold ${formatCrypto(parseFloat(cryptoAmount), 6)} ${crypto.symbol} for ${formatCurrency(usdAmount)}!`,
      });

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
      <div className="fixed inset-0 z-50 flex items-end animate-slide-up">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto p-6">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold mb-2">No Wallets Found</h2>
            <p className="text-gray-600 mb-6">
              You need to create a wallet and have crypto before you can sell.
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
            <h2 className="text-2xl font-bold">Confirm Sale</h2>
            <button onClick={() => setStep('select')} className="text-gray-400 text-2xl">×</button>
          </div>

          <div className="ios-card mb-4">
            <div className="text-center py-6">
              <div className="text-6xl mb-4">💰</div>
              <p className="text-gray-600 mb-2">You're selling</p>
              <p className="text-3xl font-bold mb-2">
                {formatCrypto(parseFloat(cryptoAmount), 6)} {crypto?.symbol}
              </p>
              <p className="text-lg text-gray-600">for {formatCurrency(usdAmount)}</p>
            </div>
          </div>

          <div className="ios-card space-y-3 mb-4">
            <h3 className="font-semibold">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">From</span>
                <span className="font-medium">{crypto?.name} Wallet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To</span>
                <span className="font-medium">USD Account</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate</span>
                <span className="font-medium">{formatCurrency(crypto?.currentPrice || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fee</span>
                <span className="font-medium text-green-500">$0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-base">
                <span>You'll receive</span>
                <span>{formatCurrency(usdAmount)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="btn-success w-full"
          >
            {isProcessing ? 'Processing...' : 'Confirm Sale'}
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
          <h2 className="text-2xl font-bold">Sell Crypto</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl">×</button>
        </div>

        {/* Wallet Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Wallet to Sell From
          </label>
          <select
            value={selectedWallet}
            onChange={(e) => {
              setSelectedWallet(e.target.value);
              setCryptoAmount('');
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
        <div className="mb-6">
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
            className="ios-input text-xl"
            placeholder="0.00000000"
          />
          <p className="text-sm text-gray-500 mt-2">
            Available: {wallet ? formatCrypto(wallet.amount, 8) : '0'} {crypto?.symbol}
          </p>
          {crypto && cryptoAmount && parseFloat(cryptoAmount) > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              You'll receive: {formatCurrency(usdAmount)}
            </p>
          )}
        </div>

        <div className="ios-card bg-blue-50 border border-blue-200 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Crypto will be sold from your Xcoins Wallet and USD will be added to your USD Account.
          </p>
        </div>

        <button
          onClick={handleContinue}
          disabled={!cryptoAmount || parseFloat(cryptoAmount) <= 0}
          className="btn-primary w-full disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
