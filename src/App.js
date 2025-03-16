import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';
import CalypsoContractABI from './contracts/CalypsoContractABI'; // using the contract ABI file

const contractAddress = "0xBfBB4D276F29f7D0fb00d56594dE77A9dd8e44B4";
const calyTokenAddress = "0x685adC3aaf9fDf2Cf7F4BEDd239B556a036bc160";
const usdtTokenAddress = "0xEb15a5176d1d2d8E3C8B66c843E5D50b1eE265A0";

// New: Free Claim Contract Address and ABI
const freeClaimContractAddress = "0x578B799C7846090a20D7e76A680c05d3bF099aF8";
const freeClaimABI = [
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const contractABI = CalypsoContractABI;

const erc20ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_from", "type": "address" },
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  }
];

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [tokenSaleContract, setTokenSaleContract] = useState(null);
  const [calyTokenContract, setCalyTokenContract] = useState(null);
  const [usdtTokenContract, setUsdtTokenContract] = useState(null);
  const [freeClaimContract, setFreeClaimContract] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize web3 and contract instances on mount
  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const tokenSale = new web3Instance.eth.Contract(contractABI, contractAddress);
      setTokenSaleContract(tokenSale);
      const calyToken = new web3Instance.eth.Contract(erc20ABI, calyTokenAddress);
      setCalyTokenContract(calyToken);
      const usdtToken = new web3Instance.eth.Contract(erc20ABI, usdtTokenAddress);
      setUsdtTokenContract(usdtToken);
      // New: Free Claim Contract instance
      const freeClaim = new web3Instance.eth.Contract(freeClaimABI, freeClaimContractAddress);
      setFreeClaimContract(freeClaim);
    } else {
      alert("Please install MetaMask!");
    }
  }, []);

  // Connect wallet and then check registration status
  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      checkRegistration(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  // Check if the user is registered in the contract
  const checkRegistration = async (acc) => {
    setLoading(true);
    try {
      const userData = await tokenSaleContract.methods.userData(acc).call();
      if (userData.isRegistered) {
        renderDashboard(acc);
      } else {
        renderRegistration(acc);
      }
    } catch (err) {
      console.error("Error checking registration:", err);
      setContent(<p>Error checking registration status.</p>);
    }
    setLoading(false);
  };


// Render registration UI if the user is not registered
// New RegistrationForm component
function RegistrationForm({ acc, tokenSaleContract, setLoading, renderDashboard }) {
  const [showReferralInput, setShowReferralInput] = useState(false);

  return (
    <div>
      <h2>User Registration</h2>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={async () => {
            try {
              setLoading(true);
              const ownerAddress = await tokenSaleContract.methods.owner().call();
              await tokenSaleContract.methods.registerUser(ownerAddress).send({ from: acc });
              alert("Registration successful!");
              renderDashboard(acc);
            } catch (error) {
              console.error(error);
              alert("Registration failed: " + error.message);
            } finally {
              setLoading(false);
            }
          }}
        >
         Register
        </button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setShowReferralInput(true)}>
          Register by Referral
        </button>
      </div>
      {showReferralInput && (
        <div>
          <input type="text" id="referrer" placeholder="Enter Referral Address" />
          <button
            className="submit-referral-registration"
            onClick={async () => {
              const referrer = document.getElementById("referrer").value;
              if (!referrer) {
                alert("Please enter a valid referral address");
                return;
              }
              try {
                setLoading(true);
                await tokenSaleContract.methods.registerUser(referrer).send({ from: acc });
                alert("Registration successful!");
                renderDashboard(acc);
              } catch (error) {
                console.error(error);
                alert("Registration failed: " + error.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            Submit Referral Registration
          </button>
        </div>
      )}
    </div>
  );
}

// Updated renderRegistration function using RegistrationForm
const renderRegistration = (acc) => {
  setContent(
    <RegistrationForm 
      acc={acc} 
      tokenSaleContract={tokenSaleContract} 
      setLoading={setLoading} 
      renderDashboard={renderDashboard} 
    />
  );
};



  // Claim Free USDT Tokens by calling the free claim contract's claim method.
  // Users can claim 100 USDT once every 24 hrs.
  const handleClaimFreeUSDT = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }
    const lastClaim = localStorage.getItem(`freeClaim_${account}`);
    if (lastClaim && Date.now() - parseInt(lastClaim, 10) < 24 * 60 * 60 * 1000) {
      alert("You can only claim 100 USDT once every 24 hours.");
      return;
    }
    try {
      setLoading(true);
      // Simply call the claim() method on the free claim contract
      await freeClaimContract.methods.claim().send({ from: account });
      localStorage.setItem(`freeClaim_${account}`, Date.now().toString());
      triggerConfetti();
      setContent(
        <div style={{ textAlign: "center" }}>
          <h3>Successfully Claimed 100 USDT</h3>
          <p style={{ fontSize: "0.8em" }}>
            These are Demo-USDT and can be only used on this Contract for testing purpose.
          </p>
        </div>
      );
    } catch (error) {
      console.error(error);
      alert("Claim failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Simple confetti trigger using window.confetti if available
  const triggerConfetti = () => {
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      console.log("Confetti animation triggered!");
    }
  };

  // Render the dashboard UI for registered users in a two-column layout
  const renderDashboard = async (acc) => {
    setLoading(true);
    try {
      const contractBalance = await tokenSaleContract.methods.getContractBalance().call();
      const contractUsdtBalance = await usdtTokenContract.methods.balanceOf(contractAddress).call();
      const userCalyBalance = await calyTokenContract.methods.balanceOf(acc).call();
      const userUsdtBalance = await usdtTokenContract.methods.balanceOf(acc).call();
      const userAmountData = await tokenSaleContract.methods.userAmountData(acc).call();
      const bonusTokens = userAmountData.bonusTokenBalance;
      const referralEarnings = userAmountData.referalEarning;
      
      // Convert balances from Wei to Ether for display
      const contractBalanceEther = web3.utils.fromWei(contractBalance, 'ether');
      const contractUsdtBalanceEther = web3.utils.fromWei(contractUsdtBalance, 'ether');
      const userCalyBalanceEther = web3.utils.fromWei(userCalyBalance, 'ether');
      const userUsdtBalanceEther = web3.utils.fromWei(userUsdtBalance, 'ether');
      
      // Calculate current CALY rate (USDT per CALY)
      const currentRate = (parseFloat(contractUsdtBalanceEther) / parseFloat(contractBalanceEther)).toFixed(6);
      
      setContent(
        <div className="dashboard">
          <h2>Dashboard</h2>
          <div className="dashboard-grid">
            {/* Show wallet address */}
            <div className="grid-item">
              <span className="label">Wallet Address:</span>
              <span className="value">{acc}</span>
            </div>
            <div className="grid-item">
              <span className="label">Current CALY Rate:</span>
              <span className="value">{currentRate} USDT</span>
            </div>
            <div className="grid-item">
              <span className="label">Contract CALY Balance:</span>
              <span className="value">{contractBalanceEther}</span>
            </div>
            <div className="grid-item">
              <span className="label">User CALY Balance:</span>
              <span className="value">{userCalyBalanceEther}</span>
            </div>
            <div className="grid-item">
              <span className="label">Contract USDT Balance:</span>
              <span className="value">{contractUsdtBalanceEther}</span>
            </div>
            <div className="grid-item">
              <span className="label">User USDT Balance:</span>
              <span className="value">{userUsdtBalanceEther}</span>
            </div>
            <div className="grid-item">
              <h3>Buy Tokens</h3>
              <input type="number" id="buyAmount" placeholder="Amount to Buy" />
              {/* Approve USDT Button with auto-filled approve amount */}
              <button className="approve" onClick={async () => {
                const buyVal = document.getElementById("buyAmount").value;
                if (!buyVal || parseFloat(buyVal) <= 0) {
                  alert("Enter a valid amount to buy first");
                  return;
                }
                // Calculate required USDT: number of CALY tokens to buy * current CALY rate
                const defaultApproveValue = parseFloat(buyVal) * parseFloat(currentRate);
                const approveAmount = prompt("Enter USDT amount to approve", defaultApproveValue.toString());
                if (!approveAmount) return;
                try {
                  setLoading(true);
                  const amountInWei = web3.utils.toWei(approveAmount, 'ether');
                  await usdtTokenContract.methods.approve(contractAddress, amountInWei).send({ from: acc });
                  alert("USDT approved successfully!");
                } catch (error) {
                  console.error(error);
                  alert("USDT approval failed: " + error.message);
                } finally {
                  setLoading(false);
                }
              }}>Approve USDT</button>
              {/* Buy Button */}
              <button className="buy" onClick={async () => {
                const amount = document.getElementById("buyAmount").value;
                if (amount <= 0) {
                  alert("Enter a valid amount");
                  return;
                }
                try {
                  setLoading(true);
                  const amountInWei = web3.utils.toWei(amount, 'ether');
                  await tokenSaleContract.methods.buyCALY(amountInWei).send({ from: acc });
                  alert("Buy transaction successful!");
                  renderDashboard(acc);
                } catch (error) {
                  console.error(error);
                  alert("Buy transaction failed: " + error.message);
                } finally {
                  setLoading(false);
                }
              }}>Buy</button>
            </div>
            <div className="grid-item">
              <h3>Sell Tokens</h3>
              <input type="number" id="sellAmount" placeholder="Amount to Sell" />
              {/* Approve CALY Button (using sell field value directly) */}
              <button className="approve" onClick={async () => {
                const sellVal = document.getElementById("sellAmount").value;
                if (!sellVal || parseFloat(sellVal) <= 0) {
                  alert("Enter a valid amount to sell first");
                  return;
                }
                try {
                  setLoading(true);
                  const amountInWei = web3.utils.toWei(sellVal, 'ether');
                  await calyTokenContract.methods.approve(contractAddress, amountInWei).send({ from: acc });
                  alert("CALY approved successfully!");
                } catch (error) {
                  console.error(error);
                  alert("CALY approval failed: " + error.message);
                } finally {
                  setLoading(false);
                }
              }}>Approve CALY</button>
              {/* Sell Button */}
              <button className="sell" onClick={async () => {
                const amount = document.getElementById("sellAmount").value;
                if (amount <= 0) {
                  alert("Enter a valid amount");
                  return;
                }
                try {
                  setLoading(true);
                  const amountInWei = web3.utils.toWei(amount, 'ether');
                  await tokenSaleContract.methods.sellCALY(amountInWei).send({ from: acc });
                  alert("Sell transaction successful!");
                  renderDashboard(acc);
                } catch (error) {
                  console.error(error);
                  alert("Sell transaction failed: " + error.message);
                } finally {
                  setLoading(false);
                }
              }}>Sell</button>
            </div>
            <div className="grid-item full-width">
              <h3>Transfer Tokens</h3>
              <input type="text" id="transferAddress" placeholder="Recipient Address" />
              <input type="number" id="transferAmount" placeholder="Amount to Transfer" />
              <button className="transfer" onClick={async () => {
                const recipient = document.getElementById("transferAddress").value;
                const amount = document.getElementById("transferAmount").value;
                if (!recipient || amount <= 0) {
                  alert("Enter valid recipient and amount");
                  return;
                }
                try {
                  setLoading(true);
                  const amountInWei = web3.utils.toWei(amount, 'ether');
                  await tokenSaleContract.methods.transferToken(recipient, amountInWei).send({ from: acc });
                  alert("Transfer successful!");
                  renderDashboard(acc);
                } catch (error) {
                  console.error(error);
                  alert("Transfer failed: " + error.message);
                } finally {
                  setLoading(false);
                }
              }}>Transfer</button>
            </div>
            <div className="grid-item">
              <h3>Bonus Tokens</h3>
              <span className="value">{bonusTokens}</span>
              <button className="withdraw-bonus" onClick={async () => {
                try {
                  setLoading(true);
                  await tokenSaleContract.methods.withdrawBonusTokens().send({ from: acc });
                  alert("Bonus Tokens withdrawn successfully!");
                  renderDashboard(acc);
                } catch (error) {
                  console.error(error);
                  alert("Withdrawal failed: " + error.message);
                } finally {
                  setLoading(false);
                }
              }}>Withdraw Bonus</button>
            </div>
            <div className="grid-item">
              <h3>Referral Earning</h3>
              <span className="value">{referralEarnings}</span>
              <button className="withdraw-referral" onClick={async () => {
                try {
                  setLoading(true);
                  await tokenSaleContract.methods.withdrawReferralTokens().send({ from: acc });
                  alert("Referral Tokens withdrawn successfully!");
                  renderDashboard(acc);
                } catch (error) {
                  console.error(error);
                  alert("Withdrawal failed: " + error.message);
                } finally {
                  setLoading(false);
                }
              }}>Withdraw Referral Token</button>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering dashboard:", error);
      setContent(<p>Error loading dashboard.</p>);
    }
    setLoading(false);
  };

  // Handle Admin Login – check if the connected account matches the contract owner
  const handleAdminLogin = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }
    setLoading(true);
    try {
      const ownerAddr = await tokenSaleContract.methods.owner().call();
      if (account.toLowerCase() !== ownerAddr.toLowerCase()) {
        alert("ERROR: Only for Admin Login");
        setLoading(false);
        return;
      }
      renderAdminPanel(account);
    } catch (error) {
      console.error("Admin login error:", error);
      alert("Admin login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Render Admin Panel UI with owner-only functions
  const renderAdminPanel = (acc) => {
    setContent(
      <div className="adminPanel">
        <h2>Admin Panel</h2>
        <button onClick={async () => {
          try {
            setLoading(true);
            await tokenSaleContract.methods.disableContractFunction().send({ from: acc });
            alert("Contract disabled successfully!");
          } catch (error) {
            console.error(error);
            alert("Operation failed: " + error.message);
          } finally {
            setLoading(false);
          }
        }}>Disable Contract</button>
        <button onClick={async () => {
          try {
            setLoading(true);
            await tokenSaleContract.methods.enableContractFunction().send({ from: acc });
            alert("Contract enabled successfully!");
          } catch (error) {
            console.error(error);
            alert("Operation failed: " + error.message);
          } finally {
            setLoading(false);
          }
        }}>Enable Contract</button>
        <div>
          <h3>Update Registration Bonus</h3>
          <input type="number" id="newBonus" placeholder="New Bonus Amount" />
          <button onClick={async () => {
            const bonus = document.getElementById("newBonus").value;
            if (bonus <= 0) {
              alert("Enter a valid bonus amount");
              return;
            }
            try {
              setLoading(true);
              await tokenSaleContract.methods.updateRegistrationBonus(bonus).send({ from: acc });
              alert("Registration bonus updated successfully!");
            } catch (error) {
              console.error(error);
              alert("Update failed: " + error.message);
            } finally {
              setLoading(false);
            }
          }}>Update Bonus</button>
        </div>
        <div>
          <h3>Update Sell Tax Rate</h3>
          <input type="number" id="newTax" placeholder="New Sell Tax Rate (%)" />
          <button onClick={async () => {
            const tax = document.getElementById("newTax").value;
            if (tax < 0) {
              alert("Enter a valid tax rate");
              return;
            }
            try {
              setLoading(true);
              await tokenSaleContract.methods.updateSellTaxRate(tax).send({ from: acc });
              alert("Sell tax rate updated successfully!");
            } catch (error) {
              console.error(error);
              alert("Update failed: " + error.message);
            } finally {
              setLoading(false);
            }
          }}>Update Tax</button>
        </div>
        <div>
          <h3>Withdraw Tokens</h3>
          <input type="number" id="withdrawCalyAmount" placeholder="CALY Amount" />
          <button onClick={async () => {
            const amount = document.getElementById("withdrawCalyAmount").value;
            if (amount <= 0) {
              alert("Enter a valid amount");
              return;
            }
            try {
              setLoading(true);
              const amountInWei = web3.utils.toWei(amount, 'ether');
              await tokenSaleContract.methods.ownerWithdrawCaly(amountInWei).send({ from: acc });
              alert("CALY withdrawn successfully!");
            } catch (error) {
              console.error(error);
              alert("Withdrawal failed: " + error.message);
            } finally {
              setLoading(false);
            }
          }}>Withdraw CALY</button>
        </div>
        <div>
          <input type="number" id="withdrawUsdtAmount" placeholder="USDT Amount" />
          <button onClick={async () => {
            const amount = document.getElementById("withdrawUsdtAmount").value;
            if (amount <= 0) {
              alert("Enter a valid amount");
              return;
            }
            try {
              setLoading(true);
              const amountInWei = web3.utils.toWei(amount, 'ether');
              await tokenSaleContract.methods.ownerWithdrawUSDT(amountInWei).send({ from: acc });
              alert("USDT withdrawn successfully!");
            } catch (error) {
              console.error(error);
              alert("Withdrawal failed: " + error.message);
            } finally {
              setLoading(false);
            }
          }}>Withdraw USDT</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <header>
        <h1>Calypso DEX</h1>
        <div className="navbar">
          <button onClick={() => window.location.reload()}>HOME</button>
          <button onClick={() => window.open(`https://testnet.bscscan.com/address/${contractAddress}`, '_blank')}>
            Smart Contracts
          </button>
          {/* Custom Free USDT Button with Claim Logic */}
          <button className="free-usdt" onClick={handleClaimFreeUSDT}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 36 40"
              width="40px"
              height="40px"
            >
              <rect width="36" height="36" x="0" y="0" fill="#fdd835"></rect>
              <path
                fill="#e53935"
                d="M38.67,42H11.52C11.27,40.62,11,38.57,11,36c0-5,0-11,0-11s1.44-7.39,3.22-9.59 c1.67-2.06,2.76-3.48,6.78-4.41c3-0.7,7.13-0.23,9,1c2.15,1.42,3.37,6.67,3.81,11.29c1.49-0.3,5.21,0.2,5.5,1.28 C40.89,30.29,39.48,38.31,38.67,42z"
              ></path>
              <path
                fill="#b71c1c"
                d="M39.02,42H11.99c-0.22-2.67-0.48-7.05-0.49-12.72c0.83,4.18,1.63,9.59,6.98,9.79 c3.48,0.12,8.27,0.55,9.83-2.45c1.57-3,3.72-8.95,3.51-15.62c-0.19-5.84-1.75-8.2-2.13-8.7c0.59,0.66,3.74,4.49,4.01,11.7 c0.03,0.83,0.06,1.72,0.08,2.66c4.21-0.15,5.93,1.5,6.07,2.35C40.68,33.85,39.8,38.9,39.02,42z"
              ></path>
              <path
                fill="#212121"
                d="M35,27.17c0,3.67-0.28,11.2-0.42,14.83h-2C32.72,38.42,33,30.83,33,27.17 c0-5.54-1.46-12.65-3.55-14.02c-1.65-1.08-5.49-1.48-8.23-0.85c-3.62,0.83-4.57,1.99-6.14,3.92L15,16.32 c-1.31,1.6-2.59,6.92-3,8.96v10.8c0,2.58,0.28,4.61,0.54,5.92H10.5c-0.25-1.41-0.5-3.42-0.5-5.92l0.02-11.09 c0.15-0.77,1.55-7.63,3.43-9.94l0.08-0.09c1.65-2.03,2.96-3.63,7.25-4.61c3.28-0.76,7.67-0.25,9.77,1.13 C33.79,13.6,35,22.23,35,27.17z"
              ></path>
              <path
                fill="#01579b"
                d="M17.165,17.283c5.217-0.055,9.391,0.283,9,6.011c-0.391,5.728-8.478,5.533-9.391,5.337 c-0.913-0.196-7.826-0.043-7.696-5.337C9.209,18,13.645,17.32,17.165,17.283z"
              ></path>
              <path
                fill="#212121"
                d="M40.739,37.38c-0.28,1.99-0.69,3.53-1.22,4.62h-2.43c0.25-0.19,1.13-1.11,1.67-4.9 c0.57-4-0.23-11.79-0.93-12.78c-0.4-0.4-2.63-0.8-4.37-0.89l0.1-1.99c1.04,0.05,4.53,0.31,5.71,1.49 C40.689,24.36,41.289,33.53,40.739,37.38z"
              ></path>
              <path
                fill="#81d4fa"
                d="M10.154,20.201c0.261,2.059-0.196,3.351,2.543,3.546s8.076,1.022,9.402-0.554 c1.326-1.576,1.75-4.365-0.891-5.267C19.336,17.287,12.959,16.251,10.154,20.201z"
              ></path>
              <path
                fill="#212121"
                d="M17.615,29.677c-0.502,0-0.873-0.03-1.052-0.069c-0.086-0.019-0.236-0.035-0.434-0.06 c-5.344-0.679-8.053-2.784-8.052-6.255c0.001-2.698,1.17-7.238,8.986-7.32l0.181-0.002c3.444-0.038,6.414-0.068,8.272,1.818 c1.173,1.191,1.712,3,1.647,5.53c-0.044,1.688-0.785,3.147-2.144,4.217C22.785,29.296,19.388,29.677,17.615,29.677z M17.086,17.973 c-7.006,0.074-7.008,4.023-7.008,5.321c-0.001,3.109,3.598,3.926,6.305,4.27c0.273,0.035,0.48,0.063,0.601,0.089 c0.563,0.101,4.68,0.035,6.855-1.732c0.865-0.702,1.299-1.57,1.326-2.653c0.051-1.958-0.301-3.291-1.073-4.075 c-1.262-1.281-3.834-1.255-6.825-1.222L17.086,17.973z"
              ></path>
              <path
                fill="#e1f5fe"
                d="M15.078,19.043c1.957-0.326,5.122-0.529,4.435,1.304c-0.489,1.304-7.185,2.185-7.185,0.652 C12.328,19.467,15.078,19.043,15.078,19.043z"
              ></path>
            </svg>
            <span className="now">Claim!</span>
            <span className="play">FREE USDT</span>
          </button>
          <button className="admin-login" onClick={handleAdminLogin}>Admin Login</button>
        </div>
      </header>
      <div id="loading" style={{ display: loading ? 'block' : 'none' }}>
        {/* Custom loading symbol integrated */}
        <div className="banter-loader">
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
        </div>
      </div>
      <div id="content" style={loading ? { opacity: 0.2, pointerEvents: 'none' } : {}}>
        {content ? content : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <button onClick={connectWallet}>Connect Wallet</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
