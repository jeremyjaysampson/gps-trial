const io = require("socket.io")();
const SerialPort = require("serialport");
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({ delimiter: "\r\n" });
const port = new SerialPort("/dev/ttyS0", { baudRate: 9600 });

port.pipe(parser);

var GPS = require("gps");
var gps = new GPS();
var coord = 0;

const IOport = 8000;
io.listen(IOport);
console.log("gpsServer listening on port ", IOport);

gps.on("data", function() {
  if (gps.state.lat !== null) {
    var coord = gps.state.lat;
    console.log(coord);
  }
});

parser.on("data", function(data) {
  gps.update(data);
});

io.on("connection", client => {
  client.on("subscribeToGPS", interval => {
    console.log("client is subscribing to GPS with interval ", interval);
    console.log("lat only", gps.state); //here
    setInterval(() => {
      // client.emit("gps", gps.state.lat);
      client.emit("gps", gps.state); //here
    }, interval);
  });
});
