// const migrateTermsForResource = require('./src/migrateTermsForResource')
// const migrateTable = require('./src/migrateTable')
const syncService = require('./src/syncService')
const logger = require('./src/common/logger')

// const progressInfo = require('./progress/progress.json')

async function sync () {
  logger.debug('Run Sync!!!')
  const startDate = '2000-01-01'
  await syncService.migrateUserTerms(startDate)
  // await syncService.migrateDocusignEnvelopes(startDate)
  // get ids from UserTermsOfUseXref
  // look up in postres
  // if not, add

  // get ids from DocusignEnvelope
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
