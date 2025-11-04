import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getCryptoById } from '../data/cryptocurrencies';
import { formatCurrency, formatCrypto, maskValue } from '../utils/format';
import { simulateTransaction, completeTransaction } from '../utils/simulation';

interface WalletDetailModalProps {
  walletId: string;
  onClose: () => void;
  onBuyMore: (cryptoId: string) => void;
  onSell: (walletId: string) => void;
}

export const WalletDetailModal: React.FC<WalletDetailModalProps> = ({
  walletId,
  onClose,
  onBuyMore,
  onSell,
}) => {
  const { wallets, balancesHidden, addNotification, addTransaction, updateTransaction, updateWallet } = useApp();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const wallet = wallets.find(w => w.id === walletId);
  const crypto = wallet ? getCryptoById(wallet.cryptoId) : null;

  if (!wallet || !crypto) return null;

  const usdValue = wallet.amount * crypto.currentPrice;

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      addNotification({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const transaction = await simulateTransaction({
        type: 'deposit_crypto',
        toCurrency: crypto.symbol,
        toAmount: amount,
        address: wallet.address,
      });

      addTransaction(transaction);
      addNotification({
        type: 'info',
        title: 'Deposit Initiated',
        message: `Receiving ${formatCrypto(amount, 6)} ${crypto.symbol}...`,
      });

      const completedTransaction = await completeTransaction(transaction);
      updateTransaction(completedTransaction.id, { status: 'completed' });

      updateWallet(crypto.id, amount);

      addNotification({
        type: 'success',
        title: 'Deposit Completed',
        message: `Successfully received ${formatCrypto(amount, 6)} ${crypto.symbol}!`,
      });

      setShowDepositModal(false);
      setDepositAmount('');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: 'There was an error processing your deposit',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);

    if (!amount || amount <= 0) {
      addNotification({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }

    if (amount > wallet.amount) {
      addNotification({
        type: 'error',
        title: 'Insufficient Balance',
        message: 'You do not have enough crypto to withdraw',
      });
      return;
    }

    if (!withdrawAddress) {
      addNotification({
        type: 'error',
        title: 'Missing Address',
        message: 'Please enter a withdrawal address',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const transaction = await simulateTransaction({
        type: 'withdraw_crypto',
        fromCurrency: crypto.symbol,
        fromAmount: amount,
        address: withdrawAddress,
      });

      addTransaction(transaction);
      addNotification({
        type: 'info',
        title: 'Withdrawal Initiated',
        message: `Sending ${formatCrypto(amount, 6)} ${crypto.symbol}...`,
      });

      const completedTransaction = await completeTransaction(transaction);
      updateTransaction(completedTransaction.id, { status: 'completed' });

      updateWallet(crypto.id, -amount);

      addNotification({
        type: 'success',
        title: 'Withdrawal Completed',
        message: `Successfully sent ${formatCrypto(amount, 6)} ${crypto.symbol}!`,
      });

      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawAddress('');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: 'There was an error processing your withdrawal',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    addNotification({
      type: 'success',
      title: 'Address Copied',
      message: 'Wallet address copied to clipboard',
    });
  };

  if (showDepositModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-end animate-slide-up">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowDepositModal(false)} />
        <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Deposit {crypto.symbol}</h2>
            <button onClick={() => setShowDepositModal(false)} className="text-gray-400 text-2xl">×</button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deposit Amount ({crypto.symbol})
            </label>
            <input
              type="number"
              step="0.00000001"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="ios-input"
              placeholder="0.00000000"
            />
            <p className="text-sm text-gray-500 mt-1">
              Simulated deposit to your Xcoins wallet
            </p>
          </div>

          <button
            onClick={handleDeposit}
            disabled={isProcessing || !depositAmount}
            className="btn-success w-full disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Simulate Deposit'}
          </button>
        </div>
      </div>
    );
  }

  if (showWithdrawModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-end animate-slide-up">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowWithdrawModal(false)} />
        <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Withdraw {crypto.symbol}</h2>
            <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 text-2xl">×</button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount ({crypto.symbol})
            </label>
            <input
              type="number"
              step="0.00000001"
              max={wallet.amount}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="ios-input"
              placeholder="0.00000000"
            />
            <p className="text-sm text-gray-500 mt-1">
              Available: {formatCrypto(wallet.amount, 8)} {crypto.symbol}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Address
            </label>
            <input
              type="text"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              className="ios-input"
              placeholder={`Enter ${crypto.symbol} address`}
            />
          </div>

          <button
            onClick={handleWithdraw}
            disabled={isProcessing || !withdrawAmount || !withdrawAddress}
            className="btn-danger w-full disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Simulate Withdrawal'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end animate-slide-up">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {crypto.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{crypto.name}</h2>
              <p className="text-gray-500">{crypto.symbol}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 text-2xl">×</button>
        </div>

        {/* Balance */}
        <div className="ios-card bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
          <p className="text-sm opacity-80 mb-1">Balance</p>
          <p className="text-3xl font-bold mb-2">
            {maskValue(`${formatCrypto(wallet.amount, 6)} ${crypto.symbol}`, balancesHidden)}
          </p>
          <p className="text-lg opacity-90">
            {maskValue(formatCurrency(usdValue), balancesHidden)}
          </p>
        </div>

        {/* Wallet Address */}
        <div className="ios-card mb-4">
          <p className="text-sm text-gray-600 mb-2">Wallet Address</p>
          <div className="flex items-center space-x-2">
            <p className="flex-1 text-sm font-mono bg-gray-50 p-2 rounded overflow-x-auto">
              {wallet.address}
            </p>
            <button onClick={copyAddress} className="text-blue-500 text-xl">📋</button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => onBuyMore(crypto.id)}
            className="ios-list-item w-full flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🛒</span>
              <span className="font-semibold">Buy More</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={() => onSell(walletId)}
            className="ios-list-item w-full flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💰</span>
              <span className="font-semibold">Sell to USD Account</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={() => setShowDepositModal(true)}
            className="ios-list-item w-full flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📥</span>
              <span className="font-semibold">Deposit Crypto</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="ios-list-item w-full flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📤</span>
              <span className="font-semibold">Withdraw Crypto</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
