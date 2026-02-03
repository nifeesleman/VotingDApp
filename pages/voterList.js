import React, { useEffect, useContext } from "react";
import { VoterContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import VoterCard from "../components/VoterCard/VoterCard";

export default function VoterList() {
  const {
    checkIfWalletConnected,
    currentAccount,
    voterLength,
    getAllVoterData,
    voterArray,
  } = useContext(VoterContext);

  useEffect(() => {
    checkIfWalletConnected();
  }, [checkIfWalletConnected]);

  useEffect(() => {
    if (currentAccount) {
      getAllVoterData();
    }
  }, [currentAccount, getAllVoterData]);

  return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner__info}>
            <div className={Style.candidate_list}>
              <p>Total Voters: <span>{Number(voterLength) ?? 0}</span></p>
            </div>
          </div>
        </div>
      )}
      <VoterCard voterArray={voterArray} />
    </div>
  );
}
