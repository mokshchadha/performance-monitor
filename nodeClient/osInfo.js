const os = require("os");

async function performanceData() {
  const osType = os.type() === "Darwin" ? "Mac" : os.type();

  const upTime = os.uptime();

  const freeMemory = os.freemem();

  const totalMemory = os.totalmem();
  const usedMem = totalMemory - freeMemory;

  const memUsage = Math.floor((usedMem / totalMemory) * 100) / 100;

  const cpus = os.cpus();
  const cpuModel = cpus[0].model;
  const cpuSpeed = cpus[0].speed;
  const numOfCores = cpus.length;
  const cpuLoad = await getCpuLoad();

  return {
    osType,
    upTime,
    freeMemory,
    totalMemory,
    usedMem,
    memUsage,
    cpuModel,
    cpuSpeed,
    numOfCores,
    cpuLoad,
  };
}

function cpuAvg() {
  let idleMs = 0;
  let totalMs = 0;

  const cpus = os.cpus();

  cpus.forEach((core) => {
    totalMs = totalMs + Object.values(core.times).reduce((a, e) => a + e, 0);
    idleMs = idleMs + core.times.idle;
  });

  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
}

function getCpuLoad() {
  const start = cpuAvg();

  return new Promise((resolve, _) => {
    setTimeout(() => {
      const end = cpuAvg();
      const idleDiff = end.idle - start.idle;
      const totalDiff = end.total - start.total;
      const percentageCPU = 100 - Math.floor(100 * (idleDiff / totalDiff));
      resolve(percentageCPU);
    }, 100);
  });
}

function getMacAddress() {
  const nI = os.networkInterfaces();
  let macA = "";
  for (let key in nI) {
    if (!nI[key][0].internal) {
      macA = nI[key][0].mac;
      break;
    }
  }
  return macA;
}

module.exports = { performanceData, getMacAddress };
