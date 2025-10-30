import React, { useState } from 'react';
import { Modal } from './Modal';
import { useApp } from '../context/AppContext';
import { simulateTransaction, completeTransaction } from '../utils/simulation';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose }) => {
  const { updateUsdBalance, addTransaction, updateTransaction, addNotification } = useApp();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);

    if (!depositAmount || depositAmount <= 0) {
      addNotification({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create transaction
      const transaction = await simulateTransaction({
        type: 'topup',
        usdAmount: depositAmount,
        toCurrency: 'USD',
      });

      addTransaction(transaction);
      addNotification({
        type: 'info',
        title: 'ACH Transfer Initiated',
        message: `Depositing ${depositAmount.toFixed(2)} USD to your account...`,
      });

      // Simulate processing
      const completedTransaction = await completeTransaction(transaction);
      updateTransaction(completedTransaction.id, { status: 'completed' });

      // Update balance
      updateUsdBalance(depositAmount);

      addNotification({
        type: 'success',
        title: 'Deposit Completed',
        message: `Successfully deposited $${depositAmount.toFixed(2)} to your account!`,
      });

      setAmount('');
      onClose();
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up via ACH">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deposit Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500 text-lg">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field pl-8"
              placeholder="0.00"
              disabled={isProcessing}
              required
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> ACH transfers are simulated and will complete instantly in this prototype.
          </p>
        </div>

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
            {isProcessing ? 'Processing...' : 'Deposit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
