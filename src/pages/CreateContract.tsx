import { Wrapper } from "@googlemaps/react-wrapper";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./CreateContract.css"
import Slider from '@mui/material/Slider';
import {ethers} from "ethers";
// TODO
import HelloWorld from "../smart-contracts/artifacts/contracts/FirstContract.sol/HelloWorld.json";
export const CreateContract = () => {
  const center: google.maps.LatLngLiteral = { lat: 40.7128, lng: -74.006 };
  const zoom = 8;
  const [position, setPosition] = useState<google.maps.LatLngLiteral>(center);
  const [radius, setRadius] = useState<number>(50);
  const [status, setStatus] = useState('');
  function handlePositionState(newValue: google.maps.LatLngLiteral){
    setPosition(newValue);
  }

  function handleSubmit(){
    setStatus("Deploying contract...");

    console.log(position);
  }
  return (
    <div>
      <h1>Create Contract</h1>
    <div className="container">
      <Wrapper apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}>
        <MyMapComponent center={center} zoom={zoom} changePosition={handlePositionState} radius={radius}/>
      </Wrapper>
    </div>
    <p>
      Selected Postion: {position?.lat}, {position?.lng}
    </p>
    <Slider value = {radius} aria-label="Default" valueLabelDisplay="auto" step={10} marks={true} onChange={(event,newValue: number | number[])=> setRadius(newValue as number)}></Slider>
    <button onClick={handleSubmit}>Submit</button>
    <p>{radius}</p>
    <MetaMask />
    </div>
  );
}

function MyMapComponent({
  center,
  zoom,
  changePosition,
  radius
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
  changePosition: (newValue: google.maps.LatLngLiteral) => void;
  radius: number;
}) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const myRef = useRef<HTMLDivElement>(null);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);


  useEffect(() => {
    if (circle) {
      circle.setRadius(radius);
    }
  }, [radius]);

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
      const newCircle = new window.google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map,
          center: position,
          radius
        });
      setCircle(newCircle);
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
        
        marker?.setPosition(position);
        circle?.setCenter(position);
        // circle?.setRadius(radius);
        changePosition(position);
        marker?.setMap(map);
        circle?.setMap(map);
        
      });
      return () => {
        // Remove the click listener when the component is unmounted
        window.google.maps.event.clearListeners(map, "click");
      };
    }
  }, [map]);

  return <div ref={myRef} id="map" style={{ width: "100%", height: "100%" }}></div>;
}

function MetaMask() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    try {
      if (window.ethereum.request){
        await window.ethereum.request({ method: 'eth_requestAccounts' });
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
        <DeployContract provider={provider} />
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

function DeployContract({ provider }: { provider: ethers.providers.Web3Provider }) {
    const [status, setStatus] = useState<string>('');
  
    const deploy = async () => {
      setStatus('Deploying contract...');
      try {
        const signer = provider.getSigner();
        const factory = new ethers.ContractFactory(HelloWorld.abi, HelloWorld.bytecode, signer);
        const contract = await factory.deploy("Hello There!");
        await contract.deployed();
        setStatus(`Contract deployed at address: ${contract.address}`);
      } catch (error) {
        console.error('Failed to deploy contract:', error);
        setStatus('Failed to deploy contract');
      }
    };
  
    return (
      <div>
        <button onClick={deploy}>Deploy SimpleStorage Contract</button>
        <p>{status}</p>
      </div>
    );
  };
