const _ = require('lodash'),
  schedule = require('node-schedule');

let fairnessProofService = require('./lib/fairnessProofService');
let etherBetService = require('./lib/etherBetService');

const web3Service = require('./lib/web3Service');

console.log("Starting scheduler in environment :", process.env.NODE_ENV);

global.db = require('./models');

// Starting web3 provider unless in test mode
if (process.env.NODE_ENV !== "test") {
  web3Service.init();
}

let recurringJobs = [];

// schedule createFairnessProof daily at midnight
recurringJobs.push({
  rule: { hour: 0, minute: 0 },
  name: 'createFairnessProof',
});

// schedule checkPendingEtherBets every 15 minutes
recurringJobs.push({
  rule: "0,15,30,45 * * * *",
  name: 'checkPendingEtherBets',
});

// Schedule jobs
_.forEach(recurringJobs, function (recurringJob) {
  console.log("Scheduling kue job: " + recurringJob.name);
  schedule.scheduleJob(recurringJob.rule, function () {
    if (recurringJob.name === 'createFairnessProof') {
      console.log("Running createFairnessProof");
      fairnessProofService.create();
    }
    else if (recurringJob.name === 'checkPendingEtherBets') {
      console.log("Running checkPendingEtherBets");
      etherBetService.checkPendingBets();
    }
  });
});