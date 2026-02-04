import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import Image from "next/image";
import Countdown from "react-countdown";

//----------INTERNAL IMPORTS
import { VoterContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/Card/Card";

const CONFETTI_COLORS = ["#9a02ac", "#ff6b9d", "#ffd93d", "#6bcb77", "#4d96ff", "#ff922b", "#e056fd"];
const CONFETTI_COUNT = 55;

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
  const countdownDoneRef = useRef(false);
  const winnerDisplayName = winnerName?.trim() || "";
  const hasWinner = winnerDeclared && winnerDisplayName.length > 0;

  const confettiPieces = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2.5 + Math.random() * 1.5,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 6,
      round: Math.random() > 0.5,
    }));
  }, []);

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
  const canDeclareWinner = votingEndTime > 0 && Date.now() / 1000 >= votingEndTime && !winnerDeclared;

  const handleCountdownComplete = () => {
    if (countdownDoneRef.current || winnerDeclared) return;
    if (votingEndTime <= 0) return;
    countdownDoneRef.current = true;
    if (declareWinner) declareWinner();
  };

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
              <Countdown date={countdownDate} onComplete={handleCountdownComplete} />
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
          <div className={Style.confettiWrap} aria-hidden="true">
            {confettiPieces.map((p) => (
              <span
                key={p.id}
                className={Style.confetti}
                style={{
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                  backgroundColor: p.color,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  borderRadius: p.round ? "50%" : "0",
                }}
              />
            ))}
          </div>
          <div className={Style.winnerModal} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={Style.winnerModalClose} onClick={() => setShowWinnerModal(false)} aria-label="Close">×</button>
            {hasWinner && <span className={Style.winnerModalEmoji} aria-hidden="true">🏆</span>}
            <h2 className={Style.winnerModalTitle}>
              {hasWinner ? "Congratulations!" : "Voting ended"}
            </h2>
            <p className={Style.winnerModalMessage}>
              {hasWinner
                ? <>The winner is: <strong className={Style.winnerName}>{winnerDisplayName}</strong> 🎉</>
                : "No winner (no votes or no candidates)."}
            </p>
            {hasWinner && <p className={Style.winnerModalSub}>Thank you for voting!</p>}
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
