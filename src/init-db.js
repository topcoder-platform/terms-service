/**
 * Sync the database models to db tables.
 */
const models = require('./models')
const logger = require('./common/logger')

const initDB = async () => {
  await models.sequelize.dropSchema('termsdb')
  await models.sequelize.createSchema('termsdb')
  await models.sequelize.sync({ force: true })
}

if (!module.parent) {
  initDB().then(() => {
    logger.info('Database synced successfully')
    process.exit()
  }).catch((e) => {
    logger.logFullError(e)
    process.exit(1)
  })
}

module.exports = {
  initDB
}
