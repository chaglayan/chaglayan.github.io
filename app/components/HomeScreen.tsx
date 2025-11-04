import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getCryptoById } from '../data/cryptocurrencies';
import { formatCurrency, formatCrypto, maskValue } from '../utils/format';
import { UserTier } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  onWalletClick: (walletId: string) => void;
}

const getTierIcon = (tier: UserTier): string => {
  const icons = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
    diamond: '💠',
  };
  return icons[tier];
};

const getTierColor = (tier: UserTier): string => {
  const colors = {
    bronze: 'tier-bronze',
    silver: 'tier-silver',
    gold: 'tier-gold',
    platinum: 'tier-platinum',
    diamond: 'tier-diamond',
  };
  return colors[tier];
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onWalletClick }) => {
  const { userProfile, usdBalance, wallets, balancesHidden, toggleBalancesHidden } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  // Calculate total wallet value in USD
  const totalWalletValue = wallets.reduce((total, wallet) => {
    const crypto = getCryptoById(wallet.cryptoId);
    if (!crypto) return total;
    return total + (wallet.amount * crypto.currentPrice);
  }, 0);

  const totalBalance = usdBalance + totalWalletValue;

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Header with User Profile */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-6 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`tier-badge ${getTierColor(userProfile?.tier || 'bronze')}`}>
              {getTierIcon(userProfile?.tier || 'bronze')}
            </div>
            <div>
              <p className="text-sm opacity-80">Welcome</p>
              <h1 className="text-xl font-bold">{userProfile?.firstName || 'User'}</h1>
            </div>
          </div>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2"
          >
            <span className="text-2xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* Total Balance Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm opacity-80">Total Balance</p>
            <button onClick={toggleBalancesHidden} className="text-xl">
              {balancesHidden ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <p className="text-4xl font-bold mb-4">
            {maskValue(formatCurrency(totalBalance), balancesHidden)}
          </p>
          <div className="flex gap-3 text-sm">
            <div className="flex-1">
              <p className="opacity-70">USD Account</p>
              <p className="font-semibold">
                {maskValue(formatCurrency(usdBalance), balancesHidden)}
              </p>
            </div>
            <div className="flex-1">
              <p className="opacity-70">Crypto Wallets</p>
              <p className="font-semibold">
                {maskValue(formatCurrency(totalWalletValue), balancesHidden)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* USD Account Section */}
      <div className="px-6 mt-6">
        <h2 className="text-lg font-bold mb-3">USD Account</h2>
        {usdBalance === 0 ? (
          <button
            onClick={() => onNavigate('topup')}
            className="ios-card w-full flex items-center justify-center space-x-2 py-6 border-2 border-dashed border-gray-300"
          >
            <span className="text-3xl">+</span>
            <span className="text-lg font-semibold text-gray-600">Add USD</span>
          </button>
        ) : (
          <div className="ios-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Available Balance</p>
                <p className="text-2xl font-bold">
                  {maskValue(formatCurrency(usdBalance), balancesHidden)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onNavigate('topup')}
                  className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  Top Up
                </button>
                <button
                  onClick={() => onNavigate('withdraw-usd')}
                  className="bg-gray-100 text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wallets Section */}
      <div className="px-6 mt-6">
        <h2 className="text-lg font-bold mb-3">My Wallets</h2>
        {wallets.length === 0 ? (
          <button
            onClick={() => onNavigate('create-wallet')}
            className="ios-card w-full flex items-center justify-center space-x-2 py-6 border-2 border-dashed border-gray-300"
          >
            <span className="text-3xl">+</span>
            <span className="text-lg font-semibold text-gray-600">Create Xcoins Wallet</span>
          </button>
        ) : (
          <div className="space-y-2">
            {wallets.map(wallet => {
              const crypto = getCryptoById(wallet.cryptoId);
              if (!crypto) return null;

              const usdValue = wallet.amount * crypto.currentPrice;
              const changeColor = crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500';

              return (
                <button
                  key={wallet.id}
                  onClick={() => onWalletClick(wallet.id)}
                  className="ios-card w-full flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {crypto.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{crypto.name}</h3>
                      <p className="text-sm text-gray-500">{crypto.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {maskValue(`${formatCrypto(wallet.amount, 6)} ${crypto.symbol}`, balancesHidden)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {maskValue(formatCurrency(usdValue), balancesHidden)}
                    </p>
                    <p className={`text-xs ${changeColor}`}>
                      {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}% 24h
                    </p>
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => onNavigate('create-wallet')}
              className="ios-card w-full flex items-center justify-center space-x-2 py-4 bg-gray-50"
            >
              <span className="text-2xl">+</span>
              <span className="font-semibold text-gray-600">Add Another Wallet</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
