import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { BalanceOverview } from './components/BalanceOverview';
import { WalletList } from './components/WalletList';
import { ActionButtons } from './components/ActionButtons';
import { Notifications } from './components/Notifications';
import { TopUpModal } from './components/TopUpModal';
import { BuyModal } from './components/BuyModal';
import { SellModal } from './components/SellModal';
import { SwapModal } from './components/SwapModal';

function AppContent() {
  const [showTopUp, setShowTopUp] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [showSwap, setShowSwap] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Xcoins Exchange
              </h1>
              <p className="text-gray-600">Prototype - All transactions are simulated</p>
            </div>
            <div className="text-4xl">₿</div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <BalanceOverview />

          <ActionButtons
            onTopUp={() => setShowTopUp(true)}
            onBuy={() => setShowBuy(true)}
            onSell={() => setShowSell(true)}
            onSwap={() => setShowSwap(true)}
          />

          <WalletList />
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Xcoins Exchange App - Prototype Version</p>
          <p className="mt-1">All prices and transactions are simulated for demonstration purposes</p>
        </footer>

        {/* Modals */}
        <TopUpModal isOpen={showTopUp} onClose={() => setShowTopUp(false)} />
        <BuyModal isOpen={showBuy} onClose={() => setShowBuy(false)} />
        <SellModal isOpen={showSell} onClose={() => setShowSell(false)} />
        <SwapModal isOpen={showSwap} onClose={() => setShowSwap(false)} />

        {/* Notifications */}
        <Notifications />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
