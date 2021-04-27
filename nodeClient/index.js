const { uptime, cpus, totalmem, freemem, networkInterfaces } = require("os");
const io = require("socket.io-client");
let socket = io("http://127.0.0.1:8181");

socket.on("connect", () => {
  console.log("I connected to the server");
  const nI = networkInterfaces();
  let macA;
  for (let key in nI) {
    if (!nI[key][0].internal) {
      macA = nI[key][0].mac;
      break;
    }
  }

  socket.emit("clientAuth", "afdafdafafds");

  let perfDataInterval = setInterval(() => {
    performanceData().then((e) => {
      console.log(e);
      socket.emit("perfData", e);
    });
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(perfDataInterval);
  }); //clear out the older setInterval
});

const performanceData = async () => {
  const cpus_ = cpus();
  const cpuLoad = await getCpuLoad();
  const upTime = uptime();
  const totalMem = totalmem();
  const freeMem = freemem();
  return {
    cpuLoad,
    cpuModel: cpus_[0].model,
    upTime,
    totalMem,
    freeMem,
    usedMem: totalMem - freeMem,
    numCores: cpus_.length,
  };
};

function getCpuLoad() {
  const start = cpuAverage();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { idle, total } = cpuAverage();
      const idleDiff = start.idle - idle;
      const totalDiff = start.total - total;
      const percentageCpu = 100 - Math.floor((100 * idleDiff) / totalDiff);
      resolve(percentageCpu);
    }, 100);
  });
}

const cpuAverage = () => {
  let idleMs = 0;
  let totalMs = 0;
  const _cpus = cpus();
  _cpus.forEach((aCore) => {
    for (let type in aCore.times) {
      totalMs += aCore.times[type];
    }
    idleMs += aCore.times.idle;
  });
  return {
    idle: idleMs / _cpus.length,
    total: totalMs / _cpus.length,
  };
};

const x = performanceData().then((e) => console.log(e));
