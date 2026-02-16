# VotingDApp - Decentralized Voting System

A full-stack decentralized voting application built on Ethereum blockchain, enabling transparent, secure, and immutable voting processes with a modern Next.js frontend.

## 📋 Overview

VotingDApp is a Web3-based voting platform that leverages blockchain technology to create a trustless and transparent voting system. The application allows an election organizer to manage the entire voting lifecycle while ensuring that all votes are recorded immutably on the Ethereum blockchain.

### Key Features

✅ **Smart Contract Powered** - All voting logic runs on Ethereum blockchain  
✅ **Organizer Controls** - Only the contract deployer can register candidates and grant voting rights  
✅ **One Vote Per Voter** - Smart contract enforces one vote per authorized address  
✅ **Real-time Results** - Vote counts are updated instantly on-chain  
✅ **Timed Elections** - Set voting period with automatic winner declaration  
✅ **IPFS Integration** - Store candidate and voter metadata on decentralized storage  
✅ **MetaMask Integration** - Seamless wallet connection for users  
✅ **Responsive UI** - Built with Next.js and React for optimal user experience

### How It Works

1. **Organizer Setup**: The contract deployer acts as the voting organizer
2. **Candidate Registration**: Organizer registers candidates with their details
3. **Voter Authorization**: Organizer grants voting rights to eligible addresses
4. **Voting Period**: Set a time limit for the election (optional)
5. **Voting**: Authorized voters cast their votes on-chain
6. **Winner Declaration**: After voting ends, the winner is automatically determined

## Technology Stack

**Frontend:**

