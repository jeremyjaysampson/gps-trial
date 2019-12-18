const SerialPort = require("serialport");

const preamble = [
  "0x47",
  "0x4E",
  "0x56",
  "0x54",
  "0x47",
  "0x2c",
  "0x31",
  "0x30",
  "0x2e",
  "0x33",
  "0x36"
];

console.log(preamble);
var i;
var buffer = new Buffer(preamble.length);
for (i = 0; i < preamble.length; i++) {
  buffer[i] = preamble[i];
}

const path = "COM1";
const serialport = new SerialPort(path);

serialport.write(buffer);
console.log(buffer);
