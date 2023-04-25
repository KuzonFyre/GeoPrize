
/** @type import('hardhat/config').HardhatUserConfig */
import "@nomiclabs/hardhat-ethers";
require('dotenv').config();
import "@nomiclabs/hardhat-etherscan";
export const solidity = "0.8.18";
export const defaultNetwork = "sepolia";
export const networks = {
  hardhat: {},
  sepolia: {
    url: process.env.ALCHEMY_API,
    accounts: [`0x${process.env.PRIVATE_KEY}`]
  }
};
export const etherscan = {
  apiKey: process.env.ETHERSCAN_API
};