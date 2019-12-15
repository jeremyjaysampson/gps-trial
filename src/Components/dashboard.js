import React, { useState } from "react";
import SerialPortParser from "@serialport/parser-readline";
import GPS from "gps";
import openSocket from "socket.io-client";
const socket = openSocket("http://raspberrypi.local:8000");

function Dashboard() {
  // var socket = io();

  socket.on("state", function(state) {
    updateSpeed(state);
    updateSatellite(state);
    updateTable(state);
    updateSkyView(state);
  });

  //Width and height
  var width = 500;
  var barHeight = 100;
  var padding = 1;

  var dataset = [];

  //Create SVG elements

  var svgSky = d3
    .select("body")
    .append("svg")
    .attr("width", 250)
    .attr("height", 250);

  var svgSat = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", barHeight + 50)
    .append("g");

  var svgSpeed = d3
    .select("body")
    .append("svg")
    .style("position", "fixed")
    .style("right", "10px")
    .style("bottom", "10px")
    .attr("width", 160)
    .attr("height", 160)
    .append("g");

  var centerX = 80;
  var centerY = 80;
  var path1 = [];
  var path2 = [];

  var start = 270; // °
  var end = -10; // °
  var startH = 0;
  var endH = 45;
  var stepH = 5;
  var n = endH - startH;

  function speedAngle(i) {
    return end + ((Math.min(i, endH) - endH) / (startH - endH)) * (start - end);
  }

  for (var i = 0; i <= n; i++) {
    var alpha = ((end + start - speedAngle(i)) / 180) * Math.PI;
    var path = path2;
    var r = 4;

    if (i % 5 === 0) {
      path = path1;
      r = 7;

      svgSpeed
        .append("text")
        .attr("x", centerX + Math.cos(alpha) * 60 - 5)
        .attr("y", centerY - Math.sin(alpha) * 60 + 5)
        .attr("font-weight", "bold")
        .attr("font-size", "10px")
        .text(endH - i);
    }

    path.push("M");
    path.push(centerX + Math.cos(alpha) * (r + 70));
    path.push(centerY - Math.sin(alpha) * (r + 70));
    path.push("L");
    path.push(centerX + Math.cos(alpha) * 70);
    path.push(centerY - Math.sin(alpha) * 70);
  }

  function arc(x, y, radius, startAngle, endAngle) {
    var start = {
      x: x + radius * Math.cos((endAngle * Math.PI) / 180),
      y: y - radius * Math.sin((endAngle * Math.PI) / 180)
    };

    var end = {
      x: x + radius * Math.cos((startAngle * Math.PI) / 180),
      y: y - radius * Math.sin((startAngle * Math.PI) / 180)
    };

    var a = startAngle - endAngle > 180 ? 1 : 0;
    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      a,
      0,
      end.x,
      end.y
    ].join(" ");
  }

  var speed = 0;

  var shadowSpeed = svgSpeed
    .append("path")
    .attr("d", arc(centerX, centerY, 72, start, speedAngle(speed)))
    .attr("fill", "none")
    .style("stroke-width", "3")
    .attr("stroke", "rgba(0, 220, 255, 0)");

  svgSpeed
    .append("path")
    .attr("d", path1.join(" "))
    .attr("fill", "none")
    .style("stroke-width", "2")
    .attr("stroke", "black");

  svgSpeed
    .append("path")
    .attr("d", path2.join(" "))
    .attr("fill", "none")
    .attr("stroke", "black");

  var direction = svgSpeed
    .append("path")
    .attr(
      "d",
      [
        "M",
        Math.cos(Math.PI / 2 + Math.PI) * 5,
        -Math.sin(Math.PI / 2 + Math.PI) * 5,
        "L",
        Math.cos(Math.PI / 4 + Math.PI) * 15,
        -Math.sin(Math.PI / 4 + Math.PI) * 15,
        "L",
        Math.cos(Math.PI / 2) * 20,
        -Math.sin(Math.PI / 2) * 20,
        "L",
        Math.cos(-Math.PI / 4) * 15,
        -Math.sin(-Math.PI / 4) * 15,
        "Z"
      ].join(" ")
    )
    .style("transform", "translate(" + centerX + "px," + centerY + "px)")
    .attr("fill", "#c00")
    .attr("stroke", "none");

  var circleSpeed = svgSpeed
    .append("circle")
    .attr("r", 4)
    .attr("cx", centerX + Math.cos((speedAngle(speed) / 180) * Math.PI) * 72)
    .attr("cy", centerY - Math.sin((speedAngle(speed) / 180) * Math.PI) * 72)
    .attr("fill", "white")
    .style("stroke-width", 2)
    .attr("stroke", "black");

  var textSpeed = svgSpeed
    .append("text")
    .attr("x", 90)
    .attr("y", 140)
    .attr("font-weight", "bold")
    .attr("font-size", "30px")
    .attr("fill", "black")
    .text(speed);

  svgSpeed
    .append("text")
    .attr("x", 95)
    .attr("y", 155)
    .attr("font-weight", "bold")
    .attr("font-size", "13px")
    .attr("fill", "black")
    .text("kph");

  svgSpeed
    .append("text")
    .attr("x", centerX - 30 - 4)
    .attr("y", centerY + 4)
    .attr("font-weight", "bold")
    .attr("font-size", "13px")
    .attr("fill", "black")
    .text("W");

  svgSpeed
    .append("text")
    .attr("x", centerX + 30 - 4)
    .attr("y", centerY + 4)
    .attr("font-weight", "bold")
    .attr("font-size", "13px")
    .attr("fill", "black")
    .text("E");

  svgSpeed
    .append("text")
    .attr("x", centerX - 4)
    .attr("y", centerY - 30 + 3)
    .attr("font-weight", "bold")
    .attr("font-size", "13px")
    .attr("fill", "black")
    .text("N");

  svgSpeed
    .append("text")
    .attr("x", centerX - 4)
    .attr("y", centerY + 30 + 7)
    .attr("font-weight", "bold")
    .attr("font-size", "13px")
    .attr("fill", "black")
    .text("S");

  function elevationToRadius(e) {
    // Degrees:
    // 0° has radius of 110
    // 90° has radius of 0

    return 110 * (1 - e / 90);
  }

  for (var i = 0; i < 90; i += 30) {
    svgSky
      .append("circle")
      .attr("cx", 125)
      .attr("cy", 125)
      .attr("r", elevationToRadius(i))
      .attr("fill", "none")
      .attr("stroke", "black");

    svgSky
      .append("text")
      .attr("x", elevationToRadius(i + 30) + 123)
      .attr("y", 125 + 9)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .attr("font-size", "8")
      .text(30 + i + "°");
  }

  svgSky
    .append("line")
    .attr("x1", 125)
    .attr("y1", 125 - elevationToRadius(30))
    .attr("x2", 125)
    .attr("y2", 125 + elevationToRadius(30))
    .attr("stroke", "black");

  svgSky
    .append("line")
    .attr("x1", 125 - elevationToRadius(30))
    .attr("y1", 125)
    .attr("x2", 125 + elevationToRadius(30))
    .attr("y2", 125)
    .attr("stroke", "black");

  var steps = 36;

  for (var i = 0; i < steps; i++) {
    var alpha = (i / steps - 90 / 360) * Math.PI * 2;

    var L = i % 3 === 0 ? 15 : 5;

    svgSky
      .append("line")
      .attr("x1", Math.cos(alpha) * 110 + 125)
      .attr("y1", Math.sin(alpha) * 110 + 125)
      .attr("x2", Math.cos(alpha) * (110 - L) + 125)
      .attr("y2", Math.sin(alpha) * (110 - L) + 125)
      .attr("stroke", "black");

    if (i % 3 == 0)
      svgSky
        .append("text")
        .attr("x", Math.cos(alpha) * 118 + 125)
        .attr("y", Math.sin(alpha) * 118 + 125 + 4)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("font-size", "8")
        .text(Math.round(90 + (alpha / Math.PI) * 180) + "°");
  }

  var satsGroup = svgSky.append("g");

  function updateSpeed(data) {
    var speed = data.speed;

    textSpeed.text(speed);

    direction.style(
      "transform",
      "translate(" +
        centerX +
        "px," +
        centerY +
        "px)rotate(" +
        data.bearing +
        "deg)"
    );

    circleSpeed
      .attr("cx", centerX + Math.cos((speedAngle(speed) / 180) * Math.PI) * 72)
      .attr("cy", centerY - Math.sin((speedAngle(speed) / 180) * Math.PI) * 72);

    shadowSpeed
      .attr("d", arc(centerX, centerY, 72, start, speedAngle(speed)))
      .attr("stroke", "rgba(0, 220, 255, " + speed / (endH - startH) + ")");
  }

  function updateSatellite(data) {
    var rect = svgSat.selectAll("rect").data(data.satsVisible);

    var text = svgSat.selectAll("text").data(data.satsVisible);

    rect.enter().append("rect");

    rect.enter().append("text");

    rect
      .attr("x", function(d, i) {
        return i * (width / data.satsVisible.length);
      })
      .attr("y", function(d) {
        var v = d.snr || 0;
        return barHeight - v * 4;
      })
      .attr("width", width / data.satsVisible.length - padding)
      .attr("height", function(d) {
        var v = d.snr || 0;
        return v * 4;
      })
      .attr("fill", function(d) {
        var v = d.snr || 0;
        if (-1 !== data.satsActive.indexOf(d.prn)) {
          return "rgb(0, 0, " + ((v * 10) | 0) + ")";
        }
        return "rgb(" + ((v * 10) | 0) + ", 0, 0)";
      });

    text
      .attr("x", function(d, i) {
        return 15 + i * (width / data.satsVisible.length);
      })
      .attr("y", barHeight + 20)
      .text(function(d) {
        return d.prn;
      })
      .attr("fill", "black");

    rect.exit().remove();

    text.exit().remove();
  }

  function updateSkyView(data) {
    satsGroup
      .selectAll("circle")
      .data(data.satsVisible)

      .enter()
      .append("circle")

      .attr("cx", function(d, i) {
        return (
          125 +
          Math.cos((d.azimuth / 180) * Math.PI - Math.PI / 2) *
            elevationToRadius(d.elevation)
        );
      })
      .attr("cy", function(d, i) {
        return (
          125 +
          Math.sin((d.azimuth / 180) * Math.PI - Math.PI / 2) *
            elevationToRadius(d.elevation)
        );
      })
      .attr("r", 5)
      .attr("fill", function(d) {
        var v = d.snr || 0;
        if (-1 !== data.satsActive.indexOf(d.prn)) {
          return "rgb(0, 0, " + ((v * 10) | 0) + ")";
        }
        return "rgb(" + ((v * 10) | 0) + ", 0, 0)";
      })

      .append("title")
      .text(function(d, i) {
        return d.prn;
      });
  }

  function updateTable(state) {
    $("#date").text(state.time);
    $("#lat").text(state.lat);
    $("#lon").text(state.lon);
    $("#alt").text(state.alt);
    $("#speed").text(state.speed);
    $("#status").text(state.fix);
    $("#pdop").text(state.pdop);
    $("#vdop").text(state.vdop);
    $("#hdop").text(state.hdop);

    $("#active").text(state.satsActive.length);
    $("#view").text(state.satsVisible.length);
  }

  return (
    <div>
      <body>
        <script src="/socket.io/socket.io.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.7.0/d3.js"></script>
        <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
        <h1>Satellites</h1>
        <h1>Information</h1>
        <table>
          <tr>
            <th>Date</th>
            <td id="date"></td>
          </tr>
          <tr>
            <th>Latitude</th>
            <td id="lat"></td>
          </tr>
          <tr>
            <th>Longitude</th>
            <td id="lon"></td>
          </tr>

          <tr>
            <th>Altitude</th>
            <td id="alt"></td>
          </tr>
          <tr>
            <th>Speed</th>
            <td id="speed"></td>
          </tr>
          <tr>
            <th>Status</th>
            <td id="status"></td>
          </tr>

          <tr>
            <th>PDOP</th>
            <td id="pdop"></td>
          </tr>
          <tr>
            <th>VDOP</th>
            <td id="vdop"></td>
          </tr>
          <tr>
            <th>HDOP</th>
            <td id="hdop"></td>
          </tr>
          <tr>
            <th>Satellites in Use</th>
            <td id="active"></td>
          </tr>
          <tr>
            <th>Satellites in View</th>
            <td id="view"></td>
          </tr>
        </table>
      </body>
    </div>
  );
}
export default Dashboard;
