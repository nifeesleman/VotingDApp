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
  const [refreshing, setRefreshing] = useState(false);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });
  const router = useRouter();
  const {
    uploadToIPFS,
    createVoter,
    getAllVoterData,
    voterArray,
    voterFetchFailed,
  } = useContext(VoterContext);

  const handleRefreshVoters = useCallback(async () => {
    setRefreshing(true);
    try {
      await getAllVoterData();
    } finally {
      setRefreshing(false);
    }
  }, [getAllVoterData]);

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
              <p className={Style.sideInfo_para}>Allowed Voters List</p>
            </div>
            <div className={Style.card}>
              {voterArray?.length > 0 ? (
                voterArray
                  .filter((el) => el != null)
                  .map((el, i) => {
                    const name = (el.name ?? "").toString();
                    const voterId = (el.voterId ?? "").toString();
                    let imageUrl = (el.image ?? "").toString();
                    if (
                      !imageUrl ||
                      imageUrl.startsWith("data:application/json") ||
                      imageUrl.includes("metadata.json") ||
                      imageUrl.endsWith(".json")
                    ) {
                      imageUrl = "";
                    }
                    const addr =
                      typeof el.voterAddress === "string"
                        ? el.voterAddress
                        : (el.address ?? el.voterAddress ?? "").toString();
                    const displayAddr =
                      addr.length > 14
                        ? `${addr.slice(0, 8)}...${addr.slice(-6)}`
                        : addr;
                    const allowed = el.allowed != null ? String(el.allowed) : "";
                    const voted = el.voted === true ? "Voted" : "Not voted";
                    return (
                      <div
                        key={addr ? `${addr}-${i}` : `voter-${i}`}
                        className={Style.card_box}
                      >
                        <div className={Style.image}>
                          <img
                            src={imageUrl || "/file.svg"}
                            alt={name ? `${name} profile` : "Voter"}
                            onError={(e) => {
                              const img = e.currentTarget;
                              if (img && img.src !== "/file.svg")
                                img.src = "/file.svg";
                            }}
                          />
                        </div>
                        <div className={Style.card_info}>
                          <p>{name ? `${name} #${voterId}` : `#${voterId}`}</p>
                          <p>{displayAddr ? `Address: ${displayAddr}` : ""}</p>
                          <p>{allowed ? `Allowed: ${allowed}` : ""}</p>
                          <p>{voted}</p>
                        </div>
                      </div>
                    );
                  })
              ) : voterFetchFailed ? (
                <div className={Style.card_info}>
                  <p className={Style.sideInfo_para}>
                    Could not load voters. Update <code>VotingAddress</code> in{" "}
                    <code>context/constants.js</code> to your deployed contract
                    address.
                  </p>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    In a terminal:{" "}
                    <code>npx hardhat run scripts/deploy.js --network localhost</code>{" "}
                    then copy the printed address into constants.js.
                  </p>
                  <Button
                    btnName={refreshing ? "Refreshing…" : "Refresh list"}
                    handleClick={handleRefreshVoters}
                  />
                </div>
              ) : (
                <div style={{ marginTop: "0.5rem" }}>
                  <p className={Style.sideInfo_para}>
                    No voters authorized yet.
                  </p>
                  <Button
                    btnName={refreshing ? "Refreshing…" : "Refresh list"}
                    handleClick={handleRefreshVoters}
                  />
                </div>
              )}
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
                handleClick={() => createVoter(formInput, fileUrl, router)}
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
