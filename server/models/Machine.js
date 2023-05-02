const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const machineSchema = new Schema({
  macA: String,
  cpuLoad: Number,
  freeMemory: Number,
  totalMemory: Number,
  usedMem: Number,
  memUsage: Number,
  osType: String,
  upTime: Number,
  cpuModel: String,
  numOfCores: Number,
  cpuLoad: Number,
  cpuSpeed: Number,
});

module.exports = mongoose.model("Machine", machineSchema);
