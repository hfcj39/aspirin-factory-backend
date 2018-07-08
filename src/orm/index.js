const { orm } = require('./connection')
module.exports.orm = orm

module.exports.Question = require('./models/question.model')
