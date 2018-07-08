const { ValidateError } = require('../utils/koa-param-validator')

module.exports = async function errorHandler(ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err instanceof Error && !(err instanceof ValidateError)) {
      // console.error('errorHandler: %j %j', err, err.stack)
      console.error('errorHandler: %s %s %j',
        ctx.request.method,
        ctx.request.url, {
          headers: ctx.headers,
          params: ctx.params,
          query: ctx.request.query,
          body: ctx.request.fields,
          err,
          stack: err.stack,
        })
    }

    if (typeof err === 'number') {
      ctx.status = err
      ctx.body = ''
      return
    }

    if (err.status) {
      ctx.status = 200
      ctx.body = err
      return
    }

    if (ctx.status === 404) {
      ctx.status = 200
    }
    ctx.body = {
      status: 500,
      error: err.message || err.toString(),
    }
    // console.log('errorHandler 500: %j', ctx.body)
  }
}
