import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Countdown from "react-countdown";

//----------INTERNAL IMPORTS
import { VoterContext } from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/Card/Card";

export const index = () => {
  const { VotingTittle } = useContext(VoterContext);
  return <div>{VotingTittle}</div>;
};
export default index;
