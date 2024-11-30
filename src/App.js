// src/App.js
import React, { useState, useEffect } from "react";
import ConnectWallet from "../src/Components/ConnectWallet";
import LockForm from "../src/Components//LockForm";
import LockedTokens from "../src/Components/LockedTokens";
import Navbar from "../src/Components//Navbar";
import { Container, Typography } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IsLocked from "./Components/IsLocked";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");

  return (
    <Router>
      <Navbar address={address} />
      <Container>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ marginTop: "20px" }}>
          AirDAO Liquidity Locker
        </Typography>
        <ConnectWallet
          setProvider={setProvider}
          setSigner={setSigner}
          setAddress={setAddress}
        />
        {signer && address && (
          <>
            <LockForm signer={signer} />
            <LockedTokens signer={signer} address={address} />
            <IsLocked signer={signer} />
          </>
        )}
      </Container>
      <ToastContainer />
    </Router>
  );
}

export default App;
