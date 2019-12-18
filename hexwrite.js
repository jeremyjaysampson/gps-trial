const SerialPort = require("serialport");

function ascii2hex(str) {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push("0x" + hex);
  }
  // return arr1.join("");
  return arr1;
}

let command = process.argv[2];
console.log(command);

const preamble = ascii2hex(command);
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

//node hexwrite.js GNVTG  >> 47 4e 56 54 47
