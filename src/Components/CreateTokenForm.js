// src/components/CreateTokenForm.js
import React, { useState } from "react";
import { ethers } from "ethers";
import ERC20Token from "../abi/ERC20Token.json";
import { getProvider, getSigner } from "../ethereum";
import { toast } from "react-toastify";

const CreateTokenForm = () => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [mintable, setMintable] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeploy = async (e) => {
    e.preventDefault();

    if (!name || !symbol || !supply) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const provider = getProvider();
      if (!provider) {
        toast.error("No provider found. Please install MetaMask.");
        return;
      }

      // Prompt user to connect their wallet
      await provider.send("eth_requestAccounts", []);
      const signer = getSigner(provider);

      const ERC20Factory = new ethers.ContractFactory(
        ERC20Token.abi,
        ERC20Token.bytecode,
        signer
      );

      setLoading(true);

      // For real usage, you’d want to handle decimal conversions carefully
      const initialSupply = supply;

      const contract = await ERC20Factory.deploy(
        name,
        symbol,
        initialSupply,
        mintable,
        {
          gasLimit: 3000000,
        }
      );

      toast.info("Deploying contract...");
      await contract.deployed();

      setContractAddress(contract.address);
      toast.success(`Contract deployed at: ${contract.address}`);
    } catch (error) {
      console.error(error);
      toast.error("Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mb-16 ">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Create Your ERC20 Token
        </h2>
        <form onSubmit={handleDeploy} className="space-y-4">
          {/* Token Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token Name
            </label>
            <input
              type="text"
              placeholder="e.g., MyToken"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Token Symbol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token Symbol
            </label>
            <input
              type="text"
              placeholder="e.g., MTK"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Total Supply */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Supply
            </label>
            <input
              type="number"
              placeholder="e.g., 1000000"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              required
              min="0"
              step="any"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Mintable Checkbox */}
          <div className="flex items-center">
            <input
              id="mintable-checkbox"
              type="checkbox"
              checked={mintable}
              onChange={(e) => setMintable(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="mintable-checkbox"
              className="ml-2 text-sm text-gray-700">
              Mintable
            </label>
          </div>

          {/* Deploy Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white rounded ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-300"
            }`}>
            {loading ? "Deploying..." : "Deploy Token"}
          </button>
        </form>

        {/* Display Contract Address */}
        {contractAddress && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <p className="text-sm font-medium text-gray-700 mb-2">
              <strong>Token Deployed!</strong>
            </p>
            <p className="text-xs text-gray-700 break-all mb-2">
              <strong>Address:</strong> {contractAddress}
            </p>

            {/* View on AirDAO Explorer */}
            <a
              href={`https://airdao.io/explorer/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-xs block mb-2">
              View on AirDAO Explorer
            </a>

            {/* Add Liquidity on Astra */}
            <a
              href={`https://star-fleet.io/astra/pool/add/AMB/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full px-4 py-2 text-center text-white bg-purple-600 hover:bg-purple-700 rounded text-sm">
              Add Liquidity on Astra
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTokenForm;
