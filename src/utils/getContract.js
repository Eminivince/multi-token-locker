// src/utils/getContract.js
import { ethers } from "ethers";
import LiquidityLockerABI from "../../src/contracts/MultiTokenLocker.json";
import factoryABI from "../../src/contracts/factoryABI.json";

const getContract = (signerOrProvider) => {
  const contractAddress = "0x4593980563AdD0407A18C866467bEFE091DB7a27"; // Replace with your deployed contract address

  let contract;
  try {
    console.log("creating contract");
    contract = new ethers.Contract(
      contractAddress,
      LiquidityLockerABI,
      signerOrProvider
    );

    console.log({ contract });
    return contract;
  } catch (e) {
    console.log({ contract });
    console.error("Error fetching contractf:", e);
  }
};

const getFactoryContract = (signerOrProvider) => {
    const factoryContractAddress = "0x2b6852CeDEF193ece9814Ee99BE4A4Df7F463557"; // Replace with your deployed contract address
    let contract;
    try {
      console.log("creating factory contract");
      contract = new ethers.Contract(
        factoryContractAddress,
        factoryABI,
        signerOrProvider
      );

      console.log({ contract });
      return contract;
    } catch (e) {
      console.log({ contract });
      console.error("Error fetching contractf:", e);
    }
}

export { getContract, getFactoryContract };