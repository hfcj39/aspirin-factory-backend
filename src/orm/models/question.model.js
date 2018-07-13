const Sequelize = require('sequelize')

const { orm } = require('../connection')
const { common, props, canbeDeleted } = require('./common')

module.exports = orm.define('tb_question', Object.assign({

  name: {
    type: Sequelize.STRING,
    comment: '题目名',
  },

  question_id: {
    type: Sequelize.INTEGER,
    unique: true,
    comment: '题目id',
  },

  category: {
    type: Sequelize.STRING,
    comment: '类别',
  },

  editor: {
    type: Sequelize.STRING,
    comment: '管理员',
  },

  note: {
    type: Sequelize.TEXT,
    comment: '备注',
  },

  contributor: {
    type: Sequelize.STRING,
    comment: '协作者（数组）',
  },

  hasContributeRecord: {
    type: Sequelize.BOOLEAN,
    comment: '是否有贡献记录',
  },

  hasAcceptedContributeRecord: {
    type: Sequelize.BOOLEAN,
    comment: '是否有通过的记录',
  },

  hasUnDealContributeRecord: {
    type: Sequelize.BOOLEAN,
    comment: '是否有待审核记录',
  },

  isAcceptedContributeRecordCodeMatchSelfData: {
    type: Sequelize.BOOLEAN,
    comment: '代码与自己数据是否符合',
  },

  isAcceptedContributeRecordCodeMatchQuestionData: {
    type: Sequelize.BOOLEAN,
    comment: '代码与题目数据是否符合',
  },

  hasRightCode: {
    type: Sequelize.BOOLEAN,
    comment: '参考代码',
  },

  hasDataPoint: {
    type: Sequelize.BOOLEAN,
    comment: '上传数据',
  },

  isRightCodeMatchData: {
    type: Sequelize.BOOLEAN,
    comment: '参考代码是否吻合',
  },

}, common, canbeDeleted), Object.assign({ tableName: 'tb_question' }, props))
