# Xcoins Exchange App Prototype

A simulated cryptocurrency exchange application built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### For Beginners - How to Open the App

#### Option 1: Open the Built Version (Easiest)
1. Navigate to the `dist` folder in your file explorer
2. Double-click on `index.html`
3. The app will open in your default browser

#### Option 2: Run Development Server (If on your local machine)
```bash
npm install
npm run dev
```
Then open http://localhost:3000 in your browser

#### Option 3: Deploy to GitHub Pages
If you want to view it online:
1. Copy the contents of the `dist` folder to your repository root
2. Commit and push to GitHub
3. Enable GitHub Pages in your repository settings
4. Access at: https://chaglayan.github.io

## 📱 Features

- **Balance Overview**: View total balance with privacy toggle
- **USD Account**: Top-up via simulated ACH
- **Crypto Wallets**: Bitcoin, Ethereum, Solana, Cardano, Polkadot
- **Buy**: Purchase crypto with USD
- **Sell**: Convert crypto to USD
- **Swap**: Exchange between cryptocurrencies
- **Notifications**: Real-time transaction updates

## 🛠️ Development

```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📂 Project Structure

```
app/
├── components/    # React components
├── context/       # State management
├── data/         # Mock cryptocurrency data
├── types/        # TypeScript types
└── utils/        # Helper functions
```

## ⚠️ Note

This is a prototype. All transactions are simulated for demonstration purposes.
