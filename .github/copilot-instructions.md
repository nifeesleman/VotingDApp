# Copilot Instructions for VotingDApp

## Project Overview
- Stack: Next.js pages router (React 19) front-end with CSS modules; Hardhat + ethers v6 for Solidity 0.8.28; contract artifacts consumed directly in the UI via `context/constants.js`.
- Core contract: `contracts/VotingContract.sol` defines the `Create` contract. The deployer becomes `VotingOrganizer` and is the only account allowed to call `setCandidate` and `voterRight`. Voting increments `voteCount` by `voter_allowed` (defaults to 1 when rights are granted).
- Data flow: `_app.js` wraps pages with `VotingProvider` from `context/Voter.js`. That context holds wallet connection helpers, IPFS upload helpers, and the `createVoter` workflow that writes to the contract.

## Smart Contract Facts
- Candidates: stored in `candidates` mapping keyed by address; IDs auto-increment via `Counters`. `setCandidate(address,_age,_name,_image,_ipfs)` pushes the candidate address into `candidateAddresses` and emits `CandidateCreate`.
- Voters: `voterRight(address,_name,_image,_ipfs)` requires organizer, sets `voter_allowed` to `1`, default `voter_vote` to `1000`, and emits `VoterCreated`. `vote(candidateAddr,candidateId)` checks `!voter_voted` and `voter_allowed != 0` then increments the candidate `voteCount`.
- Retrieval: `getCandidate*`, `getcandidatedata`, `getVoter*`, `getVoterdata`, `getVotedVoterList` expose addresses and structs; no pagination or access control on reads.

## Front-End Patterns
- Contract wiring lives in `context/Voter.js`: uses `ethers.BrowserProvider` + `web3modal` for wallet, `createIpfsClient` (Infura) for uploads, and Pinata REST (env-driven) for metadata. `createVoter` uploads metadata JSON to Pinata, then calls `contract.voterRight(formInput.address, formInput.name, metadataUrl, fileUrl)`.
- Constants: `context/constants.js` hardcodes `VotingAddress` to the default Hardhat local address `0x5FbD…0aa3` and imports ABI from `context/Create.json` (artifact copy).
- UI pages: `pages/allowed-voters.js` is the only fleshed-out screen; it collects voter info, uploads an image via dropzone, then invokes `createVoter`. `pages/index.js`, `candidate-registration.js`, `voterList.js`, and components `Card/NavBar/VoterCard` are placeholders.
- Styling: CSS modules per component/page (e.g., `styles/allowedVoters.module.css`, `components/Button/Button.module.css`). Use module imports rather than global class names.

## Workflows & Commands
- Front-end: `npm run dev` for Next.js, `npm run build` / `npm start` for production build.
- Smart contracts: Hardhat configured in `hardhat.config.js` with toolbox + ethers v6. Deploy via `npx hardhat run scripts/deploy.js --network <network>`; the script uses `waitForDeployment()` and logs the address.
- Testing: no scripts defined beyond toolbox defaults; use `npx hardhat test` (tests folder present but empty).

## Environment & Integrations
- Pinata env vars required: `NEXT_PUBLIC_PINATA_POST_URL`, `NEXT_PUBLIC_PINATA_API_KEY`, `NEXT_PUBLIC_PINATA_SECRECT_KEY` (note spelling), `NEXT_PUBLIC_PINATA_HASH_URL`. Errors bubble into the `error` state in context but are not surfaced UI-side.
- IPFS: `ipfs-http-client` instanced once in context; uploads rely on Pinata REST, not the IPFS client (the client is currently unused).
- Wallet: requires MetaMask; both `checkIfWalletConnected` and `connectWallet` guard against missing `window.ethereum` and set an `error` string on failure.

## Conventions & Gotchas
- Organizer-only mutations: both candidate creation and voter rights must be sent from the deployer (`VotingOrganizer`). Front-end does not enforce this; transactions will revert otherwise.
- Address/route mismatch: `createVoter` redirects to `/votersList`, but the existing page is `/voterList.js`; align before adding flows.
- Contract call shape: `voterRight` expects `(address, name, image, ipfs)`. The UI passes `(address, name, metadataUrl, fileUrl)` where `metadataUrl` is JSON metadata and `fileUrl` is the uploaded image—verify this ordering matches intended semantics.
- State arrays: `candidateAddresses`, `votedVoters`, `voterSAddresses` are append-only; no deduplication or pagination—clients should handle repeats and large lists.
- Dropzone limits: UI allows max 5MB images though the helper text mentions 10MB.

## Extending Safely
- Reuse `fetchContract` in `context/Voter.js` for new reads/writes to keep provider/signing consistent.
- When adding pages/components, wrap in `VotingProvider` (already in `_app.js`) and prefer CSS modules for styling cohesion.
- If deploying beyond localhost, update `context/constants.js` with the network-specific address and ensure ABI stays in sync with the deployed artifact.
