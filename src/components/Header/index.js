import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
const { ethers } = require("ethers");

import './index.scss';

function HomePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Check if Metamask is installed
    if (typeof window.ethereum === 'undefined') {
      alert("No Metamask!");
    } else {
      const connected = localStorage.getItem('isConnected');
      const balance = localStorage.getItem('balance');

      if (connected === 'true' && balance) {
        setIsConnected(true);
        getAccountBalance(balance);
      }
    }
  }, []);

  const getAccountBalance = (account) => {
    window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
      .then((balance) => {
        balance = ethers.getBigInt(balance);
        setUserBalance(ethers.formatEther(balance));
      })
      .catch((error) => {
        setErrorMessage(error.message);
        console.log(errorMessage);
      });
  };

  const connectWallet = async () => {
    try {
      let result = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = result[0];

      setIsConnected(true);
      localStorage.setItem('isConnected', 'true');
      localStorage.setItem('balance', account);

      getAccountBalance(account);
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
    }
  };

  return (
    <Row className="padding-32">
      <Col xs="4" className="">
        <img src={require('assets/img/logo.png')} alt="Logo" />
      </Col>
      <Col xs="4" className="logo">
        <Link to="/" className="margin-12">
          HOME
        </Link>
        <span>/</span>
        <Link to="/about" className="margin-12">
          ABOUT
        </Link>
        <span>/</span>
        <Link to="/loginpage" className="margin-12">
          LOGIN
        </Link>
      </Col>
      <Col xs="4" className="logo">
        <a className="margin-12" onClick={connectWallet}>
          {isConnected ? 'Connected' : 'Connect Wallet'}
        </a>
        <a>{userBalance ? `Balance: ${userBalance}` : ''}</a>
      </Col>
    </Row>
  );
}

export default HomePage;
