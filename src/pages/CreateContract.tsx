import { Wrapper } from "@googlemaps/react-wrapper";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./CreateContract.css"
import Slider from '@mui/material/Slider';

export const CreateContract = () => {
  const center: google.maps.LatLngLiteral = { lat: 40.7128, lng: -74.006 };
  const zoom = 8;
  const [position, setPosition] = useState<google.maps.LatLngLiteral>(center);
  const [radius, setRadius] = useState<number>(50);
  function handlePositionState(newValue: google.maps.LatLngLiteral){
    setPosition(newValue);
  }

  function handleSubmit(){
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
