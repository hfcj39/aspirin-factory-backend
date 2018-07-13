const { Question } = require('../../orm')
const request = require('request')
const Validator = require('../../utils/koa-param-validator')

const getStatus = (options) => {
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) {
        reject(err)
      }
      resolve(body)
    })
  })
}

const createValidator = new Validator({
  questionId: { ctx: 'fields', type: 'number', required: true },
  editor: { ctx: 'fields', type: 'string', required: true },
  category: { ctx: 'fields', type: 'string', required: true },
  name: { ctx: 'fields', type: 'string', required: true },
  note: { ctx: 'fields', type: 'string', required: false },
})
const addQuestion = async (ctx) => {
  const { questionId, name, editor, category, note } = createValidator.validate(ctx)
  let options = {
    method: 'POST',
    url: 'http://116.62.205.12:3000/api/factory/queryMissionStatusByQuestionId',
    headers:
      {
        'factory-token': 'fJCfuEuzWNzZdGTooREkVotP7DkMVGhx',
        'content-type': 'application/json',
      },
    body: { questionId: questionId },
    json: true,
  }
  let collaborator_options = {
    method: 'POST',
    url: 'https://server.longint.org/api/collaborator/listByQuestionId',
    headers:
      {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'aspirin-token': 'c60eb9c0-8528-11e8-945e-8f4b7dfeff88',
      },
    body: { questionId: questionId },
    json: true,
  }
  try {
    let rst = await getStatus(options)
    let collaborator_rst = await getStatus(collaborator_options)
    let contributor = []
    for (let user of collaborator_rst) {
      contributor.push({
        username: user.user.username,
        user_id: user.user.id,
      })
    }
    if (rst.code) {
      return ctx.body = {
        status: 1,
        error: rst.message,
      }
    }
    let db_rst = await Question.create({
      question_id: questionId,
      name: name,
      editor: editor,
      category: category,
      contributor: JSON.stringify(contributor),
      note: note,
      ...rst,
    })
    ctx.body = {
      status: 0,
      data: db_rst,
    }
  } catch (e) {
    console.error(e)
    ctx.body = {
      status: 1,
      error: e.errors[0].message || e.message,
    }
  }
}

const deleteValidator = new Validator({
  questionId: { ctx: 'fields', type: 'number', required: true },
})
const deleteQuestion = async (ctx) => {
  const { questionId } = deleteValidator.validate(ctx)
  try {
    let rst = await Question.destroy({
      where: { question_id: questionId },
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

const getQuestionList = async (ctx) => {
  let rst = await Question.findAll()
  ctx.body = {
    status: 0,
    data: rst,
  }
}

const updateDatabase = async (ctx) => {
  let list = await Question.findAll({
    raw: true,
  })
  for (let q of list) {
    let options = {
      method: 'POST',
      url: 'http://116.62.205.12:3000/api/factory/queryMissionStatusByQuestionId',
      headers:
        {
          'factory-token': 'fJCfuEuzWNzZdGTooREkVotP7DkMVGhx',
          'content-type': 'application/json',
        },
      body: { questionId: q.id },
      json: true,
    }
    let collaborator_options = {
      method: 'POST',
      url: 'https://server.longint.org/api/collaborator/listByQuestionId',
      headers:
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'aspirin-token': 'c60eb9c0-8528-11e8-945e-8f4b7dfeff88',
        },
      body: { questionId: q.id },
      json: true,
    }
    let new_rst = await getStatus(options)
    let collaborator_rst = await getStatus(collaborator_options)
    let contributor = []
    for (let user of collaborator_rst) {
      contributor.push({
        username: user.user.username,
        user_id: user.user.id,
      })
    }
    // console.log(q.id, new_rst)
    try {
      await Question.update({
        contributor: JSON.stringify(contributor),
        ...new_rst,
      }, {
        where: { question_id: q.id },
      })
    } catch (e) {
      console.error(e)
    }

  }
}

module.exports = {
  getQuestionList,
  addQuestion,
  deleteQuestion,
  updateDatabase,
}
