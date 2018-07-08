const customHeaders = [
  'appkey',
  'aspirin-token'
].join(',')

module.exports = async function (ctx, next) {
  if (!ctx) {
    throw new Error('!ctx')
  }
  ctx.response.set('Access-Control-Allow-Origin', '*')
  ctx.response.set('Access-Control-Allow-Headers', 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization,' + customHeaders)
  ctx.response.set('Access-Control-Allow-Credentials', true)
  ctx.response.set('Access-Control-Allow-Methods', 'PATCH,PUT,POST,GET,DELETE,OPTIONS,HEAD')

  ctx.response.set('Access-Control-Expose-Headers', 'Date')
  if (ctx.request.method === 'OPTIONS') {
    ctx.status = 204
  }
  return next()
}
