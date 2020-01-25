var i2c = require("i2c-bus"),
  i2cBus = i2c.openSync(1),
  oled = require("oled-i2c-bus"),
  font = require("oled-font-5x7");

var rpio = require("rpio");
const GPS = require("gps");

const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

//GET GPS DATA
const nowReadGPS = () =>
  new Promise((resolve, reject) => {
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
    console.log("latitude: ", sample);
    console.log("now release rpio");
    rpio.i2cEnd();
    setTimeout(() => {
      console.log("wait 2 seconds after releasing rpio");
      resolve();
    }, 2000);
    console.log("now continue");
  });

//WRITE TO SERIAL PORT
const nowWriteSerial = () => {
  ascii2hex = str => {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n++) {
      var hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push("0x" + hex);
    }
    return arr1;
  };

  arg2buffer = () => {
    let command = process.argv[2];
    const preamble = ascii2hex(command);
    var i;
    var buffer = new Buffer.alloc(preamble.length + 2);
    buffer[0] = "02";
    buffer[preamble.length + 1] = "03";
    for (i = 0; i < preamble.length; i++) {
      buffer[i + 1] = preamble[i];
    }
    return buffer;
  };

  listen = () => {
    const parser = new Readline();
    serialport.pipe(parser);
    parser.on("data", line =>
      console.log("\x1b[33m", `Serial Received: ${line}`)
    );
  };

  const port = "/dev/ttyS0"; //on Raspberry Pi
  const serialport = new SerialPort(port, { baudRate: 9600 });

  //listen();
  var buffer = arg2buffer();
  serialport.write(buffer);
  console.log(" Serial sent    :", process.argv[2], " ", buffer);
};

//TEST SCREEN
const nowTestScreen = () =>
  new Promise((resolve, reject) => {
    var opts = { width: 128, height: 32, address: 0x3c };
    var _oled = new oled(i2cBus, opts);
    _oled.setCursor(1, 1);
    _oled.writeString(font, 2, "tower 1 tower 2", 1, true);
    setTimeout(() => {
      _oled.clearDisplay();
      i2cBus.closeSync();
      resolve();
    }, 8000);
  });

//nowReadGPS();
//nowWriteSerial();
//nowTestScreen(oled);

function note() {
  return new Promise(resolve => {
    console.log("now complete");
  });
}

const sequence = async () => {
  // nowTestScreen(oled).then(() => {
  nowReadGPS().then(() => {
    note();
  });
};

sequence();
