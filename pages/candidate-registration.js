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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
    age: "",
  });
  const router = useRouter();
  const {
    uploadToIPFSCandidate,
    setCandidate,
    getNewCandidate,
    candidateArray,
    candidateFetchFailed,
  } = useContext(VoterContext);
  const [refreshing, setRefreshing] = useState(false);

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
  const handleRefreshCandidates = useCallback(async () => {
    setRefreshing(true);
    try {
      await getNewCandidate();
    } finally {
      setRefreshing(false);
    }
  }, [getNewCandidate]);

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
              {candidateArray?.length > 0 ? (
                candidateArray
                  .filter((el) => el != null)
                  .map((el, i) => {
                    // getcandidatedata returns: age(0), name(1), candidateId(2), image(3), voteCount(4), ipfs(5), address(6)
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
                      <div
                        key={addr ? `${addr}-${i}` : `candidate-${i}`}
                        className={Style.card_box}
                      >
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
                        <div className={Style.card_info}>
                          <p>{name ? `${name} #${candidateId}` : `#${candidateId}`}</p>
                          <p>{age ? `Age: ${age}` : ""}</p>
                          <p>{displayAddr ? `Address: ${displayAddr}` : ""}</p>
                        </div>
                      </div>
                    );
                  })
              ) : candidateFetchFailed ? (
                <div className={Style.card_info}>
                  <p className={Style.sideInfo_para}>
                    Could not load candidates. Update <code>VotingAddress</code> in{" "}
                    <code>context/constants.js</code> to your deployed contract address.
                  </p>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    In a terminal: <code>npx hardhat run scripts/deploy.js --network localhost</code>{" "}
                    then copy the printed address into constants.js.
                  </p>
                  <Button
                    btnName={refreshing ? "Refreshing…" : "Refresh list"}
                    handleClick={handleRefreshCandidates}
                  />
                </div>
              ) : (
                <div style={{ marginTop: "0.5rem" }}>
                  <p className={Style.sideInfo_para}>No candidates registered yet.</p>
                  <Button
                    btnName={refreshing ? "Refreshing…" : "Refresh list"}
                    handleClick={handleRefreshCandidates}
                  />
                </div>
              )}
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
                btnName={isSubmitting ? "Registering…" : "Register Candidate"}
                handleClick={async () => {
                  if (isSubmitting) return;
                  setIsSubmitting(true);
                  try {
                    await setCandidate(candidateForm, fileUrl, router, () => {
                      setCandidateForm({ name: "", address: "", age: "" });
                      setFileUrl(null);
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
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
          <br />
          <p style={{ fontSize: "0.85rem", opacity: 0.9 }}>
            <strong>Nonce error?</strong> If transactions fail (e.g. &quot;nonce too low&quot; or &quot;replacement fee too low&quot;), reset MetaMask for this network: MetaMask → Settings → Advanced → Reset account.
          </p>
        </div>
      </div>
    </div>
  );
};
export default CandidateRegistration;
