import React from 'react';

interface WelcomeScreenProps {
  onRegister: () => void;
  onLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onRegister, onLogin }) => {
  return (
    <div className="ios-container min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      {/* Logo and Title */}
      <div className="flex-1 flex flex-col items-center justify-center text-white">
        <div className="text-7xl mb-6">₿</div>
        <h1 className="text-4xl font-bold mb-3">Xcoins</h1>
        <p className="text-xl opacity-90">Your Crypto Exchange</p>
      </div>

      {/* Buttons */}
      <div className="space-y-4 pb-8">
        <button
          onClick={onRegister}
          className="w-full bg-white text-blue-600 font-semibold py-4 rounded-2xl text-lg active:scale-95 transition-transform shadow-lg"
        >
          Create Account
        </button>
        <button
          onClick={onLogin}
          className="w-full bg-white/20 backdrop-blur-sm text-white font-semibold py-4 rounded-2xl text-lg active:scale-95 transition-transform border border-white/30"
        >
          Sign In
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-white/70 text-sm pb-4">
        Prototype Version • All transactions simulated
      </p>
    </div>
  );
};
