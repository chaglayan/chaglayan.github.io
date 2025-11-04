import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate }) => {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'buy', icon: '🛒', label: 'Buy' },
    { id: 'sell', icon: '💰', label: 'Sell' },
    { id: 'swap', icon: '🔄', label: 'Swap' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="ios-bottom-nav">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-colors ${
              activeTab === tab.id
                ? 'text-blue-500'
                : 'text-gray-500'
            }`}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
