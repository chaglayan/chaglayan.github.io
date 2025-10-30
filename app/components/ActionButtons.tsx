import React from 'react';

interface ActionButtonsProps {
  onTopUp: () => void;
  onBuy: () => void;
  onSell: () => void;
  onSwap: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onTopUp,
  onBuy,
  onSell,
  onSwap,
}) => {
  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={onTopUp}
          className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
        >
          <span className="text-2xl mb-2">💳</span>
          <span className="font-semibold">Top Up</span>
        </button>

        <button
          onClick={onBuy}
          className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <span className="text-2xl mb-2">🛒</span>
          <span className="font-semibold">Buy</span>
        </button>

        <button
          onClick={onSell}
          className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
        >
          <span className="text-2xl mb-2">💰</span>
          <span className="font-semibold">Sell</span>
        </button>

        <button
          onClick={onSwap}
          className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          <span className="text-2xl mb-2">🔄</span>
          <span className="font-semibold">Swap</span>
        </button>
      </div>
    </div>
  );
};
