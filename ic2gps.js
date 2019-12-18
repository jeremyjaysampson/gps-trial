var rpio = require("rpio");
const GPS = require("gps");
var gps = new GPS();

gps.on("data", function(parsed) {
  console.log(parsed);
});

const GPS_ADDR = 0x10;

rpio.i2cBegin();
rpio.i2cSetSlaveAddress(GPS_ADDR);
var rxbuf = new Buffer.alloc(1024);
rpio.i2cRead(rxbuf, 1024);
let str = rxbuf.toString();
let start = str.indexOf("$GNGGA");
let GNGGA = str.slice(start, start + 75);
gps.update(GNGGA);
