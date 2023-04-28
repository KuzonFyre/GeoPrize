import React from 'react'
import { useState } from "react";
import {storage} from '../firebase'
import alchemyLogo from "../assets/alchemylogo.svg";
import { ethers} from 'ethers';
import GeoPrize from "../smart-contracts/artifacts/contracts/GeoPrize-Contract.sol/GeoPrize.json";



function ReceiveSepoliaEth({provider, contractAddress}: {provider: ethers.providers.Web3Provider, contractAddress: string}) {
  const [status, setStatus] = useState<string>('');
  // function convertToInteger(latitude: number, longitude: number): [string, string] {
  //   // // Get the number of decimal places for each value
  //   // const latitudeDecimals = (latitude.toString().split('.')[1] || '').length;
  //   // const longitudeDecimals = (longitude.toString().split('.')[1] || '').length;
  
  //   // // Calculate the multiplier needed to convert each value to an integer
  //   // const multiplier = Math.pow(10, Math.max(latitudeDecimals, longitudeDecimals));
  //   // Multiply the values and round them to integers
  //   const latInt = Math.round(latitude * Math.pow(10,14)).toString();
  //   const longInt = Math.round(longitude * Math.pow(10,14)).toString();
  //   console.log(latInt, longInt);
  //   return [latInt, longInt];
  // }

  const receiveSepoliaEth = async () => {
    setStatus('Requesting Sepolia ETH...');
    try {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
  
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
  
      const crd = position.coords;
      console.log("Your current position is:");
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
      const { latitude, longitude } = crd;
  
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, GeoPrize.abi, signer);
      const minLat= (await contract.minLatitude()) / Math.pow(10,14);
      const minLong = await contract.minLongitude() / Math.pow(10,14);
      const maxLat = await contract.maxLatitude() / Math.pow(10,14);
      const maxLong = await contract.maxLongitude() / Math.pow(10,14);
      console.log(minLat, minLong, maxLat, maxLong);
      console.log(latitude <= maxLat)
      console.log(latitude,maxLat)
      console.log(longitude >= minLong)
      console.log(longitude, minLong)
      if (latitude >= minLat && latitude <= maxLat && longitude >= minLong && longitude <= maxLong){
        const tx = await contract.claimReward({gasLimit: 500000});
        await tx.wait();
        setStatus('Sepolia ETH received!');
      } else {
        setStatus('You are not close enough to the reward zone!');
      }
    } catch (error) {
      console.error('Failed to receive Sepolia ETH:', error);
      setStatus('Failed to receive Sepolia ETH');
    }
  };
  

  return (
    <div>
      <h2>Receive Sepolia ETH</h2>
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
        <ReceiveSepoliaEth provider={provider} contractAddress='0x7b95E2Db1FC0D5950f1AaDDB4b94E54a343b7427'/>
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
