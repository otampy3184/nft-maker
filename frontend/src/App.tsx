import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const CONTRACT_ADDRESS = "0xE2e0Cb146b13AA1C15a62e52Bc69D58496596438"

  const [currentAccount, setCurrentAccount] = useState("")

  console.log("currentAccount:", currentAccount);

  const checkIfWalletConnected =async () => {
    const { ethereum } = window as any
    if (!ethereum) {
      console.log("metamask not found")
      return
    } else {
      console.log("Metamask founded")
    } 

    const accounts = await ethereum.request({ method: "eth_accounts" })
    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0])
    } else {
      console.log("Account not found")
    }
  }

  const connectWallet =async () => {
      try {
        const { ethereum } = window as any
        if (!ethereum) {
          console.log("metamask not found")
          return
        } else {
          console.log("Metamask founded")
        } 
    
        const accounts = await ethereum.request({ method: "eth_accounts" })
        if (accounts.length !== 0) {
          console.log("connected:", accounts[0])
          setCurrentAccount(accounts[0])
        } else {
          console.log("Account not found")
        }
      } catch (error) {
        console.log(error)
      }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  return (
    <div className="App">
      test
      <div>
        {currentAccount === "" ? (
          renderNotConnectedContainer()
        ) : (
          <p>Wallet Connected</p>
        )}
      </div>
    </div>
    
  );
}

export default App;
