import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Coordinates from "./Components/Coordinates";
// import { subscribeToTimer } from "./api";
import { subscribeToGPS } from "./api";
// import { decimalToSexagesimal } from "geolib";
import * as geolib from "geolib";

function App() {
  // const [timestamp, setTimestamp] = useState("no timestamp yet");
  const [coordinates, setCoordinates] = useState("no coord yet");
  const [latitude, setLatitude] = useState("no coord yet");
  const [longitude, setLongitude] = useState("no coord yet");
  // const [nearest, setNearest] = useState("na");

  // subscribeToTimer((err, timestamp) => setTimestamp(timestamp));
  subscribeToGPS((err, data) => {
    setLatitude(data.lat);
    setLongitude(data.lon);
    console.log(data);
  }); //here
  console.log(latitude);

  const stations = [
    { name: "A", longitude: 146.55, latitude: -37.22 },
    { name: "B", longitude: 145.17, latitude: -37.86 },
    { name: "C", longitude: 144.32, latitude: -37.99 }
  ];
  const listStations = stations.map(station => (
    <li key={station.name}>
      {station.name} {station.longitude} {station.latitude}
    </li>
  ));

  const nearest = coords => geolib.findNearest(coords, stations);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {listStations}{" "}
        </a>
        <p className="App-intro">
          Latitude: {geolib.decimalToSexagesimal(latitude)}
        </p>
        <p className="App-intro">
          Longitude: {geolib.decimalToSexagesimal(longitude)}
        </p>
        <Coordinates />
        <a>nearest: {nearest} </a>
      </header>
    </div>
  );
}

export default App;

console.log("hello from app.js");
