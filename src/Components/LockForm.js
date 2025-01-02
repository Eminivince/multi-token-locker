// src/components/LockForm.js
import React, { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/getContract";
import { toast } from "react-toastify";

const LockForm = ({ signer }) => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(""); // Duration in days

  const handleLock = async (e) => {
    e.preventDefault();
    if (!tokenAddress || !amount || !duration) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const contract = getContract(signer);
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          "function approve(address spender, uint256 amount) public returns (bool)",
          "function allowance(address owner, address spender) public view returns (uint256)",
        ],
        signer
      );

      const parsedAmount = ethers.utils.parseUnits(amount, 18);
      const allowance = await tokenContract.allowance(
        await signer.getAddress(),
        contract.address
      );

      // If allowance is not sufficient, approve the locker contract
      if (allowance.lt(parsedAmount)) {
        toast.info("Approving tokens...");
        const approveTx = await tokenContract.approve(
          contract.address,
          parsedAmount
        );
        await approveTx.wait();
        toast.success("Tokens approved!");
      }

      // Lock the tokens
      toast.info("Locking tokens...");
      const lockTx = await contract.lockTokens(
        tokenAddress,
        parsedAmount,
        parseInt(duration) * 86400 // Convert days to seconds
      );
      await lockTx.wait();
      toast.success("Tokens locked successfully!");

      // Reset form
      setTokenAddress("");
      setAmount("");
      setDuration("");
    } catch (error) {
      console.error("Locking failed:", error);
      toast.error(`Failed to lock tokens: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center mb-16">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Lock ERC20 Tokens
        </h2>
        <form onSubmit={handleLock} className="space-y-6">
          {/* Token Address */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="tokenAddress">
              Token Address
            </label>
            <input
              id="tokenAddress"
              type="text"
              placeholder="0x..."
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Amount */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              placeholder="e.g., 1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="any"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Lock Duration (Days) */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="duration">
              Lock Duration (days)
            </label>
            <input
              id="duration"
              type="number"
              placeholder="e.g., 30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              min="1"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
            Lock Tokens
          </button>
        </form>
      </div>
    </div>
  );
};

export default LockForm;
