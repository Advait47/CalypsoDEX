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


