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
    votingEndTime,
    winnerDeclared,
    winnerName,
    declareWinner,
  } = useContext(VoterContext);

  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const winnerDisplayName = winnerName?.trim() || "";
  const hasWinner = winnerDeclared && winnerDisplayName.length > 0;

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

  useEffect(() => {
    if (winnerDeclared) setShowWinnerModal(true);
  }, [winnerDeclared]);

  const countdownDate = votingEndTime > 0 ? votingEndTime * 1000 : Date.now() + 100000;

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
              <Countdown date={countdownDate} />
            </small>
          </div>
          {canDeclareWinner && (
            <div className={Style.declareWinnerWrap}>
              <button type="button" className={Style.declareWinnerBtn} onClick={declareWinner}>
                Declare winner
              </button>
            </div>
          )}
        </div>
      )}
      {showWinnerModal && winnerDeclared && (
        <div className={Style.winnerModalOverlay} onClick={() => setShowWinnerModal(false)} role="dialog" aria-modal="true" aria-label="Winner announced">
          <div className={Style.winnerModal} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={Style.winnerModalClose} onClick={() => setShowWinnerModal(false)} aria-label="Close">×</button>
            <h2 className={Style.winnerModalTitle}>
              {hasWinner ? "Congratulations!" : "Voting ended"}
            </h2>
            <p className={Style.winnerModalMessage}>
              {hasWinner
                ? `The winner is: ${winnerDisplayName} 🎉`
                : "No winner (no votes or no candidates)."}
            </p>
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
