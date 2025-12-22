import React, { useState, useEffect } from "react";
import Web3modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { axios } from "axios";
import { useRouter } from "next/router";
//INTERNAL IMPORT
import { VotingAddress, VotingABI } from "./constants";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingABI, signerOrProvider);
export const VoterContext = React.createContext();
export const VotingProvider = ({ children }) => {
  const VotingTittle = "Decentralized Voting System";
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateList, setCandidateList] = useState(pushCandidate);

  //--------END CANDIDATE DATA
  const [error, setError] = useState("");
  const highestVote = [];

  //--------VOTER SECTION

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);

  //---------CONNECTING METAMASK WALLET
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return setError("Install MetaMask");
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        setError("No Account Found");
      }
    } catch (error) {
      setError("An error occurred while checking the wallet");
    }
  };

  //---------CONNECT WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return setError("Install MetaMask");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      setError("An error occurred while connecting the wallet");
    }
  };

  //----------UPLOAD TO IPFS VOTER IMAGE

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      setError("An error occurred while uploading to IPFS");
    }
  };
  return (
    <VoterContext.Provider
      value={{
        VotingTittle,
        checkIfWalletConnected,
        connectWallet,
        uploadToIPFS,
      }}
    >
      {children}
    </VoterContext.Provider>
  );
};
