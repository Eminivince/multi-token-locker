// src/components/LockedTokens.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getFactoryContract, getContract } from "../utils/getContract";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import { isAddress } from "ethers/lib/utils";

const IsLocked = ({ signer }) => {
  const [lockState, setLockState] = useState();
  const [lockAmount, setLockAmount] = useState();
  const [unlockTimes, setUnlockTimes] = useState();

  const isLocked = async (tokenAddress) => {
    const contract = getContract(signer);

    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
      ],
      signer
    );
    const tokenName = await tokenContract.name();
    const tokenSymbol = await tokenContract.symbol();

    const lockInfo = await contract.getTokenLockInfo(tokenAddress);
    let lockState = lockInfo[0];
    let lockAmount = ethers.utils.formatEther(lockInfo[1]);
    let unlockTimes = lockInfo[2].map((time) => time.toNumber());

    setLockState(lockState);
    setLockAmount(lockAmount);
    setUnlockTimes(unlockTimes);
    return { tokenName, tokenSymbol, lockState, lockAmount, unlockTimes };
  };

  const [tokenAddress, setTokenAddress] = useState("");
  const [lockInfo, setLockInfo] = useState(null);

  const handleCheckLock = async () => {
    if (!isAddress(tokenAddress)) {
      toast.error("Invalid token address");
      return;
    }
    const lockData = await isLocked(tokenAddress);
    setLockInfo(lockData);
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Check Token Lock Status
      </Typography>
      <input
        type="text"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        placeholder="Enter token address"
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      />
      <Button variant="contained" color="primary" onClick={handleCheckLock}>
        Check Lock
      </Button>
      {lockInfo && (
        <div style={{ marginTop: "20px" }}>
          <Typography variant="h6">Lock Information</Typography>
          <Typography>
            <strong>Token Name:</strong> {lockInfo.tokenName}
          </Typography>
          <Typography>
            <strong>Symbol:</strong> {lockInfo.tokenSymbol}
          </Typography>
          <Typography>
            <strong>Amount:</strong> {lockInfo.lockAmount}
          </Typography>
          <Typography>
            <strong>Unlock Times:</strong>
          </Typography>
          <ul>
            {lockInfo.unlockTimes.map((time, index) => (
              <li key={index}>{new Date(time * 1000).toLocaleString()}</li>
            ))}
          </ul>
        </div>
      )}
    </Paper>
  );
};

export default IsLocked;
