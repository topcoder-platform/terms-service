const fs = require('fs')
const path = require('path')
const config = require('config')
const migrateTermsForResource = require('./src/migrateTermsForResource')
const migrateTable = require('./src/migrateTable')
const models = require('./src/models')
const logger = require('./src/common/logger')

const step = ['TermsForResource']
const progressInfo = require('./progress/progress.json')

const informixTableNames = {
  DocusignEnvelope: 'docusign_envelope',
  TermsOfUseAgreeabilityType: 'terms_of_use_agreeability_type_lu',
  TermsOfUse: 'terms_of_use',
  TermsOfUseDependency: 'terms_of_use_dependency',
  TermsOfUseDocusignTemplateXref: 'terms_of_use_docusign_template_xref',
  UserTermsOfUseBanXref: 'user_terms_of_use_ban_xref',
  UserTermsOfUseXref: 'user_terms_of_use_xref'
}

async function clearTargetDatabase () {
  console.log('Clear target database')
  await models.sequelize.query(`delete from ${config.DB_SCHEMA_NAME}."TermsForResource"`)
  await models.sequelize.query(`delete from ${config.DB_SCHEMA_NAME}."UserTermsOfUseXref"`)
  await models.sequelize.query(`delete from ${config.DB_SCHEMA_NAME}."UserTermsOfUseBanXref"`)
  await models.sequelize.query(`delete from ${config.DB_SCHEMA_NAME}."DocusignEnvelope"`)
  await models.sequelize.query(`delete from ${config.DB_SCHEMA_NAME}."TermsOfUseDocusignTemplateXref"`)
  await models.sequelize.query(`delete from ${config.DB_SCHEMA_NAME}."TermsOfUseDependency"`)
  await models.sequelize.query(`delete from ${config.DB_SCHEMA_NAME}."TermsOfUse"`)
  await models.sequelize.query(`delete from ${config.DB_SCHEMA_NAME}."TermsOfUseAgreeabilityType"`)

  const filePath = path.join(__dirname, '/progress/progress.json')
  await fs.writeFileAsync(filePath, JSON.stringify({}, null, 4))
}

const steps = ['TermsOfUseAgreeabilityType', 'TermsOfUse', 'TermsOfUseDependency', 'TermsOfUseDocusignTemplateXref', 'DocusignEnvelope', 'UserTermsOfUseBanXref', 'UserTermsOfUseXref', 'TermsForResource']

async function restart () {
  logger.debug('Restart migration!!!')
  await clearTargetDatabase()
  await migrateTable.process(informixTableNames['TermsOfUseAgreeabilityType'], 'TermsOfUseAgreeabilityType', 0)
  await migrateTable.process(informixTableNames['TermsOfUse'], 'TermsOfUse', 0)
  await migrateTable.process(informixTableNames['TermsOfUseDependency'], 'TermsOfUseDependency', 0)
  await migrateTable.process(informixTableNames['TermsOfUseDocusignTemplateXref'], 'TermsOfUseDocusignTemplateXref', 0)
  await migrateTable.process(informixTableNames['DocusignEnvelope'], 'DocusignEnvelope', 0)
  await migrateTable.process(informixTableNames['UserTermsOfUseBanXref'], 'UserTermsOfUseBanXref', 0)
  await migrateTable.process(informixTableNames['UserTermsOfUseXref'], 'UserTermsOfUseXref', 0)
  await migrateTermsForResource.process(0)
}

async function resume () {
  let step = 0
  if (!progressInfo.modelName) {
    return restart()
  } else {
    while (step < steps.length) {
      if (steps[step] === progressInfo.modelName) {
        break
      }
      step = step + 1
    }
  }
  if (step === steps.length) {
    throw new Error('Progress information is invalid, please check again.')
  }

  let lastSkip = 0
  if (progressInfo.finishStep) {
    step++
  } else {
    if (!progressInfo.skip || !Number.isInteger(progressInfo.skip) || progressInfo.skip < 0) {
      throw new Error('Progress information is invalid, please check again.')
    }
    lastSkip = progressInfo.skip
  }

  if (step === 8) {
    console.log('Already finish migration.')
    return
  }

  if (step === 7) {
    await migrateTermsForResource.process(lastSkip)
  } else {
    await migrateTable.process(informixTableNames[steps[step]], steps[step], lastSkip)
    for (let i = step + 1; i < 7; i++) {
      await migrateTable.process(informixTableNames[steps[i]], steps[i], 0)
    }
    await migrateTermsForResource.process(0)
  }
}

if (process.argv.length === 3) {
  if (process.argv[2] === 'force') {
    restart()
      .then(() => {
        console.log('Done')
        process.exit()
      })
      .catch(e => {
        console.log(e)
        process.exit(1)
      })
  } else if (process.argv[2] === 'clean') {
    clearTargetDatabase()
      .then(() => {
        console.log('Done')
        process.exit()
      })
      .catch(e => {
        console.log(e)
        process.exit(1)
      })
  }
} else {
  resume()
    .then(() => {
      console.log('Done')
      process.exit()
    })
    .catch(e => {
      console.log(e)
      process.exit(1)
    })
}
