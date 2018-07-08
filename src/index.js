const logger = require('koa-logger')
const Router = require('koa-router')
const body = require('koa-better-body')
const cors = require('./middlewares/cors')
const errorHandler = require('./middlewares/errorHandler')
const api = require('./api')

module.exports = app => {
  app.use(cors)
  app.use(body({ strict: false }))
  app.use(errorHandler)
  if (process.env.NODE_ENV !== 'production') {
    app.use(logger())
  }
  const route = new Router()
  route.use('/api', api.routes(), api.allowedMethods())
  app
    .use(route.routes())
    .use(route.allowedMethods())
  return app
}
