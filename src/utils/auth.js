const jwt = require('jwt-simple')
const moment = require('moment')

const createToken = (name) => {
  let period = moment().add(1, 'days').unix()
  let payload = {
    sub: name,
    iat: moment().unix(),
    exp: period,
  }
  let secret = 'ZnVja3NoaXQ='
  return jwt.encode(payload, secret)
}

const ensureAuthenticated = (ctx, next) => {
  //console.log(ctx.request.header['authorization'])
  if (!ctx.request.header['authorization']) {
    ctx.response.status = 401
    ctx.body = {
      status: 1,
      error: "缺少auth头，请重新登录",
    }
    return
  }
  let temp_token = ctx.request.header['authorization']
  let token = temp_token.split(' ')[1]
  //console.log(token);
  let secret = 'ZnVja3NoaXQ='
  let payload = null
  try {
    payload = jwt.decode(token, secret)
  } catch (err) {
    ctx.response.status = 401
    ctx.body = {
      status: 1,
      error: "Token有误，请重新登录",
    }
    return
  }
  if (payload.exp <= moment().unix()) {
    ctx.response.status = 401
    ctx.body = {
      status: 1,
      error: "Token超时，请重新登录",
    }
    return
  }
  ctx.username = payload.sub
  //console.log(ctx.username);
  return next()
}

module.exports = {
  createToken,
  ensureAuthenticated,
}
