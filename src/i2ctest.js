const i2c = require("i2c-bus");
var rpio = require("rpio");
const GPS_ADDR = 0x10;

rpio.i2cBegin();
rpio.i2cSetSlaveAddress(GPS_ADDR);
var rxbuf = new Buffer.alloc(256);
rpio.i2cRead(rxbuf, 256);
let str = rxbuf.toString();
console.log(rxbuf);
console.log(str);

//<Buffer
//32 2c 32 30 2c 31 39 35 2c 30 38 2c 2c 31 2e 30 39
//2c 30 2e 37 39 2c 30 2e 37 36 2a 30 46 0d 0a
//24 47 4c 47 53 41 2c 41 2c 33 2c 36 39 2c 37 38 2c 2c ... >
//
//$GLGSA, A, 3, 69, 78,,,,,,,,,,, 1.09, 0.79, 0.76 * 19
//$GNRMC, 112023.000, A, 3751.5991, S, 14510.7280, E, 0.34, 289.93, 161219,,, A * 64
//$GNVTG, 289.93, T,, M, 0.34, N, 0.63, K, A * 28
//$GNGGA, 112024.000, 3751.5990, S, 14510.7279, E, 1, 13, 0.79, 112.7, M, -3.9
