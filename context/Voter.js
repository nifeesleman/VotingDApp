import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { axios } from "axios";
import { useRouter } from "next/router";
//INTERNAL IMPORT
import { VotingAddress, VotingABI } from "./constants";

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
  const [candidateArray, setCandidateArray] = useState(pushCandidate);

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
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(process.env.NEXT_PUBLIC_PINATA_POST_URL, {
        method: "POST",
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRECT_KEY,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Pinata upload failed");
      }

      const data = await res.json();

      const fileUrl = `${process.env.NEXT_PUBLIC_PINATA_HASH_URL}${data.IpfsHash}`;
      return fileUrl;
    } catch (error) {
      console.error(error);
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
