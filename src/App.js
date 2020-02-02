import React, { useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import NearestTower from "./Components/NearestTower.js";
// import Coordinates from "./Components/Coordinates";
// import Dashboard from "./Components/dashboard";
// import { subscribeToTimer } from "./api";
import { subscribeToGPS } from "./api";
// import { decimalToSexagesimal } from "geolib";
import * as geolib from "geolib";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <NearestTower />;
      </header>
    </div>
  );
}

export default App;

console.log("hello from app.js");
