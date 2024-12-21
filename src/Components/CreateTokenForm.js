// src/components/CreateTokenForm.js

import React, { useState } from "react";
import { ethers } from "ethers";
import ERC20Token from "../abi/ERC20Token.json";
import { getProvider, getSigner } from "../ethereum";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Link,
} from "@mui/material";
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

      await provider.send("eth_requestAccounts", []);
      const signer = getSigner(provider);

      const ERC20Factory = new ethers.ContractFactory(
        ERC20Token.abi,
        ERC20Token.bytecode,
        signer
      );

      setLoading(true);
      const initialSupply = ethers.utils.parseUnits(supply, 18); // Ensure 18 decimals

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
    <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Create Your ERC20 Token
      </Typography>
      <form onSubmit={handleDeploy}>
        <Grid container spacing={2}>
          {/* Token Name */}
          <Grid item xs={12}>
            <TextField
              label="Token Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              placeholder="e.g., MyToken"
            />
          </Grid>

          {/* Token Symbol */}
          <Grid item xs={12}>
            <TextField
              label="Token Symbol"
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              fullWidth
              required
              placeholder="e.g., MTK"
            />
          </Grid>

          {/* Total Supply */}
          <Grid item xs={12}>
            <TextField
              label="Total Supply"
              type="number"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              fullWidth
              required
              inputProps={{ min: "0", step: "any" }}
              placeholder="e.g., 1000000"
            />
          </Grid>

          {/* Mintable Checkbox */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={mintable}
                  onChange={(e) => setMintable(e.target.checked)}
                  color="primary"
                />
              }
              label="Mintable"
            />
          </Grid>

          {/* Deploy Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}>
              {loading ? "Deploying..." : "Deploy Token"}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Display Contract Address */}
      {contractAddress && (
        <Paper
          elevation={2}
          style={{
            padding: "15px",
            marginTop: "20px",
            backgroundColor: "#f5f5f5",
          }}>
          <Typography variant="subtitle1">
            <strong>Token Deployed!</strong>
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Address:</strong> {contractAddress}
          </Typography>

          {/* View on AirDAO Explorer */}
          <Typography variant="body2" gutterBottom>
            <Link
              href={`https://airdao.io/explorer/tx/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer">
              View on AirDAO Explorer
            </Link>
          </Typography>

          {/* Add Liquidity on Astra */}
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            component="a"
            href={`https://star-fleet.io/astra/pool/add/AMB/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginTop: "10px" }}>
            Add Liquidity on Astra
          </Button>
        </Paper>
      )}
    </Paper>
  );
};

export default CreateTokenForm;
