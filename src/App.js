import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Coordinates from "./Components/Coordinates";
import { subscribeToTimer } from "./api";

function App() {
  const [timestamp, setTimestamp] = useState("no timestamp yet");

  subscribeToTimer((err, timestamp) => setTimestamp(timestamp));

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
          Learn React
        </a>
        <p className="App-intro">This is the timer value: {timestamp}</p>
        <Coordinates />
      </header>
    </div>
  );
}

export default App;

console.log("hello from app.js");
