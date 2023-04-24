
/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.ALCHEMY_API,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
}