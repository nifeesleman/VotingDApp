import React, { useState, useEffect, useCallback } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
//INTERNAL IMPORT
import { VotingAddress, VotingABI } from "./constants";

// Convert File/Blob to base64 for /api/pinata (avoids CORS by proxying through our server)
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 =
        typeof dataUrl === "string" && dataUrl.includes(",")
          ? dataUrl.split(",")[1]
          : dataUrl;
      resolve(base64);
    };
    reader.onerror = reject;
  });

const fetchContract = (signerOrProvider) => {
  if (!VotingAddress) {
    console.error("VotingAddress is undefined. Please check constants.js");
    throw new Error("Contract address is not configured");
  }
  if (!VotingABI || !Array.isArray(VotingABI)) {
    console.error("VotingABI is invalid. Please check constants.js");
    throw new Error("Contract ABI is not configured");
  }
  const contract = new ethers.Contract(
    VotingAddress,
    VotingABI,
    signerOrProvider
  );
  console.log("Connected to contract at:", VotingAddress);
  return contract;
};
export const VoterContext = React.createContext();
export const VotingProvider = ({ children }) => {
  const VotingTittle = "Decentralized Voting System";
  const router = useRouter();
  //--------CANDIDATE SECTION
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState(0);
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);
  const [candidateFetchFailed, setCandidateFetchFailed] = useState(false);

  //--------END CANDIDATE DATA
  const [error, setError] = useState("");

  //--------VOTER SECTION
  const pushVoter = [];
  const voterIndex = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState(0);
  const [voterAddress, setVoterAddress] = useState([]);
  const [voterFetchFailed, setVoterFetchFailed] = useState(false);
  const [votedVotersCount, setVotedVotersCount] = useState(0);

  //---------CONNECTING METAMASK WALLET
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return setError("Install MetaMask");
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        setError("");
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
      setError("");
      if (accounts[0]) {
        window.location.reload();
      }
    } catch (error) {
      setError("An error occurred while connecting the wallet");
    }
  };

  //----------UPLOAD TO IPFS VOTER IMAGE (via /api/pinata to avoid CORS)
  const uploadToIPFS = useCallback(async (file) => {
    try {
      if (!file) {
        throw new Error("No file provided");
      }
      const base64 = await fileToBase64(file);
      const res = await fetch("/api/pinata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: base64,
          filename: file.name || "file",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Upload failed: ${res.status}`);
      }
      const fileUrl = data.url || (data.IpfsHash && `${process.env.NEXT_PUBLIC_PINATA_HASH_URL || "https://gateway.pinata.cloud/ipfs/"}${data.IpfsHash}`);
      if (!fileUrl) {
        throw new Error("Invalid response from Pinata: missing url/IpfsHash");
      }
      return fileUrl;
    } catch (error) {
      console.error("IPFS upload error:", error);
      const errorMessage =
        error?.message || "An error occurred while uploading to IPFS";
      setError(errorMessage);
      throw error; // Re-throw to allow UI to handle it
    }
  }, []);
  //----------UPLOAD TO IPFS CANDIDATE IMAGE (via /api/pinata to avoid CORS)
  const uploadToIPFSCandidate = useCallback(async (file) => {
    try {
      if (!file) {
        throw new Error("No file provided");
      }
      const base64 = await fileToBase64(file);
      const res = await fetch("/api/pinata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: base64,
          filename: file.name || "file",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Upload failed: ${res.status}`);
      }
      const fileUrl = data.url || (data.IpfsHash && `${process.env.NEXT_PUBLIC_PINATA_HASH_URL || "https://gateway.pinata.cloud/ipfs/"}${data.IpfsHash}`);
      if (!fileUrl) {
        throw new Error("Invalid response from Pinata: missing url/IpfsHash");
      }
      return fileUrl;
    } catch (error) {
      console.error("IPFS upload error:", error);
      const errorMessage =
        error?.message || "An error occurred while uploading to IPFS";
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
        throw new Error(
          "Contract address is not configured. Please deploy the contract first."
        );
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      // Upload metadata via /api/pinata (avoids CORS) or use placeholder
      let metadataUrl;
      const pinataKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const pinataSecret = process.env.NEXT_PUBLIC_PINATA_SECRECT_KEY;
      if (pinataKey && pinataSecret) {
        const metadata = { name, address, position };
        const json = JSON.stringify(metadata);
        const base64 = btoa(unescape(encodeURIComponent(json)));
        const res = await fetch("/api/pinata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, filename: "voter-metadata.json" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Pinata upload failed: ${res.status}`);
        metadataUrl = data.url || (data.IpfsHash && `${process.env.NEXT_PUBLIC_PINATA_HASH_URL || "https://gateway.pinata.cloud/ipfs/"}${data.IpfsHash}`);
        if (!metadataUrl) throw new Error("Invalid response from Pinata");
      } else {
        metadataUrl = "data:application/json," + encodeURIComponent(JSON.stringify({ name, address, position }));
      }

      // Contract: voterRight(address, name, image, ipfs) — image = photo URL, ipfs = metadata URL
      const voter = await contract.voterRight(
        address,
        name,
        fileUrl,
        metadataUrl
      );
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
      const errorMessage =
        error?.reason ||
        error?.message ||
        "An error occurred while creating the voter";
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
        setError(
          "Contract address is not configured. Please deploy the contract first."
        );
        return;
      }

      // Check if account is connected
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
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

      // VOTER LIST - handle wrong contract / not deployed (BAD_DATA, unrecognized selector)
      let voterListData;
      try {
        voterListData = await contract.getVoterList();
      } catch (callError) {
        const code = callError?.code ?? callError?.info?.error?.code;
        const isBadContract =
          code === "BAD_DATA" ||
          code === "CALL_EXCEPTION" ||
          (callError?.message && callError.message.includes("unrecognized-selector"));
        if (isBadContract) {
          console.warn(
            "Contract at address does not support getVoterList. Redeploy the Create contract and set VotingAddress to the new address."
          );
          setVoterAddress([]);
          setVoterArray([]);
          setVoterLength(0);
          setVoterFetchFailed(true);
          setError(
            "Contract not found or wrong contract at this address. Redeploy with: npx hardhat run scripts/deploy.js --network localhost"
          );
          return;
        }
        throw callError;
      }

      setVoterAddress(voterListData);

      const voterPromises = voterListData.map(async (el) => {
        try {
          const singleVoterData = await contract.getVoterdata(el);
          pushVoter.push(singleVoterData);

          // Destructure the tuple properly
          const [voterId, name, image, address, allowed, voted] =
            singleVoterData;
          return {
            voterId: voterId.toString(),
            name,
            image,
            address,
            allowed: allowed.toString(),
            voted,
            voterAddress: el, // Keep the original address for reference
          };
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
      console.log(
        "Voter data loaded successfully:",
        validVoterData.length,
        "voters"
      );
    } catch (error) {
      console.error("Error in getAllVoterData:", error);
      const errorMessage =
        error?.reason ||
        error?.message ||
        "An error occurred while fetching voter data";
      setError(errorMessage);
    }
  }, []);
  //--------GIVE-VOTE (voter = msg.sender = connected wallet; must be allowed and not voted)
  const giveVote = async (candidateAddress, candidateVoteId) => {
    try {
      if (!currentAccount) {
        return setError("Connect your wallet to vote");
      }
      if (!window.ethereum || !VotingAddress) {
        return setError("Wallet or contract not configured");
      }
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      if (signerAddress.toLowerCase() !== currentAccount.toLowerCase()) {
        return setError("Please use the same connected account to vote");
      }
      const contract = fetchContract(signer);
      const tx = await contract.vote(candidateAddress, candidateVoteId);
      await tx.wait();
      setError("");
      await getNewCandidate();
      await getAllVoterData();
    } catch (error) {
      console.error("Error voting:", error);
      const msg =
        error?.reason ||
        error?.message ||
        "Failed to vote. Check that your address is allowed and you have not voted yet.";
      setError(msg);
    }
  };

  //---------CANDIDATE SECTION--------
  const setCandidate = async (candiadateForm, fileUrl, nextRouter, onSuccess) => {
    try {
      const { name, address, age } = candiadateForm;
      if (!name || !address || !age || !fileUrl) {
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
        throw new Error(
          "Contract address is not configured. Please deploy the contract first."
        );
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      // Upload metadata via /api/pinata (avoids CORS) or use placeholder if not configured
      let metadataUrl;
      const pinataKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const pinataSecret = process.env.NEXT_PUBLIC_PINATA_SECRECT_KEY;

      if (pinataKey && pinataSecret) {
        const metadata = { name, address, age };
        const json = JSON.stringify(metadata);
        const base64 = btoa(unescape(encodeURIComponent(json)));

        const res = await fetch("/api/pinata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, filename: "metadata.json" }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Pinata upload failed: ${res.status}`);
        }
        metadataUrl = data.url || (data.IpfsHash && `${process.env.NEXT_PUBLIC_PINATA_HASH_URL || "https://gateway.pinata.cloud/ipfs/"}${data.IpfsHash}`);
        if (!metadataUrl) {
          throw new Error("Invalid response from Pinata: missing url/IpfsHash");
        }
      } else {
        // Local dev fallback: use data URL so registration works without Pinata
        const metadata = { name, address, age };
        const json = JSON.stringify(metadata);
        metadataUrl = "data:application/json," + encodeURIComponent(json);
        console.warn(
          "Pinata not configured (missing PINATA_API_KEY / PINATA_SECRET_KEY in .env). Using data URL for metadata."
        );
      }
      console.log("Calling setCandidate with:", {
        address,
        age,
        name,
        metadataUrl: metadataUrl?.slice(0, 50) + "...",
        fileUrl: fileUrl?.slice(0, 50) + "...",
      });
      // Contract: setCandidate(address, age, name, image, ipfs) — image = photo URL, ipfs = metadata URL
      const candidate = await contract.setCandidate(
        address,
        age,
        name,
        fileUrl,
        metadataUrl
      );
      console.log("Transaction sent, waiting for confirmation...");
      await candidate.wait();
      console.log("candidate created successfully!");

      // Refresh candidate list so the new candidate appears; stay on page so user sees it
      await getNewCandidate();
      if (typeof onSuccess === "function") onSuccess();
    } catch (error) {
      console.error("Error creating candidate:", error);
      const errorMessage =
        error?.reason ||
        error?.message ||
        "An error occurred while creating the candidate";
      setError(errorMessage);
      throw error; // Re-throw to allow UI to handle it
    }
  };
  //---------GET CANDIDATE DATA--------\
  const getNewCandidate = useCallback(async () => {
    try {
      if (!window.ethereum || !VotingAddress) {
        setCandidateFetchFailed(false);
        return;
      }
      setCandidateFetchFailed(false);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      // Handle wrong contract / not deployed (BAD_DATA, decode errors, etc.)
      let allCandidate;
      try {
        allCandidate = await contract.getCandidate();
      } catch (callError) {
        console.warn(
          "getCandidate failed:",
          callError?.message ?? callError?.shortMessage ?? callError
        );
        setCandidateArray([]);
        setCandidateLength(0);
        setCandidateFetchFailed(true);
        return;
      }

      if (!allCandidate || allCandidate.length === 0) {
        setCandidateArray([]);
        setCandidateLength(0);
        return;
      }
      const candidatePromises = allCandidate.map(async (address) => {
        const data = await contract.getcandidatedata(address);
        return data;
      });
      const candidateData = await Promise.all(candidatePromises);
      setCandidateArray(candidateData);
      setCandidateLength(candidateData.length);
      try {
        const votedList = await contract.getVotedVoterList();
        setVotedVotersCount(Array.isArray(votedList) ? votedList.length : 0);
      } catch (e) {
        setVotedVotersCount(0);
      }
      console.log("CANDIDATE LENGTH", candidateData.length);
    } catch (error) {
      console.log(error);
      setCandidateFetchFailed(true);
      setError(
        error?.reason ||
          error?.message ||
          "An error occurred while fetching candidates"
      );
    }
  }, []);

  // Check wallet connection on mount and when account changes
  useEffect(() => {
    checkIfWalletConnected();
  }, []);
  // Fetch candidate and voter data when wallet is connected (so counts/lists update on index)
  useEffect(() => {
    if (currentAccount) {
      getNewCandidate();
    }
  }, [currentAccount, getNewCandidate]);

  useEffect(() => {
    if (currentAccount) {
      getAllVoterData();
    }
  }, [currentAccount, getAllVoterData]);

  return (
    <VoterContext.Provider
      value={{
        VotingTittle,
        checkIfWalletConnected,
        connectWallet,
        uploadToIPFS,
        uploadToIPFSCandidate,
        createVoter,
        getAllVoterData,
        giveVote,
        setCandidate,
        getNewCandidate,
        error,
        voterArray,
        voterLength,
        voterAddress,
        voterFetchFailed,
        candidateArray,
        candidateLength,
        candidateFetchFailed,
        currentAccount,
        votedVotersCount,
      }}
    >
      {children}
    </VoterContext.Provider>
  );
};
