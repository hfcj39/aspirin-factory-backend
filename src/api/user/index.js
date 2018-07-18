const router = require('koa-router')()
const { login, list, addUser, removeUser } = require('./user.controller')

router.post('/login', login)
router.post('/list', list)
router.post('/add', addUser)
router.post('/remove', removeUser)

module.exports = router
