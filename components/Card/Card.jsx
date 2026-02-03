import React from "react";
import Style from "./Card.module.css";
import { Button } from "../Button/Button";

export default function Card({ candidateArray, giveVote }) {
  if (!candidateArray?.length) {
    return (
      <div className={Style.cardWrap}>
        <p className={Style.empty}>No candidates to vote for yet.</p>
      </div>
    );
  }

  return (
    <div className={Style.cardWrap}>
      <div className={Style.grid}>
        {candidateArray
          .filter((el) => el != null)
          .map((el, i) => {
            const name = (el[1] ?? el.name ?? "").toString();
            const rawId = el[2] ?? el.candidateId;
            const candidateId =
              typeof rawId === "bigint"
                ? Number(rawId)
                : rawId != null
                  ? String(rawId)
                  : "";
            const imageUrl = (el[3] ?? el.image ?? "").toString();
            const age = (el[0] ?? el.age ?? "").toString();
            const rawAddr = el[6] ?? el._address ?? el.address;
            const addr =
              typeof rawAddr === "string"
                ? rawAddr
                : rawAddr != null
                  ? String(rawAddr)
                  : "";
            const displayAddr =
              addr.length > 14
                ? `${addr.slice(0, 8)}...${addr.slice(-6)}`
                : addr;
            return (
              <div key={addr ? `${addr}-${i}` : `candidate-${i}`} className={Style.card}>
                <div className={Style.image}>
                  <img
                    src={imageUrl || "/file.svg"}
                    alt={name ? `${name} profile` : "Candidate"}
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img && img.src !== "/file.svg") img.src = "/file.svg";
                    }}
                  />
                </div>
                <div className={Style.info}>
                  <p>{name ? `${name} #${candidateId}` : `#${candidateId}`}</p>
                  <p>{age ? `Age: ${age}` : ""}</p>
                  <p>{displayAddr ? `Address: ${displayAddr}` : ""}</p>
                  {giveVote && (
                    <Button
                      btnName="Vote"
                      handleClick={() => giveVote(addr, candidateId)}
                    />
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
