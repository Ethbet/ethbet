const _ = require('lodash'),
  schedule = require('node-schedule');

let fairnessProofService = require('./lib/fairnessProofService');

console.log("Starting scheduler in environment :", process.env.NODE_ENV);

global.db = require('./models');

let recurringJobs = [];

// schedule createFairnessProof daily at midnight
recurringJobs.push({
  rule: {hour: 0, minute: 0},
  name: 'createFairnessProof',
});

// Schedule jobs
_.forEach(recurringJobs, function (recurringJob) {
  console.log("Scheduling kue job: " + recurringJob.name);
  schedule.scheduleJob(recurringJob.rule, function () {
    if (recurringJob.name === 'createFairnessProof') {
      console.log("Running createFairnessProof");
      fairnessProofService.create();
    }
  });
});