// Job collections imports.
const PredictionJobs = require("./prediction_jobs");

// List of active jobs.
const jobs = [
  PredictionJobs.processBacklog
];

// Export module.
module.exports = jobs;
