const Sequelize = require('sequelize')

exports.common = {

  add_time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },

  update_time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },

  add_user: Sequelize.STRING(30),

  update_user: Sequelize.STRING(30)

}

exports.canbeDeleted = {
  deleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0
  }
}

exports.props = {
  timestamps: false
}
