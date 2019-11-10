const io = require("socket.io")();
const SerialPort = require("serialport");
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({ delimiter: "\r\n" });
const port = new SerialPort("/dev/ttyS0", { baudRate: 9600 });

port.pipe(parser);

var GPS = require("gps");
var gps = new GPS();

const port = 8000;
io.listen(port);
console.log("gpsServer listening on port ", port);

io.on("connection", client => {
  client.on("subscribeToGPS", interval => {
    console.log("client is subscribing to GPS with interval ", interval);
    setInterval(() => {
      client.emit("gps", new Date());
    }, interval);
  });
});

gps.on("data", function() {
  if (gps.state.lat !== null) {
    console.log("lat: " + gps.state.lat + " lon: " + gps.state.lon);
  }
});

parser.on("data", function(data) {
  gps.update(data);
});

const port = 8000;
io.listen(port);
console.log("listening on port ", port);

io.on("connection", client => {
  client.on("subscribeToGPS", interval => {
    console.log("client is subscribing to GPS with interval ", interval);
    setInterval(() => {
      client.emit("timer", new Date());
    }, interval);
  });
});
