const Validator = require('../../utils/koa-param-validator')
const request = require('request')
const { User } = require('../../orm')

const send = (options) => {
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        reject(err)
      }
      resolve(body)
    })
  })
}

const loginValidator = new Validator({
  email: { ctx: 'fields', type: 'string', required: true },
  password: { ctx: 'fields', type: 'string', required: true },
})
const login = async (ctx) => {
  const { email, password } = loginValidator.validate(ctx)
  // console.log(email, password)
  let options = {
    method: 'POST',
    url: 'https://server.longint.org/api/user/login',
    headers:
      {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'aspirin-token': '753621f0-7f60-11e8-b33c-39e29645ff59',
      },
    body: { email: email, password: password },
    json: true,
  }
  let rst = await send(options)
  // console.log(rst)
  if (rst.code && rst.code === 141) {
    ctx.status = 401
    return ctx.body = rst
  }
  let user = await User.findOne({
    where: {
      user_id: rst.id,
    },
    raw: true,
  })
  // console.log(user)
  if (user) {
    ctx.body = rst
  } else {
    ctx.status = 401
    ctx.body = {
      code: 141,
      message: '非授权用户不能登录此平台',
    }
  }
}

const list = async (ctx) => {
  let user_list = await User.findAll()
  ctx.body = user_list

}

const addUserValidator = new Validator({
  username: { ctx: 'fields', type: 'string', required: true },
  user_id: { ctx: 'fields', type: 'number', required: true },
})
const addUser = async (ctx) => {
  const { username, user_id } = addUserValidator.validate(ctx)
  let rst = await User.create({
    username: username,
    user_id: user_id,
  })
  ctx.body = rst
}

const deleteValidator = new Validator({
  user_id: { ctx: 'fields', type: 'number', required: true },
})
const removeUser = async (ctx) => {
  const { user_id } = deleteValidator.validate(ctx)
  try {
    let rst = await User.destroy({
      where: { user_id: user_id },
    })
    ctx.body = {
      status: 0,
      data: rst,
    }
  } catch (e) {
    console.error(e)
    ctx.body = {
      status: 1,
      error: e.errors[0].message || e.message,
    }
  }
}

module.exports = {
  login,
  list,
  addUser,
  removeUser
}
