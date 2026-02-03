import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Countdown from "react-countdown";

//----------INTERNAL IMPORTS
import { VoterContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/Card/Card";

export const index = () => {
  const {
    checkIfWalletConnected,
    currentAccount,
    voterLength,
    getNewCandidate,
    getAllVoterData,
    candidateLength,
    giveVote,
    candidateArray,
    voterArray,
    votedVotersCount,
  } = useContext(VoterContext);

  const currentVoter = voterArray?.find(
    (v) => v.voterAddress?.toLowerCase() === currentAccount?.toLowerCase()
  );
  const voterVoted = currentVoter?.voted ?? false;

  useEffect(() => {
    checkIfWalletConnected();
  }, [checkIfWalletConnected]);

  // Refetch counts when wallet is connected so No Candidate / No Voter stay in sync
  useEffect(() => {
    if (currentAccount) {
      getNewCandidate();
      getAllVoterData();
    }
  }, [currentAccount, getNewCandidate, getAllVoterData]);
  return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner__info}>
            <div className={Style.candidate_list}>
              <p>No Candidate:<span>{Number(candidateLength) ?? 0}</span></p>
            </div>
            <div className={Style.candidate_list}>
              <p>No Voter:<span>{Number(voterLength) ?? 0}</span></p>
            </div>
          </div>
          <div className={Style.winner_info}>
            <small>
              <Countdown date={Date.now() + 100000}/>
            </small>
          </div>
        </div>
      )}
    <Card
      candidateArray={candidateArray}
      giveVote={giveVote}
      totalVoted={votedVotersCount}
      currentAccount={currentAccount}
      voterVoted={voterVoted}
      voterAllowed={!!currentVoter}
    />
    </div>
  );
};
export default index;
