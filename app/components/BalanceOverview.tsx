import React from 'react';
import { useApp } from '../context/AppContext';
import { getCryptoById } from '../data/cryptocurrencies';
import { formatCurrency, maskValue } from '../utils/format';

export const BalanceOverview: React.FC = () => {
  const { usdBalance, wallets, balancesHidden, toggleBalancesHidden } = useApp();

  // Calculate total wallet value in USD
  const totalWalletValue = wallets.reduce((total, wallet) => {
    const crypto = getCryptoById(wallet.cryptoId);
    if (!crypto) return total;
    return total + (wallet.amount * crypto.currentPrice);
  }, 0);

  const totalBalance = usdBalance + totalWalletValue;

  return (
    <div className="card mb-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Total Balance</h2>
        <button
          onClick={toggleBalancesHidden}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title={balancesHidden ? 'Show balances' : 'Hide balances'}
        >
          {balancesHidden ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

      <div className="mb-6">
        <p className="text-4xl font-bold text-gray-900">
          {maskValue(formatCurrency(totalBalance), balancesHidden)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">USD Account</p>
          <p className="text-xl font-semibold text-gray-900">
            {maskValue(formatCurrency(usdBalance), balancesHidden)}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Crypto Wallets</p>
          <p className="text-xl font-semibold text-gray-900">
            {maskValue(formatCurrency(totalWalletValue), balancesHidden)}
          </p>
        </div>
      </div>
    </div>
  );
};
