// src/App.js
import React, { useState, useEffect } from "react";
import ConnectWallet from "../src/Components/ConnectWallet";
import LockForm from "../src/Components//LockForm";
import LockedTokens from "../src/Components/LockedTokens";
import CreateTokenForm from "../src/Components/CreateTokenForm";
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
          AirPad
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

      <div className="App">
        <header className="App-header">
          <h1 className="text-center">ERC20 Token Creator</h1>
        </header>
        <main>
          <CreateTokenForm />
        </main>
      </div>
      <ToastContainer />
    </Router>
  );
}

export default App;
