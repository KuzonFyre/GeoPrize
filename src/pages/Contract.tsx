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
      const lat = (latitude * await contract.multiplier()).toString();
      const long = (longitude * await contract.multiplier()).toString();
        const tx = await contract.claimReward(lat, long, {gasLimit: 500000});
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
        <ReceiveSepoliaEth provider={provider} contractAddress='0xF7F13262a14C12b36E774211F1C0610479552Afc'/>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
