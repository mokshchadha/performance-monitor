const express = require("express");
const cluster = require("cluster");
const net = require("net");
const socketio = require("socket.io");
const { socketMain } = require("./socketMain");

const port = 8181;
const num_processes = require("os").cpus().length;
const io_redis = require("socket.io-redis");
const farmhash = require("farmhash");

if (cluster.isMaster) {
  let workers = [];
  let spawn = function (i) {
    workers[i] = cluster.fork();
    workers[i].on("exit", function (code, signal) {
      spawn(i);
    });
  };
  for (var i = 0; i < num_processes; i++) {
    spawn(i);
  }
  const worker_index = function (ip, len) {
    return farmhash.fingerprint32(ip) % len;
  };

  const server = net.createServer({ pauseOnConnect: true }, (connection) => {
    let worker = workers[worker_index(connection.remoteAddress, num_processes)];
    worker.send("sticky-session:connection", connection);
  });
  server.listen(port);
  console.log(`Master listening on port ${port}`);
} else {
  let app = express();
  const server = app.listen(0, "localhost");
  const io = socketio(server);

  io.adapter(io_redis({ host: "localhost", port: 6379 }));
  io.on("connection", function (socket) {
    socketMain(io, socket);
    console.log(`connected to worker: ${cluster.worker.id}`);
  });
  process.on("message", function (message, connection) {
    if (message !== "sticky-session:connection") {
      return;
    }
    server.emit("connection", connection);

    connection.resume();
  });
}

socketMain("", "");
