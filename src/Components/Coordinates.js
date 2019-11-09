import React, { useState } from "react";
// import SerialPort from "serialport";
import SerialPortParser from "@serialport/parser-readline";
import GPS from "gps";
// var SerialPort = require("serialport");

function Coordinates() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  const [latlong, setlatlong] = useState(0);

  // const port = new SerialPort("/dev/ttyS0", { baudRate: 9600 });
  // const gps = new GPS();
  // const parser = port.pipe(new SerialPortParser());

  // function getAddressInformation(latitude, longitude) {
  //   let address = { latitude, longitude };
  //   return address;
  // }

  // gps.on("data", async data => {
  //   if (data.type == "GGA") {
  //     if (data.quality != null) {
  //       let address = await getAddressInformation(data.lat, data.lon);
  //       console.log("[" + data.lat + ", " + data.lon + "]");
  //     } else {
  //       console.log("no gps fix available");
  //     }
  //   }
  // });

  // parser.on("data", data => {
  //   try {
  //     gps.update(data);
  //   } catch (e) {
  //     throw e;
  //   }
  // });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
export default Coordinates;
