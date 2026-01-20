// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Create - A decentralized voting contract
/// @notice This contract allows an organizer to register candidates and voters, and enables voters to cast votes
/// @dev Implements access control for organizer-only functions
contract Create {
    /// @notice Counter for voter IDs
    uint256 private _voterId;
    /// @notice Counter for candidate IDs
    uint256 private _candidateId;

    /// @notice The address of the voting organizer who has admin privileges
    address public VotingOrganizer;

    /// @notice Structure representing a candidate
    /// @param candidateId Unique identifier for the candidate
    /// @param age Age of the candidate
    /// @param name Name of the candidate
    /// @param image IPFS hash of the candidate's image
    /// @param voteCount Number of votes received
    /// @param _address Wallet address of the candidate
    /// @param ipfs IPFS hash of candidate metadata
    struct Candidate {
        uint256 candidateId;
        string age;
        string name;
        string image;
        uint256 voteCount;
        address _address;
        string ipfs;
    }

    /// @notice Emitted when a new candidate is created
    /// @param candidateId Unique identifier for the candidate
    /// @param age Age of the candidate
    /// @param name Name of the candidate
    /// @param image IPFS hash of candidate's image
    /// @param voteCount Initial vote count
    /// @param _address Wallet address of the candidate
    /// @param ipfs IPFS hash of candidate metadata
    event CandidateCreate(
        uint256 indexed candidateId,
        string age,
        string name,
        string image,
        uint256 voteCount,
        address _address,
        string ipfs
    );

    /// @notice Array of candidate addresses
    address[] public candidateAddresses;
    /// @notice Mapping from address to Candidate struct
    mapping(address => Candidate) public candidates;

    /// @notice Array of addresses that have voted
    address[] public votedVoters;
    /// @notice Array of registered voter addresses
    address[] public votersAddresses;
    /// @notice Mapping from address to Voter struct
    mapping(address => Voter) public voters;

    /// @notice Structure representing a voter
    /// @param voter_voterId Unique identifier for the voter
    /// @param voter_name Name of the voter
    /// @param voter_image IPFS hash of voter's image
    /// @param voter_address Wallet address of the voter
    /// @param voter_allowed Voting allowance (1 if allowed, 0 if not)
    /// @param voter_voted Whether the voter has voted
    /// @param voter_vote The candidate ID voted for
    /// @param voter_ipfs IPFS hash of voter metadata
    struct Voter {
        uint256 voter_voterId;
        string voter_name;
        string voter_image;
        address voter_address;
        uint256 voter_allowed;
        bool voter_voted;
        uint256 voter_vote;
        string voter_ipfs;
    }
    /// @notice Emitted when a new voter is registered
    /// @param voter_voterId Unique identifier for the voter
    /// @param voter_name Name of the voter
    /// @param voter_image IPFS hash of voter's image
    /// @param voter_address Wallet address of the voter
    /// @param voter_allowed Voting allowance
    /// @param voter_voted Whether the voter has voted
    /// @param voter_vote The candidate ID voted for
    /// @param voter_ipfs IPFS hash of voter metadata
    event VoterCreated(
        uint256 indexed voter_voterId,
        string voter_name,
        string voter_image,
        address voter_address,
        uint256 voter_allowed,
        bool voter_voted,
        uint256 voter_vote,
        string voter_ipfs
    );

    /// @notice Contract constructor that sets the deployer as the voting organizer
    constructor() {
        VotingOrganizer = msg.sender;
    }

    /// @notice Registers a new candidate for the election
    /// @dev Only the voting organizer can call this function
    /// @param _address Wallet address of the candidate
    /// @param _age Age of the candidate
    /// @param _name Name of the candidate
    /// @param _image IPFS hash of candidate's image
    /// @param _ipfs IPFS hash of candidate metadata
    function setCandidate(
        address _address,
        string memory _age,
        string memory _name,
        string memory _image,
        string memory _ipfs
    ) public {
        require(VotingOrganizer == msg.sender, "Only organizer can create candidates");
        _candidateId++;

        uint256 idNumber = _candidateId;

        Candidate storage candidate = candidates[_address];
        candidate.age = _age;
        candidate.name = _name;
        candidate.candidateId = idNumber;
        candidate.image = _image;
        candidate.voteCount = 0;
        candidate._address = _address;
        candidate.ipfs = _ipfs;

        candidateAddresses.push(_address);

        emit CandidateCreate(idNumber, _age, _name, _image, candidate.voteCount, _address, _ipfs);
    }

    /// @notice Returns the array of candidate addresses
    /// @return Array of candidate wallet addresses
    function getCandidate() public view returns (address[] memory) {
        return candidateAddresses;
    }

    /// @notice Returns the number of registered candidates
    /// @return Number of candidates
    function getCandidateLength() public view returns (uint256) {
        return candidateAddresses.length;
    }

    /// @notice Returns detailed data for a specific candidate
    /// @param _address Wallet address of the candidate
    /// @return age Age of the candidate
    /// @return name Name of the candidate
    /// @return candidateId Unique identifier
    /// @return image IPFS hash of image
    /// @return voteCount Number of votes received
    /// @return ipfs IPFS metadata hash
    /// @return candidateAddress Wallet address
    function getcandidatedata(address _address)
        public
        view
        returns (string memory, string memory, uint256, string memory, uint256, string memory, address)
    {
        return (
            candidates[_address].age,
            candidates[_address].name,
            candidates[_address].candidateId,
            candidates[_address].image,
            candidates[_address].voteCount,
            candidates[_address].ipfs,
            candidates[_address]._address
        );
    }

    /// @notice Grants voting rights to a voter
    /// @dev Only the voting organizer can call this function
    /// @param _address Wallet address of the voter
    /// @param _name Name of the voter
    /// @param _image IPFS hash of voter's image
    /// @param _ipfs IPFS hash of voter metadata
    function voterRight(address _address, string memory _name, string memory _image, string memory _ipfs) public {
        require(VotingOrganizer == msg.sender, "Only organizer can give voting rights");
        _voterId++;

        uint256 idNumber = _voterId;

        Voter storage voter = voters[_address];
        require(voter.voter_allowed == 0, "Voter already has voting rights");
        voter.voter_allowed = 1;
        voter.voter_name = _name;
        voter.voter_image = _image;
        voter.voter_address = _address;
        voter.voter_voterId = idNumber;
        voter.voter_vote = 1000;
        voter.voter_voted = false;
        voter.voter_ipfs = _ipfs;

        votersAddresses.push(_address);
        emit VoterCreated(
            idNumber, _name, _image, _address, voter.voter_allowed, voter.voter_voted, voter.voter_vote, _ipfs
        );
    }

    /// @notice Allows a registered voter to cast their vote
    /// @dev Requires the voter to have voting rights and not have voted before
    /// @param _candidateAddress Address of the candidate being voted for
    /// @param _candidateVoteId ID of the candidate being voted for
    function vote(address _candidateAddress, uint256 _candidateVoteId) external {
        Voter storage voter = voters[msg.sender];
        require(!voter.voter_voted, "You have already voted");
        require(voter.voter_allowed != 0, "You do not have voting rights");

        voter.voter_voted = true;
        voter.voter_vote = _candidateVoteId;

        votedVoters.push(msg.sender);
        candidates[_candidateAddress].voteCount += voter.voter_allowed;
    }

    /// @notice Returns the number of registered voters
    /// @return Number of voters
    function getVoterLength() public view returns (uint256) {
        return votersAddresses.length;
    }

    /// @notice Returns detailed data for a specific voter
    /// @param _address Wallet address of the voter
    /// @return voter_voterId Unique identifier
    /// @return voter_name Name of the voter
    /// @return voter_image IPFS hash of image
    /// @return voter_address Wallet address
    /// @return voter_allowed Voting allowance
    /// @return voter_voted Whether has voted
    function getVoterdata(address _address)
        public
        view
        returns (uint256, string memory, string memory, address, uint256, bool)
    {
        return (
            voters[_address].voter_voterId,
            voters[_address].voter_name,
            voters[_address].voter_image,
            voters[_address].voter_address,
            voters[_address].voter_allowed,
            voters[_address].voter_voted
        );
    }

    /// @notice Returns the list of addresses that have already voted
    /// @return Array of voter addresses who have cast their votes
    function getVotedVoterList() public view returns (address[] memory) {
        return votedVoters;
    }

    /// @notice Returns the list of all registered voter addresses
    /// @return Array of all registered voter addresses
    function getVoterList() public view returns (address[] memory) {
        return votersAddresses;
    }
}
