import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cryptocurrencies } from '../data/cryptocurrencies';

interface CreateWalletScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

export const CreateWalletScreen: React.FC<CreateWalletScreenProps> = ({ onBack, onComplete }) => {
  const { wallets, createWallet, addNotification } = useApp();
  const [selectedCrypto, setSelectedCrypto] = useState('');

  const availableCryptos = cryptocurrencies.filter(
    crypto => !wallets.some(w => w.cryptoId === crypto.id)
  );

  const handleCreate = () => {
    if (!selectedCrypto) {
      addNotification({
        type: 'error',
        title: 'No Selection',
        message: 'Please select a cryptocurrency',
      });
      return;
    }

    const crypto = cryptocurrencies.find(c => c.id === selectedCrypto);
    createWallet(selectedCrypto);

    addNotification({
      type: 'success',
      title: 'Wallet Created',
      message: `Your ${crypto?.name} wallet has been created!`,
    });

    onComplete();
  };

  return (
    <div className="ios-container min-h-screen flex flex-col bg-white">
      <div className="ios-navbar flex items-center">
        <button onClick={onBack} className="text-blue-500 text-lg">
          ← Back
        </button>
        <h1 className="flex-1 text-center font-semibold text-lg">Create Wallet</h1>
        <div className="w-16"></div>
      </div>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Choose a cryptocurrency</h2>
          <p className="text-gray-600">You can create one wallet per cryptocurrency</p>
        </div>

        {availableCryptos.length === 0 ? (
          <div className="ios-card text-center py-12">
            <div className="text-4xl mb-4">✅</div>
            <p className="font-semibold mb-2">All Wallets Created</p>
            <p className="text-gray-600 text-sm">You've created wallets for all available cryptocurrencies</p>
          </div>
        ) : (
          <div className="space-y-2">
            {availableCryptos.map(crypto => (
              <button
                key={crypto.id}
                onClick={() => setSelectedCrypto(crypto.id)}
                className={`ios-list-item w-full flex items-center justify-between ${
                  selectedCrypto === crypto.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {crypto.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">{crypto.name}</h3>
                    <p className="text-sm text-gray-500">
                      {crypto.symbol} • {crypto.type === 'stablecoin' ? 'Stablecoin' : 'Cryptocurrency'}
                    </p>
                  </div>
                </div>
                {selectedCrypto === crypto.id && (
                  <div className="text-blue-500 text-xl">✓</div>
                )}
              </button>
            ))}
          </div>
        )}

        {availableCryptos.length > 0 && (
          <div className="ios-card bg-blue-50 border border-blue-200 mt-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your Xcoins wallet will be created instantly with a unique address for receiving crypto.
            </p>
          </div>
        )}
      </div>

      {availableCryptos.length > 0 && (
        <div className="p-6 pb-8">
          <button
            onClick={handleCreate}
            disabled={!selectedCrypto}
            className="btn-primary w-full disabled:opacity-50"
          >
            Create Wallet
          </button>
        </div>
      )}
    </div>
  );
};
