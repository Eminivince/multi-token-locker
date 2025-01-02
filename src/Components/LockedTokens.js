// src/components/LockedTokens.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/getContract";
import { toast } from "react-toastify";

const LockedTokens = ({ signer, address }) => {
  const [locks, setLocks] = useState([]);

  // Fetch locked tokens
  const fetchLocks = async () => {
    try {
      const contract = getContract(signer);
      const totalLocks = await contract.getLockCount(address);
      const locksData = [];

      for (let i = 0; i < totalLocks; i++) {
        const lock = await contract.getLock(address, i);

        // Fetch token name & symbol
        const tokenContract = new ethers.Contract(
          lock.token,
          [
            "function name() view returns (string)",
            "function symbol() view returns (string)",
          ],
          signer
        );
        const name = await tokenContract.name();
        const symbol = await tokenContract.symbol();

        // Prepare data
        locksData.push({
          index: i,
          tokenName: name,
          tokenSymbol: symbol,
          amount: ethers.utils.formatUnits(lock.amount, 18),
          unlockTime: new Date(
            lock.unlockTime.toNumber() * 1000
          ).toLocaleString(),
        });
      }
      setLocks(locksData);
    } catch (error) {
      console.error("Error fetching locks:", error);
      toast.error(`Failed to fetch locked tokens: ${error.message}`);
    }
  };

  useEffect(() => {
    if (signer && address) {
      fetchLocks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer, address]);

  // Unlock function
  const handleUnlock = async (indices) => {
    if (indices.length === 0) {
      toast.error("No locks available for unlocking.");
      return;
    }

    try {
      const contract = getContract(signer);
      toast.info("Unlocking tokens...");
      const tx = await contract.unlockTokens(indices);
      await tx.wait();
      toast.success("Tokens unlocked successfully!");
      fetchLocks();
    } catch (error) {
      console.error("Unlocking failed:", error);
      toast.error(`Failed to unlock tokens: ${error.message}`);
    }
  };

  // Determine which locks can be unlocked
  const getUnlockableIndices = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    return locks
      .filter(
        (lock) => new Date(lock.unlockTime).getTime() / 1000 <= currentTime
      )
      .map((lock) => lock.index);
  };

  const unlockableIndices = getUnlockableIndices();

  return (
    <div className="flex items-center justify-center mb-16 ">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Your Locked Tokens
        </h2>

        {locks.length === 0 ? (
          <p className="text-center text-gray-700">No tokens locked.</p>
        ) : (
          <>
            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 font-semibold text-gray-700">
                      Token Name
                    </th>
                    <th className="px-4 py-2 font-semibold text-gray-700">
                      Symbol
                    </th>
                    <th className="px-4 py-2 font-semibold text-gray-700 text-right">
                      Amount
                    </th>
                    <th className="px-4 py-2 font-semibold text-gray-700 text-right">
                      Unlock Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locks.map((lock) => (
                    <tr key={lock.index} className="border-b last:border-0">
                      <td className="px-4 py-2">{lock.tokenName}</td>
                      <td className="px-4 py-2">{lock.tokenSymbol}</td>
                      <td className="px-4 py-2 text-right">{lock.amount}</td>
                      <td className="px-4 py-2 text-right">
                        {lock.unlockTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Unlock Button */}
            <button
              className={`px-4 py-2 mt-4 bg-purple-600 hover:bg-purple-700 text-white rounded 
                          focus:outline-none focus:ring focus:ring-purple-300 
                          disabled:bg-gray-300 disabled:cursor-not-allowed`}
              onClick={() => handleUnlock(unlockableIndices)}
              disabled={unlockableIndices.length === 0}>
              Unlock Available Tokens
            </button>

            {/* No unlockable tokens text */}
            {unlockableIndices.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No tokens available for unlocking at this time.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LockedTokens;
