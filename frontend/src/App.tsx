import React from 'react'
import { useEffect, useState } from 'react'
import NFTMaker from './abi/NFTMaker.json'
import { ethers } from 'ethers'
import './App.css'
import { sign } from 'crypto'

const App = () => {
  const CONTRACT_ADDRESS = "0xE2e0Cb146b13AA1C15a62e52Bc69D58496596438"

  const [currentAccount, setCurrentAccount] = useState("")

  console.log("currentAccount:", currentAccount)

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window
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

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    if (accounts.length !== 0) {
      console.log("connected:", accounts[0])
      setCurrentAccount(accounts[0])
    } else {
      console.log("Account not found")
    }
  }

  const mintNft = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NFTMaker.abi,
        signer
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintNft = () => {
    <button onClick={mintNft} className="cta-button">
      Mint NFT
    </button>
  }

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
