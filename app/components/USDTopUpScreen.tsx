import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { simulateTransaction, completeTransaction } from '../utils/simulation';

interface USDTopUpScreenProps {
  onBack: () => void;
}

export const USDTopUpScreen: React.FC<USDTopUpScreenProps> = ({ onBack }) => {
  const { updateUsdBalance, addTransaction, updateTransaction, addNotification } = useApp();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      addNotification({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    const depositAmount = parseFloat(amount);
    setIsProcessing(true);

    try {
      const transaction = await simulateTransaction({
        type: 'topup',
        usdAmount: depositAmount,
        toCurrency: 'USD',
      });

      addTransaction(transaction);
      addNotification({
        type: 'info',
        title: 'ACH Transfer Initiated',
        message: `Depositing $${depositAmount.toFixed(2)} to your account...`,
      });

      const completedTransaction = await completeTransaction(transaction);
      updateTransaction(completedTransaction.id, { status: 'completed' });

      updateUsdBalance(depositAmount);

      addNotification({
        type: 'success',
        title: 'Deposit Completed',
        message: `Successfully deposited $${depositAmount.toFixed(2)}!`,
      });

      setTimeout(() => {
        onBack();
      }, 1500);
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

  if (showConfirmation) {
    return (
      <div className="ios-container min-h-screen flex flex-col bg-white">
        <div className="ios-navbar flex items-center">
          <button onClick={() => setShowConfirmation(false)} className="text-blue-500 text-lg">
            ← Back
          </button>
          <h1 className="flex-1 text-center font-semibold text-lg">Confirm Deposit</h1>
          <div className="w-16"></div>
        </div>

        <div className="flex-1 p-6">
          <div className="ios-card mb-6">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💳</div>
              <p className="text-gray-600 mb-2">You're depositing</p>
              <p className="text-4xl font-bold">${parseFloat(amount).toFixed(2)}</p>
            </div>
          </div>

          <div className="ios-card space-y-4">
            <h3 className="font-semibold">Transaction Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">ACH Bank Transfer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing Time</span>
                <span className="font-medium">Instant (Simulated)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fee</span>
                <span className="font-medium text-green-500">$0.00</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>${parseFloat(amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="ios-card bg-blue-50 border border-blue-200 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> In a real app, ACH transfers typically take 3-5 business days. This is simulated for demo purposes.
            </p>
          </div>
        </div>

        <div className="p-6 pb-8">
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="btn-success w-full"
          >
            {isProcessing ? 'Processing...' : 'Confirm Deposit'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ios-container min-h-screen flex flex-col bg-white">
      <div className="ios-navbar flex items-center">
        <button onClick={onBack} className="text-blue-500 text-lg">
          ← Back
        </button>
        <h1 className="flex-1 text-center font-semibold text-lg">Top Up USD</h1>
        <div className="w-16"></div>
      </div>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">How much would you like to add?</h2>
          <p className="text-gray-600">Funds will be added to your USD account</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-4 text-gray-500 text-2xl">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="ios-input pl-12 text-2xl"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="ios-card bg-gray-50">
          <h3 className="font-semibold mb-3">Quick Amounts</h3>
          <div className="grid grid-cols-3 gap-2">
            {[50, 100, 250, 500, 1000, 2500].map(amt => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className="bg-white py-3 rounded-xl font-semibold text-sm active:bg-gray-100"
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        <div className="ios-card mt-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">💳</div>
            <div>
              <h4 className="font-semibold mb-1">ACH Bank Transfer</h4>
              <p className="text-sm text-gray-600">No fees • Instant (Simulated)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pb-8">
        <button
          onClick={handleContinue}
          disabled={!amount || parseFloat(amount) <= 0}
          className="btn-primary w-full disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
