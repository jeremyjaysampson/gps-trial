// THIS SCRIPT WORKS PERFECT.  SENDS COMMAND AND LISTENS FOR REPLAY
// JUST TYPE node commandsend.js TESTARGUMENT
// CHANGE FROM arg2BufferX to arg2BufferY to add STX and

const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

ascii2hex = str => {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push("0x" + hex);
  }
  return arr1;
};

arg2bufferX = () => {
  let command = process.argv[2];
  const preamble = ascii2hex(command);
  var i;
  var buffer = new Buffer.alloc(preamble.length);
  for (i = 0; i < preamble.length; i++) {
    buffer[i] = preamble[i];
  }
  return buffer;
};

arg2bufferY = () => {
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

//const port = "COM13"; //on computer
const port = "/dev/ttyS0";  //on Raspberry Pi
const serialport = new SerialPort(port, { baudRate: 9600 });

//listen();
//var buffer = arg2bufferY();
//serialport.write(buffer);
//console.log(" Serial sent    :", process.argv[2], " ", buffer);

var buffer = arg2bufferY();
setInterval(() => {
  serialport.write(buffer);
  console.log(" Serial sent    :", process.argv[2], " ", buffer);
}, 500);
