const request = require("request")

const fetch = (options) => {
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        reject(err)
      }
      resolve(body)
    })
  })
}

const ensureAuth = async (ctx, next) => {
  if (!ctx.request.header['aspirin-token']) {
    ctx.response.status = 401
    return ctx.body = {
      status: 1,
      error: "缺少auth头，请重新登录",
    }
  }
  let token = ctx.request.header['aspirin-token']
  let options = {
    method: 'POST',
    url: 'http://116.62.205.12:3000/api/user/fetchProfile',
    headers:
      {
        'cache-control': 'no-cache',
        'aspirin-token': token,
      },
  }
  let rst = await fetch(options)
  let rst_json = JSON.parse(rst)
  if (rst_json.code) {
    return ctx.body = {
      status: 1,
      error: rst_json.message,
    }
  }
  return next()
}

module.exports = {
  ensureAuth,
}
