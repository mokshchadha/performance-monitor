const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/perfData", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
function socketMain(io, socket) {
  console.log("in here, socket main ", socket.id);
  if (socket.id) {
    socket.on("clientAuth", (key) => {
      if ([].includes(key)) {
        //valid clients
      } else {
        //invalid client disconnect immediately stopping reconnect
        //socket.disconnect(true);  //BE CAREFUL USING SOCKET.DISSCONNECT
      }
    });

    socket.on("perfData", (d) => console.log(d));
  }
}

module.exports = { socketMain };
