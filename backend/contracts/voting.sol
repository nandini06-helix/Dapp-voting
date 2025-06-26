// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract VotingSystem {
    address public immutable owner;
    bool public votingStarted;
    bool public votingEnded;
    uint public votingStartTime;
    uint public votingEndTime;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Position {
        string name;
        uint candidateCount;
        mapping(uint => Candidate) candidates;
    }

    struct Voter {
        mapping(bytes32 => bool) hasVotedForPosition;
    }

    mapping(bytes32 => Position) private positions;
    bytes32[] private positionKeys;
    mapping(bytes32 => string) private positionNameMap;

    mapping(address => Voter) private voters;

    event CandidateAdded(string position, uint candidateId, string name);
    event VotingStarted(uint startTime, uint endTime);
    event Voted(address indexed voter, string position, uint candidateId);
    event VotingEnded();
    event WinnerDeclared(string position, string name, uint votes);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this");
        _;
    }

    modifier votingActive() {
        require(votingStarted && !votingEnded, "Voting is not active");
        require(block.timestamp >= votingStartTime, "Voting hasn't started yet");
        require(block.timestamp <= votingEndTime, "Voting has ended");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        for (uint i = 0; i < bStr.length; i++) {
            if (uint8(bStr[i]) >= 65 && uint8(bStr[i]) <= 90) {
                bStr[i] = bytes1(uint8(bStr[i]) + 32);
            }
        }
        return string(bStr);
    }

    function addCandidate(string calldata position, string calldata _name) external onlyOwner {
        require(!votingStarted, "Cannot add candidates after voting starts");

        string memory lower = toLower(position);
        bytes32 positionKey = keccak256(abi.encodePacked(lower));

        if (positions[positionKey].candidateCount == 0) {
            positionKeys.push(positionKey);
            positions[positionKey].name = position;
            positionNameMap[positionKey] = position;
        }

        Position storage p = positions[positionKey];
        p.candidateCount++;
        p.candidates[p.candidateCount] = Candidate(p.candidateCount, _name, 0);

        emit CandidateAdded(position, p.candidateCount, _name);
    }

    function setVotingPeriod(uint _start, uint _end) external onlyOwner {
        require(!votingStarted, "Voting already started");
        require(_start < _end, "Invalid voting period");

        votingStartTime = _start;
        votingEndTime = _end;
    }

    function startVoting() external onlyOwner {
        require(positionKeys.length > 0, "No positions to vote on");
        for (uint i = 0; i < positionKeys.length; i++) {
            require(positions[positionKeys[i]].candidateCount >= 2, "Each position must have at least 2 candidates");
        }
        require(votingStartTime > 0 && votingEndTime > votingStartTime, "Voting period not set");
        votingStarted = true;
        votingEnded = false;
        emit VotingStarted(votingStartTime, votingEndTime);
    }

    function vote(string calldata position, uint candidateId) external votingActive {
        string memory lower = toLower(position);
        bytes32 positionKey = keccak256(abi.encodePacked(lower));
        Voter storage voter = voters[msg.sender];
        require(!voter.hasVotedForPosition[positionKey], "Already voted for this position");

        Position storage p = positions[positionKey];
        require(candidateId > 0 && candidateId <= p.candidateCount, "Invalid candidate");

        p.candidates[candidateId].voteCount++;
        voter.hasVotedForPosition[positionKey] = true;

        emit Voted(msg.sender, position, candidateId);
    }

    function endVoting() external onlyOwner {
        require(votingStarted && !votingEnded, "Voting not active");
        votingEnded = true;
        emit VotingEnded();

        for (uint i = 0; i < positionKeys.length; i++) {
            bytes32 key = positionKeys[i];
            (string[] memory winners, uint votes) = getWinners(key);
            string memory positionName = positionNameMap[key];

            for (uint j = 0; j < winners.length; j++) {
                emit WinnerDeclared(positionName, winners[j], votes);
            }
        }
    }

    function getWinners(bytes32 positionKey) public view returns (string[] memory names, uint votes) {
        require(votingEnded, "Voting not ended yet");

        Position storage p = positions[positionKey];
        uint maxVotes = 0;

        for (uint i = 1; i <= p.candidateCount; i++) {
            if (p.candidates[i].voteCount > maxVotes) {
                maxVotes = p.candidates[i].voteCount;
            }
        }

        uint winnerCount = 0;
        for (uint i = 1; i <= p.candidateCount; i++) {
            if (p.candidates[i].voteCount == maxVotes) {
                winnerCount++;
            }
        }

        names = new string[](winnerCount);
        uint index = 0;
        for (uint i = 1; i <= p.candidateCount; i++) {
            if (p.candidates[i].voteCount == maxVotes) {
                names[index] = p.candidates[i].name;
                index++;
            }
        }

        votes = maxVotes;
    }

    function getWinnersByPosition(string calldata position) external view returns (string[] memory, uint) {
        string memory lower = toLower(position);
        bytes32 key = keccak256(abi.encodePacked(lower));
        return getWinners(key);
    }

    function getCandidate(string calldata position, uint candidateId) external view returns (string memory, uint) {
        string memory lower = toLower(position);
        bytes32 key = keccak256(abi.encodePacked(lower));
        Position storage p = positions[key];
        require(candidateId > 0 && candidateId <= p.candidateCount, "Invalid candidate ID");
        Candidate storage c = p.candidates[candidateId];
        return (c.name, c.voteCount);
    }

    function hasVoted(address voterAddr, string calldata position) external view returns (bool) {
        string memory lower = toLower(position);
        bytes32 key = keccak256(abi.encodePacked(lower));
        return voters[voterAddr].hasVotedForPosition[key];
    }

    function getPositions() external view returns (string[] memory) {
        string[] memory names = new string[](positionKeys.length);
        for (uint i = 0; i < positionKeys.length; i++) {
            names[i] = positionNameMap[positionKeys[i]];
        }
        return names;
    }

    function getCandidateCount(string calldata position) external view returns (uint) {
        string memory lower = toLower(position);
        bytes32 key = keccak256(abi.encodePacked(lower));
        return positions[key].candidateCount;
    }
}
