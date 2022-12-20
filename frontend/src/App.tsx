import React from 'react'
import { useEffect, useState } from 'react'
import NFTMaker from './abi/NFTMaker.json'
import { ethers } from 'ethers'
import { Web3Storage } from 'web3.storage'
import './App.css'

const App = () => {
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEyZUM3OTFBREM0NGYyMmI0ODlmNEYxQTk1ODk2ODM2M0RGRUVGNzAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzU4NjIzMTgsIm5hbWUiOiJuZnQtbWFrZXIifQ.ozxz5s4zkcGENyU9kr_pLRK1p4LBgqgGAULJRqcwxcQ";
  const CONTRACT_ADDRESS = "0xE2e0Cb146b13AA1C15a62e52Bc69D58496596438"

  const [currentAccount, setCurrentAccount] = useState("")
  const [isLoading, setIsLoading] = useState(false);

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

  const uploadToIpfs = async (e: any) => {
    const client = new Web3Storage({ token: API_KEY })
    const image = e.target

    const rootCid = await client.put(image.file, {
      name: 'metadata',
      maxRetries: 3
    })

    const res = await client.get(rootCid)
    const files = await res?.files()
    if (files) {
      for (const file of files) {
        console.log("file.cid:", file.cid)
      }
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

  const renderUploadToIpfs = () => {
    <div className="nftUplodeBox">
      <div className="imageLogoAndText">
        <p>ここにドラッグ＆ドロップ</p>
      </div>
      <input className="nftUploadInput" multiple name="imageURL" type="file" accept=".jpg , .jpeg , .png" onChange={uploadToIpfs} />
    </div>
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
