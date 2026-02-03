import React from "react";
import Style from "./VoterCard.module.css";

export default function VoterCard({ voterArray }) {
  if (!voterArray?.length) {
    return (
      <div className={Style.cardWrap}>
        <p className={Style.empty}>No voters registered yet.</p>
      </div>
    );
  }

  return (
    <div className={Style.cardWrap}>
      <div className={Style.totalVotersWrap}>
        <span className={Style.totalVotersLabel}>Total voters</span>
        <span className={Style.totalVotersCount}>{voterArray.length}</span>
      </div>
      <div className={Style.grid}>
        {voterArray
          .filter((v) => v != null)
          .map((v, i) => {
            const name = (v.name ?? "").toString();
            const voterId = v.voterId != null ? String(v.voterId) : "";
            const imageUrl = (v.image ?? "").toString();
            const addr = v.voterAddress ?? v.address ?? "";
            const displayAddr =
              addr && addr.length > 14
                ? `${addr.slice(0, 8)}...${addr.slice(-6)}`
                : addr;
            const allowed = v.allowed !== undefined && v.allowed !== "0";
            const voted = !!v.voted;

            return (
              <div
                key={addr ? `${addr}-${i}` : `voter-${i}`}
                className={Style.card}
              >
                <div className={Style.image}>
                  <img
                    src={imageUrl || "/file.svg"}
                    alt={name ? `${name} profile` : "Voter"}
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img && img.src !== "/file.svg") img.src = "/file.svg";
                    }}
                  />
                </div>
                <div className={Style.info}>
                  <div className={Style.cardHeader}>
                    <h3 className={Style.voterName}>{name || "Voter"}</h3>
                    <span className={Style.voterId}>#{voterId}</span>
                  </div>
                  {displayAddr && (
                    <div className={Style.infoRow}>
                      <span className={Style.infoLabel}>Address</span>
                      <span className={Style.infoValue} title={addr}>{displayAddr}</span>
                    </div>
                  )}
                  <div className={Style.infoRow}>
                    <span className={Style.infoLabel}>Allowed</span>
                    <span className={allowed ? Style.badgeYes : Style.badgeNo}>{allowed ? "Yes" : "No"}</span>
                  </div>
                  <div className={Style.infoRow}>
                    <span className={Style.infoLabel}>Status</span>
                    <span className={voted ? Style.badgeVoted : Style.badgeNotVoted}>{voted ? "Voted" : "Not voted"}</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
