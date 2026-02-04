# VotingDApp - Decentralized Voting System

A decentralized voting application built on Ethereum blockchain, enabling transparent, secure, and immutable voting processes.

## Overview

VotingDApp is a Web3 voting application that allows an organizer to:
[VotingContract.sol](contracts/VotingContract.sol)
- Register candidates for elections
- Grant voting rights to eligible voters
- Enable voters to cast votes securely on the blockchain

All voting data is stored on the Ethereum blockchain, ensuring transparency and immutability.

## Technology Stack

**Frontend:**

- [Next.js](https://nextjs.org/) (v16) - React framework with pages router
- [React](https://reactjs.org/) (v19) - UI library
- [CSS Modules](https://github.com/css-modules/css-modules) - Component-scoped styling
- [Web3Modal](https://web3modal.com/) - Wallet connection
- [ethers.js](https://docs.ethers.org/) (v6) - Ethereum library

**Smart Contracts:**

- [Solidity](https://soliditylang.org/) (v0.8.28) - Smart contract language
- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/) - Secure contract components

**Storage:**

- [Pinata](https://pinata.cloud/) / [IPFS](https://ipfs.io/) - Decentralized file storage for voter/candidate metadata

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MetaMask](https://metamask.io/) browser extension
- [Pinata](https://pinata.cloud/) account (for IPFS uploads)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nifeesleman/VotingDApp.git
   cd VotingDApp
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   NEXT_PUBLIC_PINATA_POST_URL=https://api.pinata.cloud/pinning/pinFileToIPFS
   NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
   NEXT_PUBLIC_PINATA_SECRECT_KEY=your_pinata_secret_key
   NEXT_PUBLIC_PINATA_HASH_URL=https://gateway.pinata.cloud/ipfs/
   ```

   > **Note:** The variable name `NEXT_PUBLIC_PINATA_SECRECT_KEY` uses the spelling as defined in the codebase.

## Running the Application

### Start Local Blockchain

1. **Start Hardhat local node:**

   ```bash
   npx hardhat node
   ```

2. **Deploy the smart contract** (in a new terminal):

   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

   Note the deployed contract address and update `context/constants.js` if needed.

### Start the Frontend

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Smart Contract

The `Create` contract (`contracts/VotingContract.sol`) manages the voting system:

### Key Features

- **Organizer-only access:** Only the contract deployer (VotingOrganizer) can register candidates and grant voting rights
- **Candidate management:** Register candidates with name, age, image, and IPFS metadata
- **Voter management:** Grant voting rights to wallet addresses
- **Voting:** Each voter can vote once for a candidate; votes are counted automatically

### Main Functions

| Function             | Access            | Description                       |
| -------------------- | ----------------- | --------------------------------- |
| `setCandidate()`     | Organizer only    | Register a new candidate          |
| `voterRight()`       | Organizer only    | Grant voting rights to an address |
| `vote()`             | Authorized voters | Cast a vote for a candidate       |
| `getCandidate()`     | Public            | Get all candidate addresses       |
| `getVoterList()`     | Public            | Get all voter addresses           |
| `getcandidatedata()` | Public            | Get candidate details by address  |
| `getVoterdata()`     | Public            | Get voter details by address      |

## Project Structure

```
VotingDApp/
├── components/          # Reusable React components
│   ├── Button/
│   ├── Card/
│   ├── Input/
│   ├── NavBar/
│   └── VoterCard/
├── context/
│   ├── constants.js     # Contract address and ABI
│   ├── Create.json      # Contract artifact (ABI)
│   └── Voter.js         # React context with Web3 logic
├── contracts/
│   └── VotingContract.sol  # Solidity smart contract
├── pages/
│   ├── _app.js          # App wrapper with VotingProvider
│   ├── index.js         # Home page
│   ├── allowed-voters.js    # Voter registration page
│   ├── candidate-registration.js  # Candidate registration
│   └── voterList.js     # Voter list page
├── scripts/
│   └── deploy.js        # Contract deployment script
├── styles/              # CSS modules
├── assets/              # Images and static assets
├── hardhat.config.js    # Hardhat configuration
├── next.config.mjs      # Next.js configuration
└── package.json
```

## Testing

Run smart contract tests:

```bash
npx hardhat test
```

## Configuration

### Contract Address

After deploying the contract, update the address in `context/constants.js`:

```javascript
export const VotingAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### Network Configuration

To deploy on other networks, update `hardhat.config.js` with your network settings:

```javascript
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "YOUR_RPC_URL",
      accounts: ["YOUR_PRIVATE_KEY"],
    },
  },
};
```

## Usage

1. **Connect Wallet:** Connect your MetaMask wallet to the application
2. **Organizer Actions** (deployer account only):
   - Navigate to voter registration to grant voting rights
   - Register candidates for the election
3. **Voter Actions:**
   - View registered candidates
   - Cast your vote (if voting rights have been granted)

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
