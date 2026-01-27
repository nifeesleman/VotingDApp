import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

//------INTERNAL IMPORT
import Style from "../styles/allowedVoters.module.css";
import images from "../assets";
import { VoterContext } from "../context/Voter";
import { Button } from "../components/Button/Button";
import { Input } from "../components/Input/Input";
const allowedVoters = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });
  const router = useRouter();
  const { uploadToIPFS, createVoter } = useContext(VoterContext);

  //-------VOTERS IMAGE DROP

  const onDrop = useCallback(
    async (acceptedFile) => {
      const url = await uploadToIPFS(acceptedFile[0]);
      setFileUrl(url);
    },
    [uploadToIPFS]
  );



  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  //------- JSX PART

  return (
    <div className={Style.createVoter}>
      <div>
        {/* Voter Info and Accept User Info */}
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragragh}>
              <p>
                Name: <span> &nbsp;{formInput.name}</span>
              </p>
              <p>
                Addr: &nbsp;<span>{formInput.address.slice(0, 20)}...</span>
              </p>
              <p>
                Pos: &nbsp;<span>{formInput.position}</span>
              </p>
            </div>
          </div>
        )}
        {/* Side info */}
        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create candidate For Voting</h4>
              <br />
              <p>
                Blockchain-based voting ensures transparency, security, and
                immutability, making it a reliable choice for modern elections.
              </p>
              <br />
              <p className={Style.sideInfo_para}> candidates List </p>
            </div>
            <div className={Style.card}>
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

      {/* Create New Voter Detail */}
      <div className={Style.voter}>
        <div className={Style.voter__container}>
          <h1>Create New Voter</h1>
          <div className={Style.voter__container__box}>
            <div className={Style.voter__container__box__div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={Style.voter__container__box__div__info}>
                  <p>Upload File: JPG,PNG,GIF,WEBM Max 10MB</p>
                  <div
                    className={Style.voter__container__box__div__info__image}
                  >
                    <Image
                      src={images.upload}
                      alt="File upload"
                      width={150}
                      height={150}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <p>Drag & Drop File</p>
                  <p>or Browse media on your device</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* Inpute event */}
          <div className={Style.input__container}>
            <Input
              inputType="text"
              title="Name"
              placeholder="Enter Name"
              handleChange={(e) =>
                setFormInput({ ...formInput, name: e.target.value })
              }
            />
            <Input
              inputType="text"
              title="Address"
              placeholder="Voter Addresss"
              handleChange={(e) =>
                setFormInput({ ...formInput, address: e.target.value })
              }
            />
            <Input
              inputType="text"
              title="Position"
              placeholder="Voter Position"
              handleChange={(e) =>
                setFormInput({ ...formInput, position: e.target.value })
              }
            />

            <div className={Style.Button}>
              <Button
                btnName="Authorized Voter"
                handleClick={() => createVoter(formInput, fileUrl,router)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* //////////////////////////// */}
      <div className={Style.createdVoter}>
        <div className={Style.createdVoter__info}>
          <Image src={images.creator} alt="user Profile" />
          <p>Notice for User</p>
          <br />
          <p>
            Organizer <span>ox985884...</span>
          </p>
          <br />
          <p>
            Only organizer of the voting contract can create voting candidate
            for voting election
          </p>
        </div>
      </div>
    </div>
  );
};
export default allowedVoters;
