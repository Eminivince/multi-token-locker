// src/components/LockForm.js
import React, { useState } from "react";
import { ethers } from "ethers";
import {getContract} from "../utils/getContract";
import { TextField, Button, Typography, Grid, Paper } from "@mui/material";
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
                "function allowance(address owner, address spender) public view returns (uint256)"
            ],
            signer
        );

        const parsedAmount = ethers.utils.parseUnits(amount, 18);
        const allowance = await tokenContract.allowance(await signer.getAddress(), contract.address);

        if (allowance.lt(parsedAmount)) {
            // Approve the locker contract to spend tokens
            const approveTx = await tokenContract.approve(contract.address, parsedAmount);
            toast.info("Approving tokens...");
            await approveTx.wait();
            toast.success("Tokens approved!");
        }

        // Lock the tokens
        const lockTx = await contract.lockTokens(
            tokenAddress,
            parsedAmount,
            parseInt(duration) * 86400 // Convert days to seconds
        );
        toast.info("Locking tokens...");
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
    <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Lock Tokens
      </Typography>
      <form onSubmit={handleLock}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Token Address"
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              fullWidth
              required
              placeholder="0x..."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              required
              inputProps={{ min: "0", step: "any" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Lock Duration (days)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              fullWidth
              required
              inputProps={{ min: "1" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Lock Tokens
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default LockForm;
