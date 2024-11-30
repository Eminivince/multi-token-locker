// src/components/ConnectWallet.js
import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Button, Typography } from "@mui/material";

const ConnectWallet = ({ setProvider, setSigner, setAddress }) => {
  const [connected, setConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true, // Optional
        providerOptions: {}, // Add any specific provider options if needed
      });
      const connection = await web3Modal.connect();

      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      // Debugging: Inspect signer object
      console.log("Signer Object:", signer);
      console.log(
        "Signer Methods:",
        Object.getOwnPropertyNames(Object.getPrototypeOf(signer))
      );

      // Check if getAddress exists
      if (typeof signer.getAddress !== "function") {
        throw new Error("Signer does not have getAddress method");
      }

      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAddress(address);
      setConnected(true);
      setCurrentAccount(address);

      // Listen for account changes
      connection.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          resetApp();
        } else {
          setCurrentAccount(accounts[0]);
          setAddress(accounts[0]);
        }
      });

      // Listen for chain changes
      connection.on("chainChanged", (chainId) => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert(`Wallet connection failed: ${error.message}`);
    }
  };

  const resetApp = () => {
    setProvider(null);
    setSigner(null);
    setAddress("");
    setConnected(false);
    setCurrentAccount("");
  };

  useEffect(() => {
    // Automatically connect if provider is cached
    const autoConnect = async () => {
      try {
        const web3Modal = new Web3Modal({
          cacheProvider: true,
          providerOptions: {},
        });
        if (web3Modal.cachedProvider) {
          await connectWallet();
        }
      } catch (error) {
        console.error("Auto-connection failed:", error);
      }
    };

    autoConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {connected ? (
        <Typography variant="subtitle1">
          Connected wallet: {currentAccount.substring(0, 6)}...
          {currentAccount.substring(currentAccount.length - 4)}
        </Typography>
      ) : (
        <Button variant="contained" color="primary" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
