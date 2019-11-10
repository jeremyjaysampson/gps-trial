import openSocket from "socket.io-client";
const socket = openSocket("http://raspberrypi.local:8000");

function subscribeToTimer(cb) {
  socket.on("timer", timestamp => cb(null, timestamp));
  socket.emit("subscribeToTimer", 2000);
}
export { subscribeToTimer };

function subscribeToGPS(cb) {
  // socket.on("gps", coord => cb(null, coord));
  socket.on("gps", data => cb(null, data));
  socket.emit("subscribeToGPS", 2000);
}
export { subscribeToGPS };
