var i2c = require("i2c-bus");
const i2cBus = i2c.openSync(1);
const GPS = require("gps");

var gps = new GPS();

try {
  gps.on("data", function(parsed) {
    console.log(parsed);
  });

  const GPS_ADDR = 0x10;
  var rxbuf = new Buffer.alloc(1024);
  i2cBus.i2cReadSync(GPS_ADDR, 1024, rxbuf);
  let str = rxbuf.toString();
  let start = str.indexOf("$GNGGA");
  let GNGGA = str.slice(start, start + 75);

  let sample = gps.update(GNGGA);
  console.log(sample);
} catch (error) {
  console.error(error.message);
}
