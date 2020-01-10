const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

const ascii2hex = str => {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push("0x" + hex);
  }
  return arr1;
};

const arg2buffer = () => {
  let command = process.argv[2] ? process.argv[2] : "hello";
  const preamble = ascii2hex(command);
  var i;
  buffer = new Buffer.alloc(preamble.length + 2);
  buffer[0] = "02";
  buffer[preamble.length + 1] = "03";
  for (i = 0; i < preamble.length; i++) {
    buffer[i + 1] = preamble[i];
  }
  return buffer;
};

const initiateSerial = async () => {
  try {
    const port = "COM13";
    const serialport = await new SerialPort(port, { baudRate: 9600 });
    throw new Error("oops");
    return serialport;
  } catch (e) {
    // throw new Error(e.message);
    console.error("errorrrrrrs: ", e.message);
  } finally {
    console.log("initiateSerial function completed");
  }
};

const listen = async serialport => {
  try {
    const parser = await new Readline();
    await serialport.pipe(parser);
    parser.on("data", line =>
      console.log("\x1b[33m", `Serial Received: ${line}`)
    );
  } catch (e) {
    throw new Error(e.message);
  } finally {
    console.log("listen function completed");
  }
};

const runscript = async () => {
  try {
    const serialport = await initiateSerial();
    await listen(serialport);
    var buffer = arg2buffer();
    await serialport.write(buffer);
    await console.log(" Serial sent    :", process.argv[2], " ", buffer);
  } catch (e) {
    throw new Error(e.message);
  } finally {
    console.log("runscript function completed");
  }
};

runscript();
