import React from 'react';
import { useApp } from '../context/AppContext';
import { getCryptoById } from '../data/cryptocurrencies';
import { formatCurrency, formatCrypto, formatPercentage, maskValue } from '../utils/format';

export const WalletList: React.FC = () => {
  const { wallets, balancesHidden } = useApp();

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">My Wallets</h2>

      <div className="space-y-3">
        {wallets.map(wallet => {
          const crypto = getCryptoById(wallet.cryptoId);
          if (!crypto) return null;

          const usdValue = wallet.amount * crypto.currentPrice;
          const changeColor = crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600';

          return (
            <div
              key={wallet.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  {crypto.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{crypto.name}</h3>
                  <p className="text-sm text-gray-500">{crypto.symbol}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {maskValue(`${formatCrypto(wallet.amount)} ${crypto.symbol}`, balancesHidden)}
                </p>
                <p className="text-sm text-gray-600">
                  {maskValue(formatCurrency(usdValue), balancesHidden)}
                </p>
                <p className={`text-xs ${changeColor}`}>
                  {formatPercentage(crypto.change24h)} 24h
                </p>
              </div>
            </div>
          );
        })}

        {wallets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No wallets yet. Buy some crypto to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};
