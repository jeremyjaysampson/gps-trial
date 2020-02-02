import React, { useState, useEffect } from "react";
import { subscribeToGPS } from "../api";
// import { decimalToSexagesimal } from "geolib";
import * as geolib from "geolib";
import logo from "../logo.svg";

const NearestTower = () => {
  // const [timestamp, setTimestamp] = useState("no timestamp yet");
  // const [coordinates, setCoordinates] = useState("no coord yet");
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
    {
      name: "A",
      longitude: 145.1999,
      latitude: -37.8888
    },
    {
      name: "B",
      longitude: 145.1777,
      latitude: -37.8666
    },
    {
      name: "C",
      longitude: 145.1555,
      latitude: -37.8444
    }
  ];
  const listStations = stations.map(station => (
    <li key={station.name}>
      {station.name} {station.longitude} {station.latitude}
      {"    "}
    </li>
  ));

  const nearest = coords => geolib.findNearest(coords, stations);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Station coordinates.</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {listStations}{" "}
        </a>
        <a>-</a>
        <a className="App-intro">Latitude: {Number(latitude).toFixed(6)}</a>
        <a className="App-intro">Longitude: {Number(longitude).toFixed(6)}</a>
        <a>nearest: {nearest} </a>
      </header>
    </div>
  );
};

export default NearestTower;
