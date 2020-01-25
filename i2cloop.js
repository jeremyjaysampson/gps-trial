try {
const rpio = require('rpio');
const GPS = require('gps');
const GPS_ADDR = 0x10;
} catch (err) {
  console.log("Oops, couldn't load modules: ", err.message);
};

try {
  var gps = new GPS();
  rpio.i2cBegin();
  rpio.i2cSetSlaveAddress(GPS_ADDR);
} catch (err) {
  console.log("Oops there was an error: ", err.message);
};

readGPS = () => {
  try {
    var rxbuf = new Buffer.alloc(1024);
    rpio.i2cRead(rxbuf, 1024);
    let str = rxbuf.toString();
    let start = str.indexOf("$GNGGA");
    let GNGGA = str.slice(start,start+75);
    gps.on('data', function(parsed) {
        let data = parsed;
        console.log("time: ", data.time, "  lat: ", data.lat, "  Lon: ", data.lon);
    });
    gps.update(GNGGA);
  } catch (err) {
    console.log("Oops, there was a different error: ", err.message);
  }
//  gps.update(GNGGA);
};

setInterval(() => {
  readGPS();
}, 1000);
