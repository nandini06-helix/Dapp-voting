/** @type import('hardhat/config').HardhatUserConfig */

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      // url: `https://eth-sepolia.g.alchemy.com/v2/ALCHEMY_API_KEY`,
      // accounts: [process.env.SEPOLIA_PRIVATE_KEY]
      url:`https://eth-sepolia.g.alchemy.com/v2/CIhDFTTIq9yALJnJX9A3k`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY]
    }},
    etherscan: {
    apiKey: {
      sepolia: "NFCP2IWI4EHTVI94AKXN75MKQU2QP714TP"
    }
  }
};

