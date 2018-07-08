const schedule = require('node-schedule')
const {updateDatabase} = require('./question.controller')

let rule = new schedule.RecurrenceRule()
rule.minute = 30
let j = schedule.scheduleJob(rule, updateDatabase)
