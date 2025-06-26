const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingSystem", function () {
  let VotingSystem, votingSystem, owner, voter1, voter2;

beforeEach(async () => {
  [owner, voter1, voter2] = await ethers.getSigners();
  VotingSystem = await ethers.getContractFactory("VotingSystem");
  votingSystem = await VotingSystem.deploy(); 
});


  it("should allow owner to add candidates before voting starts", async () => {
    await votingSystem.addCandidate("President", "Alice");
    await votingSystem.addCandidate("President", "Bob");

    expect(await votingSystem.getCandidateCount("President")).to.equal(2);

    const [name, votes] = await votingSystem.getCandidate("President", 1);
    expect(name).to.equal("Alice");
    expect(votes).to.equal(0);
  });

  it("should not allow adding candidates after voting starts", async () => {
    await votingSystem.addCandidate("President", "Alice");
    await votingSystem.addCandidate("President", "Bob");

    await votingSystem.startVoting();

    await expect(
      votingSystem.addCandidate("President", "Charlie")
    ).to.be.revertedWith("Cannot add candidates after voting starts");
  });

  it("should not start voting if position has less than 2 candidates", async () => {
    await votingSystem.addCandidate("Secretary", "John");
    await expect(votingSystem.startVoting()).to.be.revertedWith(
      "Each position must have at least 2 candidates"
    );
  });

  it("should allow voting and emit Voted event", async () => {
    await votingSystem.addCandidate("President", "Alice");
    await votingSystem.addCandidate("President", "Bob");

    await votingSystem.startVoting();

    await expect(
      votingSystem.connect(voter1).vote("President", 1)
    ).to.emit(votingSystem, "Voted").withArgs(voter1.address, "President", 1);

    const [name, votes] = await votingSystem.getCandidate("President", 1);
    expect(votes).to.equal(1);
  });

  it("should prevent double voting by same address for the same position", async () => {
    await votingSystem.addCandidate("President", "Alice");
    await votingSystem.addCandidate("President", "Bob");

    await votingSystem.startVoting();

    await votingSystem.connect(voter1).vote("President", 1);

    await expect(
      votingSystem.connect(voter1).vote("President", 2)
    ).to.be.revertedWith("Already voted for this position");
  });

  it("should not allow voting for invalid candidate", async () => {
    await votingSystem.addCandidate("President", "Alice");
    await votingSystem.addCandidate("President", "Bob");

    await votingSystem.startVoting();

    await expect(
      votingSystem.connect(voter1).vote("President", 3)
    ).to.be.revertedWith("Invalid candidate");
  });

  it("should emit WinnerDeclared event after voting ends", async () => {
    await votingSystem.addCandidate("President", "Alice");
    await votingSystem.addCandidate("President", "Bob");

    await votingSystem.startVoting();

    await votingSystem.connect(voter1).vote("President", 1);
    await votingSystem.connect(voter2).vote("President", 1);

    await expect(votingSystem.endVoting())
      .to.emit(votingSystem, "WinnerDeclared")
      .withArgs("President", "Alice", 2);
  });

  it("should return correct winner(s) for position", async () => {
    await votingSystem.addCandidate("President", "Alice");
    await votingSystem.addCandidate("President", "Bob");

    await votingSystem.startVoting();
    await votingSystem.connect(voter1).vote("President", 1);
    await votingSystem.connect(voter2).vote("President", 2);
    await votingSystem.endVoting();

    const [winners, votes] = await votingSystem.getWinnersByPosition("President");
    expect(winners).to.include.members(["Alice", "Bob"]);
    expect(votes).to.equal(1);
  });

  it("should track hasVoted correctly", async () => {
    await votingSystem.addCandidate("President", "Alice");
    await votingSystem.addCandidate("President", "Bob");

    await votingSystem.startVoting();
    expect(
      await votingSystem.hasVoted(voter1.address, "President")
    ).to.be.false;

    await votingSystem.connect(voter1).vote("President", 1);

    expect(
      await votingSystem.hasVoted(voter1.address, "President")
    ).to.be.true;
  });

  it("should return list of position names", async () => {
    await votingSystem.addCandidate("President", "Alice");
    await votingSystem.addCandidate("President", "Bob");
    await votingSystem.addCandidate("Treasurer", "David");
    await votingSystem.addCandidate("Treasurer", "Eve");

    const positions = await votingSystem.getPositions();
    expect(positions).to.include.members(["President", "Treasurer"]);
  });
});
