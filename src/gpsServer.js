const SerialPort = require("serialport");
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({ delimiter: "\r\n" });
const port = new SerialPort("/dev/ttyS0", { baudRate: 9600 });

port.pipe(parser);

var GPS = require("gps");
var gps = new GPS();

gps.on("data", function() {
  if (gps.state.lat !== null) {
    console.log("lat: " + gps.state.lat + " lon: " + gps.state.lon);
  }
});

parser.on("data", function(data) {
  gps.update(data);
});

// // const io = require("socket.io"); //NEW
// const SerialPort = require("serialport");
// const parsers = SerialPort.parsers;

// const parser = new parsers.Readline({ delimiter: "\r\n" });

// // const port = new SerialPort("/dev/ttyS0", { baudRate: 9600 });
// // port.pipe(parser);

// var GPS = require("gps");
// var gps = new GPS();

// gps.on("data", function() {
//   if (gps.state.lat !== null) {
//     console.log("lat: " + gps.state.lat + " lon: " + gps.state.lon);
//   }
// });

// parser.on("data", function(data) {
//   gps.update(data);
// });

// //NEW
// const port = 8000;
// var io = require("socket.io")();

// io.on("connection", client => {
//   io.emit("welcome");
//   // here you can start emitting events to the client
// });

// io.listen(port);
// console.log("listening on port ", port);
