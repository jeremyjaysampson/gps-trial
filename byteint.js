const SerialPort = require("serialport");

const preamble = [
  "0x02",
  "0x47",
  "0x45",
  "0x54",
  "0x2c",
  "0x49",
  "0x4e",
  "0x46",
  "0x4f",
  "0x2c",
  "0x52",
  "0x45",
  "0x56",
  "0x03"
];

console.log(preamble);
var i;
var buffer = new Buffer.alloc(preamble.length);
for (i = 0; i < preamble.length; i++) {
  buffer[i] = preamble[i];
}

const path = "COM13";
const serialport = new SerialPort(path);

serialport.write(buffer);
console.log(buffer);
