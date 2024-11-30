// src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import getContract from "../utils/getContract";
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
  Grid,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";

const AdminDashboard = ({ signer, isOwner }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [withdrawToken, setWithdrawToken] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Assuming the contract keeps track of total users and their addresses
  // If not, additional contract modifications are required

  const fetchUsers = async () => {
    try {
      const contract = getContract(signer);
      // Placeholder: Replace with actual method to fetch users
      // const userCount = await contract.getTotalUsers();
      // setTotalUsers(userCount);
      // const userAddresses = [];
      // for (let i = 0; i < userCount; i++) {
      //   const user = await contract.getUser(i);
      //   userAddresses.push(user);
      // }
      // setUsers(userAddresses);
      toast.info("Fetching users is not implemented.");
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  const handleEmergencyWithdraw = async () => {
    if (!withdrawToken || !withdrawAddress || !withdrawAmount) {
      toast.error("Please fill in all withdrawal fields.");
      return;
    }

    try {
      const contract = getContract(signer);
      const tx = await contract.emergencyWithdraw(
        withdrawToken,
        withdrawAddress,
        ethers.utils.parseUnits(withdrawAmount, 18)
      );
      toast.info("Performing emergency withdrawal...");
      await tx.wait();
      toast.success("Emergency withdrawal successful!");
    } catch (error) {
      console.error("Emergency withdrawal failed:", error);
      toast.error("Failed to perform emergency withdrawal.");
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner]);

  return (
    <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Admin Dashboard
      </Typography>
      {isOwner ? (
        <>
          {/* User Management Section */}
          <Typography variant="subtitle1">User Management</Typography>
          <Button variant="contained" color="primary" onClick={fetchUsers}>
            Fetch Users
          </Button>
          {/* Display users if implemented */}
          {/* 
          <TableContainer component={Paper}>
            <Table aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell>User Address</TableCell>
                  <TableCell align="right">Number of Locks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {user}
                    </TableCell>
                    <TableCell align="right">{/* Number of locks * /}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          */}

          {/* Emergency Withdrawal Section */}
          <Typography variant="subtitle1" style={{ marginTop: "20px" }}>
            Emergency Withdrawal
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Token Address"
                type="text"
                value={withdrawToken}
                onChange={(e) => setWithdrawToken(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Recipient Address"
                type="text"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Amount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                fullWidth
                required
                inputProps={{ min: "0", step: "any" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleEmergencyWithdraw}
                fullWidth>
                Withdraw Tokens
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography>You do not have access to this dashboard.</Typography>
      )}
    </Paper>
  );
};

export default AdminDashboard;
