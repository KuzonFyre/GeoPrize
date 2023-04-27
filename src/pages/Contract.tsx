import React from 'react'
import { useEffect, useState } from "react";
import {storage} from '../firebase'
//@ts-ignore"
import {HelloWorldContract} from "../smart-contracts/deployments/interact.js";
import alchemyLogo from "../assets/alchemylogo.svg";
import { ethers, providers } from 'ethers';
import HelloWorld from "../smart-contracts/artifacts/contracts/FirstContract.sol/HelloWorld.json";


function ReceiveSepoliaEth(provider: ethers.providers.Web3Provider , contractAddress: string) {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [status, setStatus] = useState<string>('');

  const receiveSepoliaEth = async () => {
    setStatus('Requesting Sepolia ETH...');
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, HelloWorld.abi, signer);

      // Replace "awardSepoliaEth" with your contract's function name
      const tx = await contract.awardSepoliaEth(latitude, longitude);
      await tx.wait();
      setStatus('Sepolia ETH received!');
    } catch (error) {
      console.error('Failed to receive Sepolia ETH:', error);
      setStatus('Failed to receive Sepolia ETH');
    }
  };

  return (
    <div>
      <h2>Receive Sepolia ETH</h2>
      <label>
        Latitude:
        <input
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Longitude:
        <input
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(parseFloat(e.target.value))}
        />
      </label>
      <button onClick={receiveSepoliaEth}>Receive Sepolia ETH</button>
      <p>{status}</p>
    </div>
  );
};

export default ReceiveSepoliaEth;


  const connectWalletPressed = async () => { //TODO: implement
    
  };

  const onUpdatePressed = async () => { //TODO: implement
    
  };
export const Contract = () => {
    const [walletAddress, setWallet] = useState("");
      const [status, setStatus] = useState("");
      const [message, setMessage] = useState("No connection to the network."); //default message
      const [newMessage, setNewMessage] = useState("");
return (<div>
     <div id="container">
        <img id="logo" src={alchemyLogo}></img>
       <button id="walletButton" onClick={connectWalletPressed}>
         {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h2 style={{ paddingTop: "50px" }}>Current Message:</h2>
      <p>{message}</p>

      <h2 style={{ paddingTop: "18px" }}>New Message:</h2>

      <div>
        <input
          type="text"
          placeholder="Update the message in your smart contract."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />

        <button id="publish" onClick={onUpdatePressed}>
          Update
        </button>
      </div>
    </div>
</div>)
}

// import React from "react";
// import { useEffect, useState } from "react";
// import {
//   helloWorldContract,
//   connectWallet,
//   updateMessage,
//   loadCurrentMessage,
//   getCurrentWalletConnected,
// } from "./util/interact.js";

// import alchemylogo from "./alchemylogo.svg";

// const HelloWorld = () => {
//   //state variables
//   const [walletAddress, setWallet] = useState("");
//   const [status, setStatus] = useState("");
//   const [message, setMessage] = useState("No connection to the network."); //default message
//   const [newMessage, setNewMessage] = useState("");

//   //called only once
//   useEffect(async () => {
    
//   }, []);

//   function addSmartContractListener() { //TODO: implement
    
//   }

//   function addWalletListener() { //TODO: implement
    
//   }

//   const connectWalletPressed = async () => { //TODO: implement
    
//   };

//   const onUpdatePressed = async () => { //TODO: implement
    
//   };

//   //the UI of our component
//   return (
//     <div id="container">
//       <img id="logo" src={alchemylogo}></img>
//       <button id="walletButton" onClick={connectWalletPressed}>
//         {walletAddress.length > 0 ? (
//           "Connected: " +
//           String(walletAddress).substring(0, 6) +
//           "..." +
//           String(walletAddress).substring(38)
//         ) : (
//           <span>Connect Wallet</span>
//         )}
//       </button>

//       <h2 style={{ paddingTop: "50px" }}>Current Message:</h2>
//       <p>{message}</p>

//       <h2 style={{ paddingTop: "18px" }}>New Message:</h2>

//       <div>
//         <input
//           type="text"
//           placeholder="Update the message in your smart contract."
//           onChange={(e) => setNewMessage(e.target.value)}
//           value={newMessage}
//         />
//         <p id="status">{status}</p>

//         <button id="publish" onClick={onUpdatePressed}>
//           Update
//         </button>
//       </div>
//     </div>
//   );
// };

// export default HelloWorld;