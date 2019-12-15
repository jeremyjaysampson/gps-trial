const SerialPort = require("serialport");

const preamble = [
  "0xFE",
  "0xFE",
  "0x00",
  "0xE0",
  "0x05",
  "0x00",
  "0x00",
  "0x65",
  "0x61",
  "0x04",
  "0xFD"
];

var i;
var buffer = new Buffer(preamble.length);
for (i = 0; i < preamble.length; i++) {
  buffer[i] = preamble[i];
}

const path = "COM2";
const serialport = new SerialPort(path);

serialport.write(buffer);
console.log(buffer);
