'use strict'

const config = require('config')
const table = { schema: config.DB_SCHEMA_NAME, tableName: 'TermsOfUse' }

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(table, 'key', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn(table, 'isPublished', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }),
      queryInterface.addColumn(table, 'version', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '1.0.0'
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(table, 'key'),
      queryInterface.removeColumn(table, 'isPublished'),
      queryInterface.removeColumn(table, 'version')
    ])
  }
}
