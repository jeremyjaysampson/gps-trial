var i2c = require("i2c-bus");
const i2cBus = i2c.openSync(1);
var oled = require("oled-i2c-bus");
var font = require("oled-font-5x7");
const GPS = require("gps");
var gps = new GPS();

//GET GPS DATA
const nowReadGPS = () => {
  gps.on("data", function(parsed) {
    console.log(parsed);
    return parsed.lat;
  });
  const GPS_ADDR = 0x10;
  var rxbuf = new Buffer.alloc(1024);
  i2cBus.i2cReadSync(GPS_ADDR, 1024, rxbuf);
  let str = rxbuf.toString();
  let start = str.indexOf("$GNGGA");
  let GNGGA = str.slice(start, start + 75);
  const sample = gps.update(GNGGA);
  console.log(sample);
};

const nowTestScreen = () => {
  var opts = { width: 128, height: 32, address: 0x3c };
  var _oled = new oled(i2cBus, opts);
  _oled.setCursor(1, 1);
  _oled.writeString(font, 2, "tower 1 tower 2", 1, true);
  setTimeout(() => {
    _oled.clearDisplay();
    i2cBus.closeSync();
  }, 8000);
};

nowTestScreen();
nowReadGPS();
