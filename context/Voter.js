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
  return (
    <VoterContext.Provider value={{ VotingTittle }}>
      {children}
    </VoterContext.Provider>
  );
};
