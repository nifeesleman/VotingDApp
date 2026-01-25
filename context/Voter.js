import React, { useState, useEffect, useCallback } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
//INTERNAL IMPORT
import { VotingAddress, VotingABI } from "./constants";

const fetchContract = (signerOrProvider) => {
  if (!VotingAddress) {
    console.error("VotingAddress is undefined. Please check constants.js");
    throw new Error("Contract address is not configured");
  }
  if (!VotingABI || !Array.isArray(VotingABI)) {
    console.error("VotingABI is invalid. Please check constants.js");
    throw new Error("Contract ABI is not configured");
  }
  const contract = new ethers.Contract(VotingAddress, VotingABI, signerOrProvider);
  console.log("Connected to contract at:", VotingAddress);
  return contract;
};
export const VoterContext = React.createContext();
export const VotingProvider = ({ children }) => {
  const VotingTittle = "Decentralized Voting System";
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const [candidateArray, setCandidateArray] = useState([]);

  //--------END CANDIDATE DATA
  const [error, setError] = useState("");

  //--------VOTER SECTION
  const [voterArray, setVoterArray] = useState([]);
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
  const uploadToIPFS = useCallback(async (file) => {
    try {
      if (!file) {
        throw new Error("No file provided");
      }

      // Validate environment variables
      if (!process.env.NEXT_PUBLIC_PINATA_POST_URL || 
          !process.env.NEXT_PUBLIC_PINATA_API_KEY || 
          !process.env.NEXT_PUBLIC_PINATA_SECRECT_KEY ||
          !process.env.NEXT_PUBLIC_PINATA_HASH_URL) {
        throw new Error("Pinata configuration is missing. Please check your environment variables.");
      }

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
        const errorText = await res.text();
        throw new Error(`Pinata upload failed: ${errorText}`);
      }

      const data = await res.json();
      if (!data.IpfsHash) {
        throw new Error("Invalid response from Pinata: missing IpfsHash");
      }

      const fileUrl = `${process.env.NEXT_PUBLIC_PINATA_HASH_URL}${data.IpfsHash}`;
      return fileUrl;
    } catch (error) {
      console.error("IPFS upload error:", error);
      const errorMessage = error?.message || "An error occurred while uploading to IPFS";
      setError(errorMessage);
      throw error; // Re-throw to allow UI to handle it
    }
  }, []);


  //----------CREATE VOTER FUNCTION
  const createVoter = async (formInput, fileUrl, nextRouter) => {
    try {
      const { name, address, position } = formInput;
      if (!name || !address || !position || !fileUrl) {
        return setError("Input data is missing");
      }
      if (!ethers.isAddress(address)) {
        return setError("Enter a valid wallet address");
      }
      if (!window.ethereum) {
        throw new Error("Install MetaMask");
      }

      // Validate contract address before connecting
      if (!VotingAddress) {
        throw new Error("Contract address is not configured. Please deploy the contract first.");
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      // Use the same Pinata flow as image uploads for metadata JSON
      const metadata = { name, address, position };
      const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
      const formData = new FormData();
      formData.append("file", blob, "metadata.json");

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
      const metadataUrl = `${process.env.NEXT_PUBLIC_PINATA_HASH_URL}${data.IpfsHash}`;
      // console.log(metadataUrl);
      console.log("Calling voterRight with:", { address, name, metadataUrl, fileUrl });
      const voter = await contract.voterRight(address, name, metadataUrl, fileUrl);
      console.log("Transaction sent, waiting for confirmation...");
      await voter.wait();
      console.log("Voter created successfully!");

      // Refresh voter data after creation
      await getAllVoterData();

      const redirect = nextRouter || router;
      if (redirect?.push) {
        redirect.push("/");
      }
    } catch (error) {
      console.error("Error creating voter:", error);
      const errorMessage = error?.reason || error?.message || "An error occurred while creating the voter";
      setError(errorMessage);
      throw error; // Re-throw to allow UI to handle it
    }
  };

  //-----------GET VOTER DATA
  const getAllVoterData = useCallback(async () => {
    try {
      // Check if wallet is connected
      if (!window.ethereum) {
        console.warn("MetaMask is not installed");
        return;
      }

      // Validate contract address
      if (!VotingAddress) {
        console.error("Contract address is not configured");
        setError("Contract address is not configured. Please deploy the contract first.");
        return;
      }

      // Check if account is connected
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) {
        console.warn("No wallet connected. Skipping voter data fetch.");
        return;
      }

      // SMART CONTRACT CONNECTING
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      // VOTER LIST
      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);

      // Properly handle async operations with Promise.all
      const voterPromises = voterListData.map(async (el) => {
        try {
          const singleVoterData = await contract.getVoterdata(el);
          return singleVoterData;
        } catch (error) {
          console.error(`Error fetching voter data for ${el}:`, error);
          return null;
        }
      });

      const voterDataArray = await Promise.all(voterPromises);
      const validVoterData = voterDataArray.filter((data) => data !== null);
      
      // Update state properly
      setVoterArray(validVoterData);
      setVoterLength(validVoterData.length);
      
      console.log("Voter data loaded successfully:", validVoterData.length, "voters");
    } catch (error) {
      console.error("Error in getAllVoterData:", error);
      setError("An error occurred while fetching voter data");
    }
  };

  // Check wallet connection on mount and when account changes
  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  // Fetch voter data when wallet is connected
  useEffect(() => {
    if (currentAccount) {
      getAllVoterData();
    }
  }, [currentAccount]);

  return (
    <VoterContext.Provider
      value={{
        VotingTittle,
        checkIfWalletConnected,
        connectWallet,
        uploadToIPFS,
        createVoter,
        getAllVoterData,
      }}
    >
      {children}
    </VoterContext.Provider>
  );
};
