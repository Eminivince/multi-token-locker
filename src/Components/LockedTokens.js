// src/components/LockedTokens.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/getContract";
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

const LockedTokens = ({ signer, address }) => {
  const [locks, setLocks] = useState([]);

  const fetchLocks = async () => {
    try {
      const contract = getContract(signer);
      const totalLocks = await contract.getLockCount(address);
      const locksData = [];

      for (let i = 0; i < totalLocks; i++) {
        const lock = await contract.getLock(address, i);
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

  const handleUnlock = async (indices) => {
    if (indices.length === 0) {
      toast.error("No locks available for unlocking.");
      return;
    }

    try {
      const contract = getContract(signer);
      const tx = await contract.unlockTokens(indices);
      toast.info("Unlocking tokens...");
      await tx.wait();
      toast.success("Tokens unlocked successfully!");
      fetchLocks();
    } catch (error) {
      console.error("Unlocking failed:", error);
      toast.error(`Failed to unlock tokens: ${error.message}`);
    }
  };

  // Function to determine which locks are unlockable
  const getUnlockableIndices = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const unlockable = locks
      .filter(
        (lock) => new Date(lock.unlockTime).getTime() / 1000 <= currentTime
      )
      .map((lock) => lock.index);
    return unlockable;
  };

  const unlockableIndices = getUnlockableIndices();

  return (
    <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Your Locked Tokens
      </Typography>
      {locks.length === 0 ? (
        <Typography>No tokens locked.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="locked tokens table">
              <TableHead>
                <TableRow>
                  <TableCell>Token Name</TableCell>
                  <TableCell>Symbol</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Unlock Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locks.map((lock) => (
                  <TableRow key={lock.index}>
                    <TableCell component="th" scope="row">
                      {lock.tokenName}
                    </TableCell>
                    <TableCell>{lock.tokenSymbol}</TableCell>
                    <TableCell align="right">{lock.amount}</TableCell>
                    <TableCell align="right">{lock.unlockTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: "20px" }}
            onClick={() => handleUnlock(unlockableIndices)}
            disabled={unlockableIndices.length === 0}>
            Unlock Available Tokens
          </Button>
          {unlockableIndices.length === 0 && (
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ marginTop: "10px" }}>
              No tokens available for unlocking at this time.
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
};

export default LockedTokens;