- [Next.js](https://nextjs.org/) (v16) - React framework with pages router
- [React](https://reactjs.org/) (v19) - UI library
- [CSS Modules](https://github.com/css-modules/css-modules) - Component-scoped styling
- [Web3Modal](https://web3modal.com/) - Wallet connection
- [ethers.js](https://docs.ethers.org/) (v6) - Ethereum library
- [React Countdown](https://www.npmjs.com/package/react-countdown) - Timer component
- [React Dropzone](https://react-dropzone.js.org/) - File upload handling
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

**Smart Contracts:**

- [Solidity](https://soliditylang.org/) (v0.8.28) - Smart contract language
- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/) - Secure contract components

**Storage:**

- [Pinata](https://pinata.cloud/) / [IPFS](https://ipfs.io/) - Decentralized file storage for voter/candidate metadata

## Screenshots

### Home Page - Voting Interface
![Home Page](assets/screenshots/home.png)
*View candidates and cast your vote*

### Candidate Registration
![Candidate Registration](assets/screenshots/candidate-registration.png)
*Organizer can register new candidates*

### Voter Registration
![Voter Registration](assets/screenshots/voter-registration.png)
*Organizer can authorize voters*

> **Note:** Screenshots will be added as the UI is finalized.

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

### Development Setup

#### 1. Start Local Blockchain

Open a terminal and start the Hardhat local node:

```bash
npx hardhat node
```

Keep this terminal running. This creates a local Ethereum network at `http://127.0.0.1:8545`.

#### 2. Deploy the Smart Contract

In a **new terminal**, deploy the contract to your local network:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Important:** Copy the deployed contract address from the output.

#### 3. Update Contract Address

Edit `context/constants.js` and update the contract address:

```javascript
export const VotingAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
```

Run the following command to sync the ABI automatically:

```bash
npm run sync-abi
```

#### 4. Configure MetaMask

- Open MetaMask
- Add the local network:
  - Network Name: `Localhost 8545`
  - RPC URL: `http://127.0.0.1:8545`
  - Chain ID: `1337`
  - Currency Symbol: `ETH`
- Import one of the test accounts from Hardhat (use the private key shown in the Hardhat node terminal)

#### 5. Start the Frontend

In another terminal, start the Next.js development server:

```bash
npm run dev
```

The application will be available at **[http://localhost:3000](http://localhost:3000)**.

### Production Build

To create an optimized production build:

```bash
npm run build
npm start
```

## Smart Contract

The `Create` contract ([VotingContract.sol](contracts/VotingContract.sol)) manages the voting system with the following capabilities:

### Contract Features

- **Organizer-only access:** Only the contract deployer (VotingOrganizer) can register candidates and grant voting rights
- **Candidate management:** Register candidates with name, age, image, and IPFS metadata
- **Voter management:** Grant voting rights to wallet addresses
- **Voting period:** Optional time-bound elections with start/end times
- **Automatic winner:** Winner is automatically determined when voting ends
- **Vote counting:** Each voter can vote once; votes are counted automatically
- **Immutable records:** All data is stored permanently on the blockchain

### Main Functions

| Function               | Access            | Description                                  |
| ---------------------- | ----------------- | -------------------------------------------- |
| `setCandidate()`       | Organizer only    | Register a new candidate                     |
| `voterRight()`         | Organizer only    | Grant voting rights to an address            |
| `setVotingEndTime()`   | Organizer only    | Set the voting period end time               |
| `vote()`               | Authorized voters | Cast a vote for a candidate                  |
| `declareWinner()`      | Public            | Declare winner after voting period ends      |
| `getWinnerData()`      | Public            | Get winner details (address, name, votes)    |
| `getCandidate()`       | Public            | Get all candidate addresses                  |
| `getVoterList()`       | Public            | Get all voter addresses                      |
| `getcandidatedata()`   | Public            | Get candidate details by address             |
| `getVoterdata()`       | Public            | Get voter details by address                 |
| `getVotedVoterList()`  | Public            | Get addresses of voters who have voted       |

## Project Structure

```
VotingDApp/
├── components/              # Reusable React components
│   ├── Button/             # Custom button component
│   ├── Card/               # Candidate card display
│   ├── ConnectGate/        # Wallet connection guard
│   ├── Input/              # Form input components
│   ├── NavBar/             # Navigation bar
│   └── VoterCard/          # Voter information card
├── context/
│   ├── constants.js        # Contract address and ABI import
│   ├── Create.json         # Contract artifact (ABI)
│   └── Voter.js            # React context with Web3 logic
├── contracts/
│   └── VotingContract.sol  # Solidity smart contract (Create contract)
├── pages/
│   ├── api/
│   │   └── pinata.js       # API route for Pinata uploads
│   ├── _app.js             # App wrapper with VotingProvider
│   ├── index.js            # Home page - voting interface
│   ├── allowed-voters.js   # Voter registration page (organizer only)
│   ├── candidate-registration.js  # Candidate registration (organizer only)
│   └── voterList.js        # Display list of registered voters
├── public/                 # Static assets (favicon, etc.)
├── scripts/
│   └── deploy.js           # Contract deployment script
├── styles/                 # CSS modules for styling
├── assets/                 # Images and static assets
├── hardhat.config.js       # Hardhat configuration
├── next.config.mjs         # Next.js configuration
├── package.json            # Dependencies and scripts
└── .env.local              # Environment variables (not committed)
```

### Key Files Explained

- **`context/Voter.js`**: Central Web3 context providing contract interaction functions
- **`context/constants.js`**: Exports the deployed contract address and ABI
- **`contracts/VotingContract.sol`**: The main smart contract handling all voting logic
- **`pages/index.js`**: Main voting interface where users can view candidates and vote
- **`pages/allowed-voters.js`**: Page for organizer to grant voting rights
- **`pages/candidate-registration.js`**: Page for organizer to register candidates
- **`scripts/deploy.js`**: Automated deployment script for the smart contract

## Testing

Run smart contract tests (when available):

```bash
npx hardhat test
```

Check test coverage:

```bash
npx hardhat coverage
```

Run a specific test file:

```bash
npx hardhat test test/YourTest.js
```

## Troubleshooting

### Common Issues

#### 1. Contract Address Not Set

**Error:** `VotingAddress is undefined`

**Solution:**
- Deploy the contract using `npx hardhat run scripts/deploy.js --network localhost`
- Copy the deployed address
- Update `context/constants.js` with the address

#### 2. ABI Mismatch

**Error:** Contract interaction fails or functions not found

**Solution:**
```bash
npm run sync-abi
```

This syncs the ABI from compiled artifacts to the context folder.

#### 3. MetaMask Network Mismatch

**Error:** Wrong network or transactions fail

**Solution:**
- Ensure MetaMask is connected to the same network as your deployed contract
- For local development: Network should be `Localhost 8545` with Chain ID `1337`
- For Sepolia: Chain ID should be `11155111`

#### 4. Transaction Errors

**Error:** "Only organizer can..." or "You do not have voting rights"

**Solution:**
- Organizer functions: Ensure you're using the account that deployed the contract
- Voter functions: Ensure the organizer has granted voting rights to your address

#### 5. Pinata Upload Fails

**Error:** Image upload fails

**Solution:**
- Check your Pinata API keys in `.env.local`
- Ensure the keys are valid and have not expired
- Check your Pinata account storage limits

#### 6. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 npm run dev
```

### Reset Local Environment

If you need to start fresh:

```bash
# Stop all running processes (Hardhat node, Next.js)
# Then:
rm -rf artifacts cache
rm -rf .next
npx hardhat clean
npm run build
```

## Security Considerations

### Smart Contract Security

✅ **Access Control:** Only the organizer (contract deployer) can register candidates and grant voting rights  
✅ **Vote Integrity:** Each voter can only vote once, enforced by smart contract logic  
✅ **Immutable Results:** Once cast, votes cannot be modified or deleted  
✅ **OpenZeppelin:** Uses audited OpenZeppelin contracts for counters

### Best Practices

⚠️ **Private Keys:** Never share or commit private keys. Use `.env.local` and add it to `.gitignore`  
⚠️ **Smart Contract Audits:** Before deploying to mainnet, consider professional security audits  
⚠️ **Test Thoroughly:** Test all functionality on testnets before mainnet deployment  
⚠️ **Gas Optimization:** Be aware of gas costs, especially when deploying to mainnet  
⚠️ **Pinata Security:** Keep your Pinata API keys secure and rotate them periodically

### Known Limitations

- The organizer has full control over the voting process
- No vote anonymity - all votes are public on the blockchain
- Gas fees required for all transactions
- No built-in dispute resolution mechanism
- No vote delegation or proxy voting

## Development Workflow

### Making Changes to Smart Contracts

1. Edit `contracts/VotingContract.sol`
2. Compile: `npx hardhat compile`
3. Test your changes (write tests first!)
4. Deploy to local network: `npx hardhat run scripts/deploy.js --network localhost`
5. Update contract address in `context/constants.js`
6. Sync ABI: `npm run sync-abi`
7. Test the frontend with the new contract

### Code Formatting

Format your code using Prettier:

```bash
npm run format
```

Check formatting without making changes:

```bash
npm run format:check
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_PINATA_POST_URL=https://api.pinata.cloud/pinning/pinFileToIPFS
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRECT_KEY=your_pinata_secret_key
NEXT_PUBLIC_PINATA_HASH_URL=https://gateway.pinata.cloud/ipfs/
```

**Getting Pinata API Keys:**

1. Create a free account at [Pinata.cloud](https://pinata.cloud/)
2. Navigate to API Keys section
3. Generate a new API key
4. Copy the API Key and API Secret
5. Paste them into your `.env.local` file

> **Note:** The variable name `NEXT_PUBLIC_PINATA_SECRECT_KEY` has a typo ("SECRECT" instead of "SECRET") but is used as-is in the codebase.

### Contract Address

After deploying the contract, update the address in `context/constants.js`:

```javascript
export const VotingAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

The ABI is automatically imported from `Create.json`. After redeploying, run:

```bash
npm run sync-abi
```

This command copies the latest ABI from `artifacts/contracts/VotingContract.sol/Create.json` to `context/Create.json`.

### Network Configuration

#### Local Development

The default configuration in `hardhat.config.js` is:

```javascript
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
  },
};
```

#### Deploying to Testnet (Sepolia)

1. Update `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
};
```

2. Add to `.env.local`:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_wallet_private_key_here
```

3. Deploy:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**⚠️ Security Warning:** Never commit your `.env.local` file or share your private keys!

## Usage

### Step-by-Step Walkthrough

#### 1. Connect Your Wallet

- Open the application in your browser
- Click the "Connect Wallet" button
- Approve the MetaMask connection request
- Ensure you're on the correct network (localhost for development)

#### 2. Organizer Actions (Deployer Account Only)

The account that deployed the contract has special privileges:

**a. Set Voting Period (Optional)**
- Navigate to the appropriate page
- Set the end time for the voting period
- This ensures voting automatically closes at the specified time

**b. Register Candidates**
- Go to "Candidate Registration" page
- Fill in candidate details:
  - Name
  - Age
  - Upload candidate image
  - Wallet address
- Submit to register the candidate on-chain

**c. Grant Voting Rights**
- Navigate to "Allowed Voters" page
- Enter voter details:
  - Voter name
  - Wallet address
  - Upload voter image (optional)
- Submit to authorize the voter

#### 3. Voter Actions

Once granted voting rights, voters can:

**a. View Candidates**
- Browse all registered candidates on the home page
- See candidate details and current vote counts

**b. Cast Your Vote**
- Select your preferred candidate
- Click "Vote" button
- Confirm the transaction in MetaMask
- Vote is recorded on-chain immediately

**c. View Results**
- Real-time vote counts are displayed for each candidate
- After the voting period ends, the winner is announced

### Important Notes

- Each voter can only vote **once**
- Only the organizer can register candidates and authorize voters
- All actions require MetaMask transaction approval
- Votes cannot be changed or revoked once cast
- All data is permanently stored on the blockchain

## Contributing

Contributions are welcome! Here's how you can help:

### Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/VotingDApp.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests and linting: `npm run format:check`
6. Commit your changes: `git commit -m "Add: your feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Ideas for Contributions

- Add comprehensive test suite
- Improve UI/UX design
- Add support for multiple elections
- Implement vote delegation
- Add email/notification system
- Improve security features
- Add multi-language support

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions:

- Open an issue on [GitHub Issues](https://github.com/nifeesleman/VotingDApp/issues)
- Check the [Troubleshooting](#troubleshooting) section above

## Acknowledgments

- Built with [Hardhat](https://hardhat.org/)
- Uses [OpenZeppelin](https://openzeppelin.com/) contracts
- Powered by [Next.js](https://nextjs.org/)
- IPFS storage via [Pinata](https://pinata.cloud/)

---

**⚠️ Disclaimer:** This is a demonstration project. Always conduct thorough security audits before deploying to mainnet with real assets.
