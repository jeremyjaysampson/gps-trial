const io = require("socket.io")();
var i2c = require("i2c-bus");
const i2cBus = i2c.openSync(1);
var oled = require("oled-i2c-bus");
var font = require("oled-font-5x7");
const GPS = require("gps");
let GPSstate = { lat: 0, lon: 0 };

//GET GPS DATA
const nowReadGPS = () =>
  new Promise((resolve, reject) => {
    const GPS_ADDR = 0x10;
    var rxbuf = new Buffer.alloc(1024);
    i2cBus.i2cReadSync(GPS_ADDR, 1024, rxbuf);
    let str = rxbuf.toString();
    let start = str.indexOf("$GNGGA");
    let GNGGA = str.slice(start, start + 75);
    let data = GPS.Parse(GNGGA);
    console.log("time: ", data.time, "  lat: ", data.lat, "  Lon: ", data.lon);
    resolve(data);
  });

//CONSOLE LOG NOTE
const note = data =>
  new Promise((resolve, reject) => {
    console.log("start timer");
    setTimeout(() => {
      console.log("end 2 second timer");
      resolve();
    }, 2000);
  });

//SEND TIME TO SCREEN
const nowTestScreen = data => {
  var opts = { width: 128, height: 32, address: 0x3c };
  var _oled = new oled(i2cBus, opts);
  _oled.setCursor(1, 1);
  console.log(data.time);
  if (data) {
    let message = data.time;
    let messageString = message.toString();
    _oled.writeString(font, 1, messageString, 1, true);
  } else {
    let messageString = "no data received";
    _oled.writeString(font, 1, messageString, 1, true);
  }
  console.log("start screen");
  setTimeout(() => {
    _oled.clearDisplay();
    console.log("clear screen");
  }, 4000);
};

//CALL PROMISES
const sequence = async () => {
  let data = await nowReadGPS();
  if (data) {
    GPSstate = data;
  }
  await note(data);
  await nowTestScreen(data);
  console.log("data: ", data);
};

//START INFINITE LOOP
setInterval(() => {
  sequence();
}, 8000);

const IOport = 8000;
io.listen(IOport);
console.log("gpsServer listening on port ", IOport);

io.on("connection", client => {
  client.on("subscribeToGPS", interval => {
    console.log("client is subscribing to GPS with interval ", interval);
    console.log("lat only", GPSstate.lat); //here
    setInterval(() => {
      // client.emit("gps", gps.state.lat);
      client.emit("gps", GPSstate); //here
      console.log("gps lat", GPSstate.lat);
    }, interval);
  });
});
