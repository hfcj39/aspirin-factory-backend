const router = require('koa-router')()
const { addQuestion, deleteQuestion, getQuestionList } = require('./question.controller')
const { ensureAuth } = require('./question.service')
const task = require('./question.task')

router.post('/add', ensureAuth, addQuestion)
router.post('/delete', ensureAuth, deleteQuestion)
router.post('/list', ensureAuth, getQuestionList)

module.exports = router
