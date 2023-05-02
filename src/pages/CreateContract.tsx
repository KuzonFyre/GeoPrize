import { Wrapper } from "@googlemaps/react-wrapper";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./CreateContract.css"
import Slider from '@mui/material/Slider';
import {ethers} from "ethers";
import GeoPrize from "../smart-contracts/artifacts/contracts/GeoPrize-Contract.sol/GeoPrize.json";
import {db,auth} from '../firebase'
import {doc, setDoc,updateDoc} from "firebase/firestore";
import { arrayUnion} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

export const CreateContract = () => {
  const center: google.maps.LatLngLiteral = { lat: 41.74078398514266, lng: -111.81450941381996};
  const zoom = 8;
  const [position, setPosition] = useState<google.maps.LatLngLiteral>(center);
  const [latLangModifier, setLatLangModifier] = useState<number>(.005);
  const [user,loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if(loading){
      console.log("loading");
      return;
    }
    if (!user) return navigate("/login");
  }, [user,loading]);
  function handlePositionState(newValue: google.maps.LatLngLiteral,newLatLangModifier: number){
    setPosition(newValue);
    setLatLangModifier(newLatLangModifier);
  }


  return (
    <div>
      <h1>Create Contract</h1>
    <div className="container">
      <Wrapper apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}>
        <MyMapComponent center={position} zoom={zoom} changePosition={handlePositionState} latLangModifier={latLangModifier}/>
      </Wrapper>
    </div>
    <p>
      Selected Postion: {position?.lat}, {position?.lng}
    </p>
    <Slider value = {latLangModifier} aria-label="Default" valueLabelDisplay="auto" min={0.005} step= {0.005} max = {0.5} onChange={(event,newValue: number | number[])=> setLatLangModifier(newValue as number)}></Slider>
    <p>{latLangModifier}</p>
    <MetaMask position={position} latLangModifier={latLangModifier}/>
    </div>
  );
}

function MyMapComponent({
  center,
  zoom,
  changePosition,
  latLangModifier,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  changePosition: (newValue: google.maps.LatLngLiteral,newLatLangModifier: number) => void;
  latLangModifier: number;
}) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const myRef = useRef<HTMLDivElement>(null);
  const [rectangle, setRectangle] = useState<google.maps.Rectangle | null>(null);


  useEffect(() => {
    if(rectangle){
      rectangle.setBounds({
        north: center.lat + latLangModifier,
        south: center.lat - latLangModifier,
        east: center.lng + latLangModifier,
        west: center.lng - latLangModifier
      });
    }
  }, [latLangModifier]);

  useEffect(() => {
    if (myRef.current) {
      const newMap = new window.google.maps.Map(myRef.current, {
        center,
        zoom,
      });
      const position = {
        lat: center.lat,
        lng: center.lng
      };
      const newMarker = new window.google.maps.Marker({
        position,
        map,
      });
      const newRectangle = new window.google.maps.Rectangle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        bounds: {
          north: center.lat + latLangModifier,
          south: center.lat - latLangModifier,
          east: center.lng + latLangModifier,
          west: center.lng - latLangModifier
        }
      });
      setRectangle(newRectangle);
      setMarker(newMarker);
      setMap(newMap);
    }
  }, []);
  
  useEffect(() => {
    if (map) {
      map.addListener("click", (mapsMouseEvent: { latLng: any; }) => {
        const position = {
          lat: mapsMouseEvent.latLng.lat(),
          lng: mapsMouseEvent.latLng.lng()
        };
        
        const newLatLangModifier = latLangModifier;
        marker?.setPosition(position);
        rectangle?.setBounds({
          north: position.lat + newLatLangModifier,
          south: position.lat - newLatLangModifier,
          east: position.lng + newLatLangModifier,
          west: position.lng - newLatLangModifier
        });
        changePosition(position, newLatLangModifier);
        marker?.setMap(map);
        rectangle?.setMap(map);
      });
      return () => {
        // Remove the click listener when the component is unmounted
        window.google.maps.event.clearListeners(map, "click");
      };
    }
  }, [map]);

  return <div ref={myRef} id="map" style={{ width: "100%", height: "100%" }}></div>;
}

function MetaMask({position, latLangModifier}: {position: google.maps.LatLngLiteral, latLangModifier: number}) {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    try {
      if (window.ethereum.request){
        console.log(await window.ethereum.request({ method: 'eth_requestAccounts' }));
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
      }
    
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
    }
  };

  return (
    <div>
      <h1>Deploy SimpleStorage Contract</h1>
      {provider ? (
        <DeployContract position= {position} provider={provider} latLangModifier = {latLangModifier}/>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

function DeployContract({ provider, position, latLangModifier}: { provider: ethers.providers.Web3Provider, position: google.maps.LatLngLiteral, latLangModifier: number}) {
    const [status, setStatus] = useState<string>('');
    const [toAddress, setToAddress] = useState<string>('');
    function convertToInteger(latitude: number, longitude: number): [string, string, number] {
      // Get the number of decimal places for each value
      const latitudeDecimals = (latitude.toString().split('.')[1] || '').length;
      const longitudeDecimals = (longitude.toString().split('.')[1] || '').length;
    
      // Calculate the multiplier needed to convert each value to an integer
      const multiplier = Math.pow(10, Math.max(latitudeDecimals, longitudeDecimals));
    
      // Multiply the values and round them to integers
      const latInt = Math.round(latitude * multiplier).toString();
      const longInt = Math.round(longitude * multiplier).toString();
    
      return [latInt, longInt, multiplier];
    }
    //toaddress for demo 0x8a694597df0b52e370C6f411F02c2dA2Ea2803f1
    const deploy = async () => {
      setStatus('Deploying contract...');
      try {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const to = ethers.utils.getAddress(toAddress);
        const factory = new ethers.ContractFactory(GeoPrize.abi, GeoPrize.bytecode, signer);
        const [latInt, longInt,multiplier] = convertToInteger(position.lat-latLangModifier, position.lng-latLangModifier);
        const [latInt2, longInt2] = convertToInteger(position.lat+latLangModifier, position.lng+latLangModifier);
        console.log(latInt, longInt, latInt2, longInt2);
        const contract = await factory.deploy(
          latInt,latInt2,longInt,longInt2,multiplier,to,{
            value: ethers.utils.parseEther("0.005"),
          });
        await contract.deployed();
        setStatus(`Contract deployed at address: ${contract.address}`);
        if(auth.currentUser != null){
          const contractsRef = doc(db, "contracts",Date.now().toString());
          setDoc(contractsRef, { to: to, from: address, address: contract.address});
          const usersRef = doc(db, "users", auth.currentUser.uid);
          updateDoc(usersRef,{ contracts: arrayUnion({ to: to, from: address, address: contract.address })});
          }else{
            throw new Error("not logged in");
          }
      } catch (error) {
        console.error('Failed to deploy contract:', error);
        setStatus('Failed to deploy contract');
      }
    };
  
    return (
      <div>
         <label htmlFor="toAddress">To Address:</label>
         <input type="text" id="toAddress" name="toAddress" value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
        <button onClick={deploy}>Deploy SimpleStorage Contract</button>
        <p>{status}</p>
      </div>
    );
  };
