const { uptime, cpus, totalmem, freemem } = require("os");

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