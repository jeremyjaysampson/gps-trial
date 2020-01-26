var i2c = require("i2c-bus"),
  i2cBus = i2c.openSync(1),
  oled = require("oled-i2c-bus"),
  font = require("oled-font-5x7");

var opts = { width: 128, height: 32, address: 0x3c };

var oled = new oled(i2cBus, opts);

oled.setCursor(1, 1);
oled.writeString(font, 2, "tower 1 tower 2", 1, true);

setTimeout(() => oled.clearDisplay(), 8000);
