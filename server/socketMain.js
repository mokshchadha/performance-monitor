const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/perfData", { useNewUrlParser: true });

const Machine = require("./models/Machine");

function socketMain(io, socket) {
  let macA;
  socket.on("clientAuth", (key) => {
    if (key === "moksh16531") {
      socket.join("clients");
    } else if (key === "ui_moksh16531") {
      socket.join("ui_clients"); // joining a room allows us to communincate with that particular group
    } else {
      console.log("Invalid client has joined", key);
      socket.disconnect(true);
    }
  });

  socket.on("initPerfData", (data) => {
    macA = data.macA;
    checkAndAdd(data);
  });

  socket.on("perfData", (data) => {
    console.log(data);
    io.to("ui_clients").emit("data", data);
  });
}

async function checkAndAdd(data) {
  const res = await Machine.findOne({ macA: data.macA });
  if (!res) {
    let newMachine = new Machine(data);
    newMachine.save();
  }
}

module.exports = socketMain;

// HENCE by creating rooms we can allow and send notifications based on our user group requirements
