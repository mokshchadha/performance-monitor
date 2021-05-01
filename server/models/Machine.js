const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Machine = new Schema({
  cpuLoad: Number,
  macA: String,
  freeMem: Number,
  totalMem: Number,
  usedMem: Number,
  memUsage: Number,
  osType: String,
  upTime: Number,
  cpuModal: String,
  numCores: Number,
  cpuSpeed: Number,
});

module.exports = mongoose.model("Machine", Machine);

/**cpuLoad,
    cpuModel: cpus_[0].model,
    upTime,
    totalMem,
    freeMem,
    usedMem: totalMem - freeMem,
    numCores: cpus_.length, */
