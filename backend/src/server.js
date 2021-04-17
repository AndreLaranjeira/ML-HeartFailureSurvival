// Package imports.
const schedule = require("node-schedule");

// Module imports.
const app = require("./app");
const jobs = require("./jobs");

// Schedule server jobs.
jobs.forEach(job => {
  schedule.scheduleJob(job.recurrenceRule, job.function);
});

// Server configuration.
app.listen(3333);
