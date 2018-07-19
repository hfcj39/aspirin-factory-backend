const request = require("request")
const { Question } = require('./src/orm/index')

let options = {
  method: 'POST',
  url: 'https://server.longint.org/api/question/listByTag',
  headers:
    {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
    },
  body:
    {
      certificateOnly: false,
      difficulty: [1, 10],
      order: [],
      page: 1,
      pageSize: 134,
      tagName: 'PPCA-TODO',
    },
  json: true,
}

request(options, async function (error, response, body) {
  if (error) throw new Error(error)
  // console.log(body.list)
  for (let item of body.list) {
    await Question.create({
      name: item.topic,
      question_id: item.id,
      editor: 'admin',
      category: '算法基础',
    })
  }
})

