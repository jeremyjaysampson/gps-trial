//THIS WORKS 23-JAN-2020  DON'T CHANGE IT
var i2c = require("i2c-bus"),
  i2cBus = i2c.openSync(1),
  oled = require("oled-i2c-bus"),
  font = require("oled-font-5x7");

const nowTestScreen = () =>
  new Promise((resolve, reject) => {
    var opts = { width: 128, height: 32, address: 0x3c };
    var _oled = new oled(i2cBus, opts);
    _oled.setCursor(1, 1);
    _oled.writeString(font, 2, "tower 1 tower 2", 1, true);
    setTimeout(() => {
      _oled.clearDisplay();
      resolve();
    }, 8000);
  });

function note() {
  return new Promise(resolve => {
    console.log("now complete");
  });
}

const sequence = async () => {
  nowTestScreen(oled).then(() => {
    note();
  });
};

sequence();
