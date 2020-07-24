const fs = require('fs')
const path = require('path')
const config = require('config')
// const migrateTermsForResource = require('./src/migrateTermsForResource')
// const migrateTable = require('./src/migrateTable')
const syncService = require('./src/syncService')
const models = require('./src/models')
const logger = require('./src/common/logger')

// const progressInfo = require('./progress/progress.json')

const informixTableNames = {
  DocusignEnvelope: 'docusign_envelope',
  UserTermsOfUseXref: 'user_terms_of_use_xref'
}

async function clearTargetDatabase () {
  console.log('Clear target database')
  await models.sequelize.query(`delete from ${config.DB_SCHEMA_NAME}."UserTermsOfUseXref"`)
  await models.sequelize.query(`delete from ${config.DB_SCHEMA_NAME}."DocusignEnvelope"`)

  const filePath = path.join(__dirname, '/progress/progress.json')
  await fs.writeFileAsync(filePath, JSON.stringify({}, null, 4))
}

const steps = ['DocusignEnvelope', 'UserTermsOfUseXref']

async function sync () {
  logger.debug('Run Sync!!!')
  await syncService.migrateUserTerms()
  // await syncService.migrateDocusignEnvelopes()
  //get ids from UserTermsOfUseXref
  // look up in postres
  // if not, add

  //get ids from DocusignEnvelope
  // await syncService.docusignEnvelopes()
  // look up in postgres
  // if not, add
}

sync()
  .then(() => {
    console.log('Done')
    process.exit()
  })
  .catch(e => {
    console.log(e)
    process.exit(1)
  })
