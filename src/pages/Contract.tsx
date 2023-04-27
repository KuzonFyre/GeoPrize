import React from 'react'
import { useEffect, useState } from "react";
import {storage} from '../firebase'
//@ts-ignore"
import {HelloWorldContract} from "../smart-contracts/deployments/interact.js";
import alchemyLogo from "../assets/alchemylogo.svg";
import { ethers} from 'ethers';
import GeoPrize from "../smart-contracts/artifacts/contracts/GeoPrize-Contract.sol/GeoPrize.json";


function ReceiveSepoliaEth({provider, contractAddress}: {provider: ethers.providers.Web3Provider, contractAddress: string}) {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [status, setStatus] = useState<string>('');

  const receiveSepoliaEth = async () => {
    setStatus('Requesting Sepolia ETH...');
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, GeoPrize.abi, signer);
      console.log(contract);
      const tx = await contract.claimReward(latitude, longitude)
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

export const Contract = () => { 
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    try {
      if (window.ethereum.request){
        console.log(await window.ethereum.request({ method: 'eth_requestAccounts' }));
        setProvider(new ethers.providers.Web3Provider(window.ethereum));
      }
    
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
    }
  };
  return (
    <div>
      <h1>Deploy SimpleStorage Contract</h1>
      {provider ? (
        <ReceiveSepoliaEth provider={provider} contractAddress='0x6196F58CA6d16C5D8595287e121fe28049183b0e'/>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}


// export const Contract = () => {
//     const [walletAddress, setWallet] = useState("");
//       const [status, setStatus] = useState("");
//       const [message, setMessage] = useState("No connection to the network."); //default message
//       const [newMessage, setNewMessage] = useState("");
// return (<div>
//      <div id="container">
//         <img id="logo" src={alchemyLogo}></img>
//        <button id="walletButton" onClick={connectWalletPressed}>
//          {walletAddress.length > 0 ? (
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

//         <button id="publish" onClick={onUpdatePressed}>
//           Update
//         </button>
//       </div>
//     </div>
// </div>)
// }


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
