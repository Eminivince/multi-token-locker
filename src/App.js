// src/App.js

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Existing components (unchanged):
import ConnectWallet from "./Components/ConnectWallet";
import Navbar from "./Components/Navbar";
import LockForm from "./Components/LockForm";
import LockedTokens from "./Components/LockedTokens";
import CreateTokenForm from "./Components/CreateTokenForm";
import IsLocked from "./Components/IsLocked";
import Logo from "./assets/AirDAOLogo.jpeg";

// --- NEW: Inline subcomponent for loading screen ---
const LoadingScreen = () => {
  return (
    <div className="flex h-screen  items-center justify-center bg-gray-950">
      <div className="text-center">
        {/* Simple spinner animation using Tailwind classes */}

        <div>
          {" "}
          <img
            src={Logo}
            alt="AirDAO"
            className="w-16 h-16 mb-4 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin mx-auto"
          />
        </div>
        <p className="text-lg text-gray-700">Loading application...</p>
      </div>
    </div>
  );
};

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState("");
  const [appLoading, setAppLoading] = useState(true);

  // Simulate some initial loading (fetching config, checking wallet, etc.)
  useEffect(() => {
    // If you have any async logic to check or initialize, do it here.
    // For demonstration, we’ll just timeout for 1.5 seconds:
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Render the loading screen while app is loading
  if (appLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-950 flex flex-col">
        {/* Navbar stays at the top */}
        <Navbar address={address} />

        {/* Toast notifications */}
        <ToastContainer />

        {/* Main content area */}
        <div className="flex-1 container mx-auto px-4 py-8">
          {/* If no wallet connected, show a prompt */}
          {!address ? (
            <div className="flex flex-col items-center justify-center">
              {/* Example: Some animation + message prompting to connect wallet */}
              <div className="w-16 h-16 mb-4 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
              <p className="text-xl font-semibold text-gray-700 mb-4">
                Please connect your wallet to AirDAO Network get started.
              </p>
              <img
                src={Logo}
                alt="AirDAO"
                className="rounded-full my-10 w-32"
              />

              {/* Existing ConnectWallet component */}
              <ConnectWallet
                setProvider={setProvider}
                setSigner={setSigner}
                setAddress={setAddress}
              />
            </div>
          ) : (
            <>
              {/* Once wallet is connected, show the rest of your components */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  AirDAO Liquidity Locker
                </h1>
                <p className="text-gray-600">
                  Welcome, {address.slice(0, 6)}...
                  {address.slice(-4)}
                </p>
              </div>

              {/* Your existing components */}
              <CreateTokenForm />
              <LockForm signer={signer} />
              <LockedTokens signer={signer} address={address} />
              <IsLocked signer={signer} />
            </>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
