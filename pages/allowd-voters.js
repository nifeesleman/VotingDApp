import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

//------INTERNAL IMPORT
import Style from "../styles/allowedVoters.module.css";
import { VoterContext } from "../context/Voter";
import { Button } from "../components/Button/Button";
import { Input } from "../components/Input/Input";
export const allowdVoters = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });
  const router = useRouter();
  const { uploadToIPFS } = useContext(VoterContext);

  //-------VOTERS IMAGE DROP

  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToIPFS(acceptedFile[0]);
    setFileUrl(url);
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  //------- JSX PART

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragragh}>
              <p>
                Name: <span>&nbps;{formInput.name}</span>{" "}
              </p>
              <p>
                Addr: <span>&nbps;{formInput.address.slice(0, 20)}</span>{" "}
              </p>
              <p>
                Pos: <span>&nbps;{formInput.position}</span>{" "}
              </p>
            </div>
          </div>
        )}
        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create candidate For Voting</h4>
              <p>
                Blockchain-based voting ensures transparency, security, and
                immutability, making it a reliable choice for modern elections.
              </p>
              <p className={Style.sideInfo_para}>
                {" "}
                Register candidates in a decentralized voting system powered by
                blockchain, where transparency, security, and trust are built
                into every vote.{" "}
              </p>
            </div>
            <div className={Style.car}>
              {/* {voterArray.map((el, i) => (
                <div key={i + 1} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src="" alt="Profile photo" />
                  </div>
                  <div className={Style.card_info}>
                    <p>Name</p>
                    <p>Address</p>
                    <p>Details</p>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default allowdVoters;
