const { ethers } = require("hardhat");

async function main() {
  const VotingSystem = await ethers.getContractFactory("VotingSystem");
  const voting = await VotingSystem.deploy();
  await voting.waitForDeployment();

  console.log(`VotingSystem deployed to: ${await voting.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
