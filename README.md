# CalypsoDEX

**Live Demo:** [https://calypso-dex.vercel.app/](https://calypso-dex.vercel.app/)
**Smart Contract:** [https://testnet.bscscan.com/address/0xbfbb4d276f29f7d0fb00d56594de77a9dd8e44b4#code](https://testnet.bscscan.com/address/0xbfbb4d276f29f7d0fb00d56594de77a9dd8e44b4#code)
**Calypso(CALY) Token Contract:** [https://testnet.bscscan.com/address/0x685adc3aaf9fdf2cf7f4bedd239b556a036bc160#code](https://testnet.bscscan.com/address/0x685adc3aaf9fdf2cf7f4bedd239b556a036bc160#code)

CalypsoDEX is a decentralized exchange (DEX) platform deployed on the Binance Smart Chain Testnet. It enables trading of a custom token, **Calypso (CALY)**, and uses a simulated **Demo-USDT** for testing transactions. With an intuitive user interface built in React and integrated Web3.js connectivity, CalypsoDEX offers several features including a referral-based registration system, token buying/selling, free USDT claims, and an admin panel for contract management.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Available Scripts](#available-scripts)
- [Usage](#usage)
- [Project Structure](#project-structure)


---

## Features

- **User Registration with Referral System**
  - **Registration:** Users can register without a referral; the owner’s address is used by default.
  - **Register by Referral:** Users can register by providing a custom referral address. The referrer earns a referral bonus.
  - **Multilevel Referral System:** A structured referral system where users benefit from multiple levels of referrals, enhancing user engagement and growth.
- **Token Trading**
  - **Buy CALY Tokens:** Approve and purchase CALY tokens using Demo-USDT.
  - **Sell CALY Tokens:** Sell your CALY tokens back for Demo-USDT.
  - **Transfer Tokens:** Easily transfer tokens to other wallet addresses.
  - **Taxation System:** A flexible taxation mechanism is applied while selling CALY tokens, ensuring balanced token economics.
  - **Burn Mechanism:** A percentage of purchased CALY tokens is burned directly from the contract’s balance during buy transaction, maintaining token scarcity
    and value stability.
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
```


