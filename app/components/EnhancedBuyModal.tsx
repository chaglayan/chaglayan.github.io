import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cryptocurrencies, getCryptoById, paymentMethods } from '../data/cryptocurrencies';
import { simulateTransaction, completeTransaction } from '../utils/simulation';
import { formatCurrency, formatCrypto } from '../utils/format';

interface EnhancedBuyModalProps {
  onClose: () => void;
  preselectedCrypto?: string;
}

export const EnhancedBuyModal: React.FC<EnhancedBuyModalProps> = ({ onClose, preselectedCrypto }) => {
  const {
    usdBalance,
    wallets,
    updateUsdBalance,
    updateWallet,
    createWallet,
    addTransaction,
    updateTransaction,
    addNotification,
  } = useApp();

  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const [selectedPayment, setSelectedPayment] = useState('usd_account');
  const [selectedCrypto, setSelectedCrypto] = useState(preselectedCrypto || cryptocurrencies[0].id);
  const [useXcoinsWallet, setUseXcoinsWallet] = useState(true);
  const [usdAmount, setUsdAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const crypto = getCryptoById(selectedCrypto);
  const cryptoAmount = crypto && usdAmount ? parseFloat(usdAmount) / crypto.currentPrice : 0;
  const paymentMethod = paymentMethods.find(p => p.id === selectedPayment);
  const fee = paymentMethod ? (parseFloat(usdAmount) * paymentMethod.fee) / 100 : 0;
  const total = parseFloat(usdAmount) + fee;
  const hasXcoinsWallet = wallets.some(w => w.cryptoId === selectedCrypto);

  const handleContinue = () => {
    const buyAmount = parseFloat(usdAmount);

    if (!buyAmount || buyAmount <= 0) {
      addNotification({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }

    if (selectedPayment === 'usd_account' && buyAmount > usdBalance) {
      addNotification({
        type: 'error',
        title: 'Insufficient Funds',
        message: 'You do not have enough USD balance',
      });
      return;
    }

    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!crypto) return;

    setIsProcessing(true);

    try {
      // Create wallet if needed
      if (useXcoinsWallet && !hasXcoinsWallet) {
        createWallet(selectedCrypto);
      }

      const transaction = await simulateTransaction({
        type: 'buy',
        fromCurrency: 'USD',
        toCurrency: crypto.symbol,
        fromAmount: total,
        toAmount: cryptoAmount,
        usdAmount: total,
        paymentMethod: selectedPayment,
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
      if (selectedPayment === 'usd_account') {
        updateUsdBalance(-total);
      }

      if (useXcoinsWallet) {
        updateWallet(selectedCrypto, cryptoAmount);
      }

      addNotification({
        type: 'success',
        title: 'Purchase Completed',
        message: `Successfully purchased ${formatCrypto(cryptoAmount, 6)} ${crypto.symbol}!`,
      });

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

  if (step === 'confirm') {
    return (
      <div className="fixed inset-0 z-50 flex items-end animate-slide-up">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setStep('select')} />
        <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Confirm Purchase</h2>
            <button onClick={() => setStep('select')} className="text-gray-400 text-2xl">×</button>
          </div>

          <div className="ios-card mb-4">
            <div className="text-center py-6">
              <div className="text-6xl mb-4">{crypto?.icon}</div>
              <p className="text-gray-600 mb-2">You're buying</p>
              <p className="text-3xl font-bold mb-2">
                {formatCrypto(cryptoAmount, 6)} {crypto?.symbol}
              </p>
              <p className="text-lg text-gray-600">{formatCurrency(parseFloat(usdAmount))}</p>
            </div>
          </div>

          <div className="ios-card space-y-3 mb-4">
            <h3 className="font-semibold">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">{paymentMethod?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destination</span>
                <span className="font-medium">{useXcoinsWallet ? 'Xcoins Wallet' : 'External Wallet'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">{formatCurrency(parseFloat(usdAmount))}</span>
              </div>
              {fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee ({paymentMethod?.fee}%)</span>
                  <span className="font-medium">{formatCurrency(fee)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="btn-success w-full"
          >
            {isProcessing ? 'Processing...' : 'Confirm Purchase'}
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
          <h2 className="text-2xl font-bold">Buy Crypto</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl">×</button>
        </div>

        {/* Cryptocurrency Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cryptocurrency</label>
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="ios-input"
          >
            {cryptocurrencies.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol}) - {formatCurrency(crypto.currentPrice)}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div className="space-y-2">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`ios-list-item w-full flex items-center justify-between ${
                  selectedPayment === method.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex-1">
                  <p className="font-semibold">{method.name}</p>
                  <p className="text-sm text-gray-600">{method.label}</p>
                  {method.id === 'usd_account' && (
                    <p className="text-xs text-gray-500">Balance: {formatCurrency(usdBalance)}</p>
                  )}
                </div>
                {selectedPayment === method.id && (
                  <div className="text-blue-500 text-xl">✓</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Wallet</label>
          <div className="space-y-2">
            <button
              onClick={() => setUseXcoinsWallet(true)}
              className={`ios-list-item w-full flex items-center justify-between ${
                useXcoinsWallet ? 'bg-blue-50' : ''
              }`}
            >
              <div>
                <p className="font-semibold">Xcoins Wallet</p>
                {!hasXcoinsWallet && (
                  <p className="text-sm text-blue-600">Will be created automatically</p>
                )}
              </div>
              {useXcoinsWallet && <div className="text-blue-500 text-xl">✓</div>}
            </button>
            <button
              onClick={() => setUseXcoinsWallet(false)}
              className={`ios-list-item w-full flex items-center justify-between ${
                !useXcoinsWallet ? 'bg-blue-50' : ''
              }`}
            >
              <div>
                <p className="font-semibold">External Wallet</p>
                <p className="text-sm text-gray-600">Send to another address</p>
              </div>
              {!useXcoinsWallet && <div className="text-blue-500 text-xl">✓</div>}
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Spend (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-4 text-gray-500 text-xl">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              className="ios-input pl-12 text-xl"
              placeholder="0.00"
            />
          </div>
          {crypto && usdAmount && parseFloat(usdAmount) > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              You'll receive: {formatCrypto(cryptoAmount, 6)} {crypto.symbol}
            </p>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={!usdAmount || parseFloat(usdAmount) <= 0}
          className="btn-primary w-full disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
