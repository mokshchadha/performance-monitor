const Machine = require("./models/Machine");
const { CLIENT_IDS, UI_IDS } = require("./constants");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/perfData", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
let macA = "";
function socketMain(io, socket) {
  console.log("in here, socket main ", socket.id);
  if (socket.id) {
    socket.on("clientAuth", (key) => {
      console.log("the key is ", key);
      if (CLIENT_IDS.includes(key)) {
        console.log("node client ", key, " has joined");
        socket.join("clients");
      } else if (UI_IDS.includes(key)) {
        console.log("react client ", key, " has joined");
        socket.join("ui");
      } else socket.disconnect(true);
    });
    socket.on("initPerfData", async (data) => {
      macA = data.macA;
      const response = await checkAndAdd(data);
    });
    socket.on("perfData", (d) => {
      io.to("ui").emit("data", d);
    });
  }
}

async function checkAndAdd(data) {
  const res = await Machine.findOne({ macA: data.macA });
  console.log(res);
  return res ?? new Machine(data).save();
}

module.exports = { socketMain };
