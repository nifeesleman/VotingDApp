import React, { useState, useCallback, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

//------INTERNAL IMPORT
import Style from "../styles/candidateRegistration.module.css";
import images from "../assets";
import { VoterContext } from "../context/Voter";
import { Button } from "../components/Button/Button";
import { Input } from "../components/Input/Input";

const CandidateRegistration = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
    age: "",
  });
  const router = useRouter();
  const { uploadToIPFSCandidate, setCandidate, voterArray, getNewCandidate } =
    useContext(VoterContext);

  //-------CANDIDATE IMAGE DROP

  const onDrop = useCallback(
    async (acceptedFile) => {
      const url = await uploadToIPFSCandidate(acceptedFile[0]);
      setFileUrl(url);
    },
    [uploadToIPFSCandidate]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });
  useEffect(() => {
    getNewCandidate();
    console.log("VOTER ARRAY", voterArray);
  }, []);

  //------- JSX PART

  return (
    <div className={Style.createVoter}>
      <div>
        {/* Candidate Info */}
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Candidate Image" />
            <div className={Style.voterInfo_paragragh}>
              <p>
                Name: <span> &nbsp;{candidateForm.name}</span>
              </p>
              <p>
                Addr: &nbsp;
                <span>
                  {candidateForm.address
                    ? `${candidateForm.address.slice(0, 20)}${
                        candidateForm.address.length > 20 ? "..." : ""
                      }`
                    : ""}
                </span>
              </p>
              <p>
                Age: &nbsp;<span>{candidateForm.age}</span>
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
              <p className={Style.sideInfo_para}>Candidates List</p>
            </div>
            <div className={Style.card}>
              {voterArray.map((el, i) => (
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
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create New Candidate */}
      <div className={Style.voter}>
        <div className={Style.voter__container}>
          <h1>Create New Candidate</h1>
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
                setCandidateForm({ ...candidateForm, name: e.target.value })
              }
            />
            <Input
              inputType="text"
              title="Address"
              placeholder="Candidate Address"
              handleChange={(e) =>
                setCandidateForm({ ...candidateForm, address: e.target.value })
              }
            />
            <Input
              inputType="text"
              title="Age"
              placeholder="Candidate Age"
              handleChange={(e) =>
                setCandidateForm({ ...candidateForm, age: e.target.value })
              }
            />

            <div className={Style.Button}>
              <Button
                btnName="Authorized Candidate"
                handleClick={() => setCandidate(candidateForm, fileUrl, router)}
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
            Only organizer of the voting contract can register candidates for
            the voting election
          </p>
        </div>
      </div>
    </div>
  );
};
export default CandidateRegistration;
