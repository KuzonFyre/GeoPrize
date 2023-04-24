const API_KEY = process.env.ETHERSCAN_API;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const API_URL = process.env.ALCHMEY_API;
const { network } = require("hardhat");
const contract = require("../artifacts/contracts/FirstContract.sol/HelloWorld.json");
// console.log(JSON.stringify(contract.abi));
const alchemyProvider = new ethers.providers.EtherscanProvider("sepolia", API_KEY);

const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

const HelloWorldContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
    const message = await HelloWorldContract.message();
    console.log("The message is: ", message);

    console.log("Updating the message...");
    const tx = await HelloWorldContract.update("This is the new message.");
    await tx.wait();
    console.log("The message is: ", message);
}

main();

module.exports = { HelloWorldContract };