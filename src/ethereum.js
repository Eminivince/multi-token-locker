// src/ethereum.js
import { ethers } from "ethers";

// Connect to MetaMask
export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  } else {
    alert("Please install MetaMask!");
    return null;
  }
};

// Get the signer (current account)
export const getSigner = (provider) => {
  return provider.getSigner();
};
