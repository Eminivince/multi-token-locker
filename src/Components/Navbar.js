// src/components/Navbar.js
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = ({ address }) => {
return (
    <AppBar position="static">
        <Toolbar>
            <img src="/logo.png" alt="logo" style={{ height: "20px", paddingRight: "10px" }} />
            <Typography variant="h6" style={{ flexGrow: 1 }}>
                AirPAD
            </Typography>
            <Button color="inherit" component={Link} to="/">
                Home
            </Button>
        </Toolbar>
    </AppBar>
);
};

export default Navbar;
