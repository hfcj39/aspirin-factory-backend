const config = require('../configs')
const Sequelize = require('sequelize')

const orm = new Sequelize(config.db.database, config.db.username, config.db.password, {
  dialect: config.db.dialect,
  pool: config.db.poolSize,
  storage: config.db.storage,
  benchmark: true,
  logging: false,
  // dialectOptions: {
  //   // debug: true,
  //   useUTC: false //for reading from database
  // },
  define: {
    hooks: {
      beforeUpdate: instance => {
        instance.update_time = new Date()
      },
    },
  },
})

const db = `${config.db.dialect}`

orm
  .authenticate()
  .then(() => {
    console.log(`Connection to ${db} has been established successfully.`)
  })
  .catch(err => {
    console.error(`Unable to connect to the ${db}:`, err)
  })

exports.orm = orm
