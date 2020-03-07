const SerialPort = require("serialport");

const preamble = [
  "0x02",
  "0x2a",
  "0x47",
  "0x45",
  "0x54",
  "0x2c",
  "0x45",
  "0x58",
  "0x43",
  "0x4d",
  "0x44",
  "0x2c",
  "0x52",
  "0x58",
  "0x46",
  "0x52",
  "0x51",
  "0x03"
];

var i;
var buffer = new Buffer(preamble.length);
for (i = 0; i < preamble.length; i++) {
  buffer[i] = preamble[i];
}

const path = "COM14";
const serialport = new SerialPort(path);

serialport.write(buffer);
console.log(buffer);
