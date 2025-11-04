import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegistrationFlow } from './components/RegistrationFlow';
import { HomeScreen } from './components/HomeScreen';
import { BottomNav } from './components/BottomNav';
import { Notifications } from './components/Notifications';
import { USDTopUpScreen } from './components/USDTopUpScreen';
import { USDWithdrawScreen } from './components/USDWithdrawScreen';
import { CreateWalletScreen } from './components/CreateWalletScreen';
import { WalletDetailModal } from './components/WalletDetailModal';
import { EnhancedBuyModal } from './components/EnhancedBuyModal';
import { EnhancedSellModal } from './components/EnhancedSellModal';
import { EnhancedSwapModal } from './components/EnhancedSwapModal';
import { UserProfile } from './types';

type Screen = 'welcome' | 'register' | 'login' | 'home' | 'topup' | 'withdraw-usd' | 'create-wallet' | 'settings';

function AppContent() {
  const { isAuthenticated, login, register } = useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [buyPreselectedCrypto, setBuyPreselectedCrypto] = useState<string | undefined>();
  const [sellPreselectedWallet, setSellPreselectedWallet] = useState<string | undefined>();

  const handleRegister = () => {
    setCurrentScreen('register');
  };

  const handleLogin = () => {
    // Simulate login with demo account
    const demoProfile: UserProfile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'demo@xcoins.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1990-01-15',
      address: '123 Main Street, New York, NY 10001',
      tier: 'gold',
    };
    login(demoProfile);
    setCurrentScreen('home');
  };

  const handleRegistrationComplete = (profile: UserProfile) => {
    register(profile);
    setCurrentScreen('home');
  };

  const handleNavigate = (destination: string) => {
    switch (destination) {
      case 'topup':
        setCurrentScreen('topup');
        break;
      case 'withdraw-usd':
        setCurrentScreen('withdraw-usd');
        break;
      case 'create-wallet':
        setCurrentScreen('create-wallet');
        break;
      case 'home':
        setCurrentScreen('home');
        setActiveTab('home');
        break;
      case 'buy':
        setBuyPreselectedCrypto(undefined);
        setShowBuyModal(true);
        break;
      case 'sell':
        setSellPreselectedWallet(undefined);
        setShowSellModal(true);
        break;
      case 'swap':
        setShowSwapModal(true);
        break;
      case 'settings':
        setActiveTab('settings');
        break;
      default:
        setCurrentScreen('home');
    }
  };

  const handleWalletClick = (walletId: string) => {
    setSelectedWallet(walletId);
  };

  const handleBuyFromWallet = (cryptoId: string) => {
    setSelectedWallet(null);
    setBuyPreselectedCrypto(cryptoId);
    setShowBuyModal(true);
  };

  const handleSellFromWallet = (walletId: string) => {
    setSelectedWallet(null);
    setSellPreselectedWallet(walletId);
    setShowSellModal(true);
  };

  const handleBottomNavClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentScreen('home');
    } else if (tab === 'buy') {
      setBuyPreselectedCrypto(undefined);
      setShowBuyModal(true);
    } else if (tab === 'sell') {
      setSellPreselectedWallet(undefined);
      setShowSellModal(true);
    } else if (tab === 'swap') {
      setShowSwapModal(true);
    } else if (tab === 'settings') {
      // Settings screen not implemented yet
    }
  };

  // Pre-authentication screens
  if (!isAuthenticated) {
    if (currentScreen === 'register') {
      return (
        <div className="min-h-screen">
          <RegistrationFlow
            onComplete={handleRegistrationComplete}
            onBack={() => setCurrentScreen('welcome')}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        <WelcomeScreen onRegister={handleRegister} onLogin={handleLogin} />
      </div>
    );
  }

  // Post-authentication screens
  return (
    <div className="ios-container min-h-screen flex flex-col">
      {currentScreen === 'home' && (
        <>
          <HomeScreen onNavigate={handleNavigate} onWalletClick={handleWalletClick} />
          <BottomNav activeTab={activeTab} onNavigate={handleBottomNavClick} />
        </>
      )}

      {currentScreen === 'topup' && (
        <USDTopUpScreen onBack={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'withdraw-usd' && (
        <USDWithdrawScreen onBack={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'create-wallet' && (
        <CreateWalletScreen
          onBack={() => setCurrentScreen('home')}
          onComplete={() => setCurrentScreen('home')}
        />
      )}

      {/* Modals */}
      {selectedWallet && (
        <WalletDetailModal
          walletId={selectedWallet}
          onClose={() => setSelectedWallet(null)}
          onBuyMore={handleBuyFromWallet}
          onSell={handleSellFromWallet}
        />
      )}

      {showBuyModal && (
        <EnhancedBuyModal
          onClose={() => setShowBuyModal(false)}
          preselectedCrypto={buyPreselectedCrypto}
        />
      )}

      {showSellModal && (
        <EnhancedSellModal
          onClose={() => setShowSellModal(false)}
          preselectedWallet={sellPreselectedWallet}
        />
      )}

      {showSwapModal && (
        <EnhancedSwapModal onClose={() => setShowSwapModal(false)} />
      )}

      {/* Notifications */}
      <Notifications />
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
