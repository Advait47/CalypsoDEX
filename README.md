# CalypsoDEX

**Live Demo:** [https://calypso-dex.vercel.app/](https://calypso-dex.vercel.app/)

CalypsoDEX is a decentralized exchange (DEX) platform deployed on the Binance Smart Chain Testnet. It enables trading of a custom token, **Calypso (CALY)**, and uses a simulated **Demo-USDT** for testing transactions. With an intuitive user interface built in React and integrated Web3.js connectivity, CalypsoDEX offers several features including a referral-based registration system, token buying/selling, free USDT claims, and an admin panel for contract management.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Registration with Referral System**
  - **Register by Referral:** Users can register by providing a custom referral address.
  - **Only Registration:** Users can register without a referral; the owner’s address is used by default.
- **Token Trading**
  - **Buy CALY Tokens:** Approve and purchase CALY tokens using Demo-USDT.
  - **Sell CALY Tokens:** Sell your CALY tokens back for Demo-USDT.
  - **Transfer Tokens:** Easily transfer tokens to other wallet addresses.
- **Free USDT Claim**
  - Claim 100 Demo-USDT tokens once every 24 hours via the free claim function.
- **Admin Panel**
  - Secure admin login for managing contract functions.
  - Disable/Enable the contract.
  - Update registration bonus and sell tax rates.
  - Withdraw tokens (CALY and USDT) from the contract.

---

## Technologies

- **Frontend:** React, JavaScript, CSS
- **Blockchain:** Solidity, Web3.js
- **Network:** Binance Smart Chain Testnet
- **Smart Contracts:** Custom contracts for token trading, registration, and free USDT claims

---

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- [Node.js](https://nodejs.org/) (v12 or later)
- npm or yarn
- MetaMask browser extension

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Advait47/CalypsoDEX.git
   cd CalypsoDEX

2. **Install Dependencies:**

   ```bash
   npm install

3. **Create an Environment File:**  
   Create a `.env` file in the project root and add the following:
   REACT_APP_CONTRACT_ADDRESS=<Your Contract Address>
   REACT_APP_USDT_ADDRESS=<Demo USDT Address>
   REACT_APP_CHAIN_ID=<BSC Testnet Chain ID>
   REACT_APP_ADMIN_KEY=<Admin Private Key>

4. **Start the Development Server:**  
   Start the application in development mode:

   ```bash
   npm start

  The app will be available at http://localhost:3000.

5. **Build for Production:**  
   To create a production-ready build of the app:

   ```bash
   npm run build
The build files will be created in the build/ folder.

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`
Builds the app for production to the `build/` folder.

### `npm test`
Launches the test runner in the interactive watch mode.

---

## Usage

### **Connect Wallet:**
- Open the app and connect your MetaMask wallet.

### **Register User:**
- Register with a referral address or without it.  
- Upon successful registration, the referral bonus will be credited.

### **Claim USDT:**
- Claim 100 Demo-USDT every 24 hours.

### **Buy/Sell CALY Tokens:**
- Approve Demo-USDT for spending.  
- Buy and sell CALY tokens directly using Demo-USDT.

### **Transfer Tokens:**
- Transfer CALY tokens to other addresses.

### **Admin Controls:**
- Update registration bonus and sell tax.  
- Disable/enable contract.  
- Withdraw contract balance.

---

## Project Structure

```bash
├── public/              # Public files
├── src/                 # Source files
│   ├── components/      # Reusable React components
│   ├── contracts/       # Solidity contract ABIs
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # Web3 service and utilities
│   └── styles/          # CSS and styling files
├── .env                 # Environment variables
├── package.json         # Project configuration
├── README.md            # Project documentation
└── .gitignore           # Files to ignore in version control

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.
