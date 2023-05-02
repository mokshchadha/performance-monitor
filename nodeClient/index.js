const io = require("socket.io-client");

const { performanceData, getMacAddress } = require("./osInfo");

const socket = io("http://localhost:8181");

socket.on("connect", () => {
  const macAddress = getMacAddress();
  console.log(macAddress);

  socket.emit("clientAuth", "moksh16531");

  performanceData().then((allPerformanceData) =>
    socket.emit("initPerfData", { ...allPerformanceData, macA: macAddress })
  );

  const interval = setInterval(() => {
    performanceData().then((allPerformanceData) =>
      socket.emit("perfData", allPerformanceData)
    );
  }, 1000);

  socket.on("disconnect", (_) => clearInterval(interval));
});
