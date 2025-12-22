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
  return (
    <VoterContext.Provider value={{ VotingTittle }}>
      {children}
    </VoterContext.Provider>
  );
};
