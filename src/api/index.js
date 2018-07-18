const Router = require('koa-router')
const router = new Router()

const question = require('./question')
const user = require('./user')

router.use('/question', question.routes(), question.allowedMethods())
router.use('/user', user.routes(), user.allowedMethods())

module.exports = router
