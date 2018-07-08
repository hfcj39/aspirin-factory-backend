const Router = require('koa-router')
const router = new Router()

const question = require('./question')

router.use('/question', question.routes(), question.allowedMethods())

module.exports = router
