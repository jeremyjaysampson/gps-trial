var i2c = require("i2c-bus");
// i2cBus = i2c.openSync(1),
var oled = require("oled-i2c-bus");
var font = require("oled-font-5x7");

var rpio = require("rpio");
const GPS = require("gps");

//GET GPS DATA
const nowReadGPS = () => {
  var gps = new GPS();
  gps.on("data", function(parsed) {
    console.log(parsed);
    return parsed.lat;
  });
  const GPS_ADDR = 0x10;
  rpio.i2cBegin();
  rpio.i2cSetSlaveAddress(GPS_ADDR);
  var rxbuf = new Buffer.alloc(1024);
  rpio.i2cRead(rxbuf, 1024);
  let str = rxbuf.toString();
  let start = str.indexOf("$GNGGA");
  let GNGGA = str.slice(start, start + 75);
  const sample = gps.update(GNGGA);
  rpio.i2cEnd();
};

nowReadGPS();
