//FOR EXPRESS REST API
const express = require("express");
const basicAuth = require("express-basic-auth");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

//FOR EXCEL UPLOAD
var bodyParser = require("body-parser"); //FOR EXCEL UPLOAD
var multer = require("multer"); //FOR EXCEL UPLOAD
var xlstojson = require("xls-to-json-lc"); //FOR EXCEL UPLOAD
var xlsxtojson = require("xlsx-to-json-lc"); //FOR EXCEL UPLOAD
const fs = require("fs");

//FOR GPS AND
const io = require("socket.io")();
var i2c = require("i2c-bus");
const i2cBus = i2c.openSync(1);
var oled = require("oled-i2c-bus");
var font = require("oled-font-5x7");
const GPS = require("gps");
let GPSstate = { lat: 0, lon: 0 };

//GET GPS DATA
const nowReadGPS = () =>
  new Promise((resolve, reject) => {
    const GPS_ADDR = 0x10;
    var rxbuf = new Buffer.alloc(1024);
    i2cBus.i2cReadSync(GPS_ADDR, 1024, rxbuf);
    let str = rxbuf.toString();
    let start = str.indexOf("$GNGGA");
    let GNGGA = str.slice(start, start + 100);
    console.log(GNGGA);
    let data = GPS.Parse(GNGGA);
    console.log("time: ", data.time, "  lat: ", data.lat, "  Lon: ", data.lon);
    resolve(data);
  });

//CONSOLE LOG NOTE
const note = data =>
  new Promise((resolve, reject) => {
    console.log("start timer");
    setTimeout(() => {
      console.log("end 2 second timer");
      resolve();
    }, 2000);
  });

//SEND TIME TO SCREEN
const nowTestScreen = data => {
  var opts = { width: 128, height: 32, address: 0x3c };
  var _oled = new oled(i2cBus, opts);
  _oled.setCursor(1, 1);
  console.log(data.time);
  if (data) {
    let message = "lat: " + data.lat + "lon: " + data.lon;
    let messageString = message.toString();
    _oled.writeString(font, 1, messageString, 1, true);
  } else {
    let messageString = "no data received";
    _oled.writeString(font, 1, messageString, 1, true);
  }
  console.log("start screen");
  setTimeout(() => {
    _oled.clearDisplay();
    console.log("clear screen");
  }, 4000);
};

//CALL PROMISES
const sequence = async () => {
  let data = await nowReadGPS();
  if (data) {
    GPSstate = data;
  }
  await note(data);
  await nowTestScreen(data);
  console.log("data: ", data);
};

//START INFINITE LOOP
setInterval(() => {
  sequence();
}, 8000);

const IOport = 8000;
io.listen(IOport);
console.log("gpsServer listening on port ", IOport);

io.on("connection", client => {
  client.on("subscribeToGPS", interval => {
    console.log("client is subscribing to GPS with interval ", interval);
    console.log("lat only", GPSstate.lat); //here
    setInterval(() => {
      // client.emit("gps", gps.state.lat);
      client.emit("gps", GPSstate); //here
      console.log("gps lat", GPSstate.lat);
    }, interval);
  });
});

// REST API STARTS HERE
const auth = basicAuth({
  users: {
    admin: "123",
    user: "456"
  }
});

var towers = require("./uploads/towers.json");
console.log(towers);
const PORT = process.env.PORT || 5000;

app.use(cookieParser("82e4e438a0705fabf61f9854e3b575af"));
app.use(bodyParser.json()); //FOR EXCEL UPLOAD

app
  .use(express.static(path.join(__dirname, "/client/build")))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.get("/authenticate", auth, (req, res) => {
  const options = {
    httpOnly: true,
    signed: true
  };

  console.log(req.auth.user);

  if (req.auth.user === "admin") {
    res.cookie("name", "admin", options).send({ screen: "admin" });
  } else if (req.auth.user === "user") {
    res.cookie("name", "user", options).send({ screen: "user" });
  }
});

app.get("/read-cookie", (req, res) => {
  console.log(req.signedCookies);
  if (req.signedCookies.name === "admin") {
    res.send({ screen: "admin" });
  } else if (req.signedCookies.name === "user") {
    res.send({ screen: "user" });
  } else {
    res.send({ screen: "auth" });
  }
});

app.get("/clear-cookie", (req, res) => {
  res.clearCookie("name").end();
});

app.get("/get-data", (req, res) => {
  if (req.signedCookies.name === "admin") {
    // res.send("This is admin panel");
    res.send(
      // `This is admin panel.  First city in towers list is: ${towers[0].city}`
      towers
    );
  } else if (req.signedCookies.name === "user") {
    res.send([]); //user doesn't see any data
  } else {
    res.end();
  }
});

//EXCEL UPLOAD SECTION STARTS HERE

var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  }
});

var upload = multer({
  //multer settings
  storage: storage,
  fileFilter: function(req, file, callback) {
    //file filter
    if (
      ["xls", "xlsx"].indexOf(
        file.originalname.split(".")[file.originalname.split(".").length - 1]
      ) === -1
    ) {
      return callback(new Error("Wrong extension type"));
    }
    callback(null, true);
  }
}).single("file");

/** API path that will upload the files */
app.post("/upload", function(req, res) {
  var exceltojson;
  upload(req, res, function(err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    /** Multer gives us file info in req.file object */
    if (!req.file) {
      res.json({ error_code: 1, err_desc: "No file passed" });
      return;
    }
    /** Check the extension of the incoming file and
     *  use the appropriate module
     */
    if (
      req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ] === "xlsx"
    ) {
      exceltojson = xlsxtojson;
    } else {
      exceltojson = xlstojson;
    }
    console.log(req.file.path);
    try {
      exceltojson(
        {
          input: req.file.path,
          output: null, //since we don't need output.json
          lowerCaseHeaders: true
        },
        function(err, result) {
          if (err) {
            return res.json({ error_code: 1, err_desc: err, data: null });
          }
          res.json({ error_code: 0, err_desc: null, data: result });
          var jsonContent = JSON.stringify(result);
          console.log("jsonContent: ", jsonContent);
          fs.writeFile("./uploads/towers.json", jsonContent, "utf8", function(
            err
          ) {
            if (err) {
              console.log(
                "An error occured while writing JSON Object to File."
              );
              return console.log(err);
            }

            console.log("JSON file has been saved.");
          });
        }
      );
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        //error deleting the file
      }
    } catch (e) {
      res.json({ error_code: 1, err_desc: "Corrupted excel file" });
    }
  });
});

//EXCEL UPLOAD SECTION ENDS HERE
