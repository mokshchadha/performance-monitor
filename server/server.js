// entrypoint for our cluster which will make workers
// and the workers will do the Socket.io handling
//See https://github.com/elad/node-cluster-socket.io

const express = require("express");
const cluster = require("cluster");
const net = require("net");
const socketio = require("socket.io");
// const helmet = require('helmet')
const socketMain = require("./socketMain");
// const expressMain = require('./expressMain');

const port = 8181;
const num_processes = require("os").cpus().length;

const io_redis = require("socket.io-redis");
const farmhash = require("farmhash");

if (cluster.isMaster) {
  let workers = [];

  const spawn = function (i) {
    workers[i] = cluster.fork();
    workers[i].on("exit", function (code, signal) {
      spawn(i);
    });
  };

  for (var i = 0; i < num_processes; i++) {
    spawn(i);
  }

  const server = net.createServer({ pauseOnConnect: true }, (connection) => {
    // Master server
    const idx = getWorkerIndex(connection.remoteAddress, num_processes);
    const worker = workers[idx];
    worker.send("sticky-session:connection", connection); // this is captured in process.on('message') for the worker
  });
  //
  server.listen(port);
  console.log(`Master listening on port ${port}`);
  //
} else {
  let app = express();
  const server = app.listen(0, "localhost"); // this is our internal server and we dont pass port here because master is already active on that port
  const io = socketio(server);

  io.adapter(io_redis({ host: "localhost", port: 6379 }));

  io.on("connection", function (socket) {
    socketMain(io, socket);
    console.log(`connected to worker: ${cluster.worker.id}`);
  });

  process.on("message", function (message, connection) {
    // this is message that is triggered from the master , rest all ignored
    if (message === "sticky-session:connection") {
      server.emit("connection", connection);
      connection.resume();
    }
  });
}

function getWorkerIndex(ip) {
  return farmhash.fingerprint32(ip) % num_processes;
}
