const { orm } = require('./src/orm')

// console.log(orm)
orm.sync({ alter: false })
  .then(async () => {
    console.log('数据库初始化中...')
    console.log('sync done！')
    console.log('自动退出脚本...')
    process.exit(0)
  })
  .catch((e) => {
    console.log('failed with: ' + e)
    process.exit(0)
  })
