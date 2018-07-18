const Sequelize = require('sequelize')

const { orm } = require('../connection')
const { common, props, canbeDeleted } = require('./common')

module.exports = orm.define('tb_user', Object.assign({

  username: {
    type: Sequelize.STRING,
    comment: '用户名',
  },

  user_id: {
    type: Sequelize.INTEGER,
    unique: true,
    comment: '用户id',
  },


}, common, canbeDeleted), Object.assign({ tableName: 'tb_user' }, props))
