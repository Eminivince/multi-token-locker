// src/components/LockedTokens.js
import React, { useState } from "react";
import { ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { toast } from "react-toastify";
import { getContract } from "../utils/getContract";

const IsLocked = ({ signer }) => {
  const [lockState, setLockState] = useState();
  const [lockAmount, setLockAmount] = useState();
  const [unlockTimes, setUnlockTimes] = useState();
  const [tokenAddress, setTokenAddress] = useState("");
  const [lockInfo, setLockInfo] = useState(null);

  // Check if token is locked
  const isLocked = async (address) => {
    const contract = getContract(signer);

    // Fetch token name & symbol
    const tokenContract = new ethers.Contract(
      address,
      [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
      ],
      signer
    );

    const tokenName = await tokenContract.name();
    const tokenSymbol = await tokenContract.symbol();

    // Fetch lock info
    const lockData = await contract.getTokenLockInfo(address);
    const lockedState = lockData[0];
    const lockedAmount = ethers.utils.formatEther(lockData[1]);
    const lockedUnlockTimes = lockData[2].map((time) => time.toNumber());

    // Update local state
    setLockState(lockedState);
    setLockAmount(lockedAmount);
    setUnlockTimes(lockedUnlockTimes);

    return {
      tokenName,
      tokenSymbol,
      lockState: lockedState,
      lockAmount: lockedAmount,
      unlockTimes: lockedUnlockTimes,
    };
  };

  // Handle "Check Lock" click
  const handleCheckLock = async () => {
    if (!isAddress(tokenAddress)) {
      toast.error("Invalid token address");
      return;
    }
    try {
      const lockData = await isLocked(tokenAddress);
      setLockInfo(lockData);
    } catch (error) {
      console.error("Error checking lock:", error);
      toast.error(`Error checking lock: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Check Token Lock Status
        </h2>

        {/* Token Address Input */}
        <input
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder="Enter token address"
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />

        {/* Check Lock Button */}
        <button
          onClick={handleCheckLock}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
          Check Lock
        </button>

        {/* Display Lock Info */}
        {lockInfo && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Lock Information</h3>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Token Name:</strong> {lockInfo.tokenName}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Symbol:</strong> {lockInfo.tokenSymbol}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Amount:</strong> {lockInfo.lockAmount}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Unlock Times:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {lockInfo.unlockTimes.map((time, index) => (
                <li key={index}>{new Date(time * 1000).toLocaleString()}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default IsLocked;
