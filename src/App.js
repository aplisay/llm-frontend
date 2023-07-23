import React, { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import { useAuth } from "./api/auth";
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import LlmPanel from './components/LlmPanel.js';

const Home = () => (
  <Container>
    <LlmPanel />
  </Container>
);


export default function App() {

    const status = useAuth();
    console.log({ status }, 'app');
    // have to wait for Firebase otherwise logged in users see a flash of logged out view
    if (status === "loading") return null;
    if (status === "loggedOut")
      return (
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      );
    return (
      <Container>
        <LlmPanel />
      </Container>
    );

}