const { executeQueryAsync } = require('./common/informixWrapper')
const logger = require('./common/logger')
const models = require('./models')
// const { post } = require('superagent')
const UserTermsOfUseXref = models.UserTermsOfUseXref
const DocusignEnvelope = models.DocusignEnvelope
// const sequelize = require('sequelize')
const Sequelize = require('sequelize')
const config = require('config')
const { difference, find } = require('lodash')
const sequelize = new Sequelize(config.get('POSTGRES_URL'), {
  logging: false
})

// const SYNC_START_DATE = '2020-01-01'

async function migrateUserTerms (startDate) {
  const informixTableName = 'user_terms_of_use_xref'
  const databaseName = 'common_oltp'
  let running = true
  let skip = 0
  let limit = 20

  while (running) {
  // get terms from informix
    const query = `select skip ${skip} limit ${limit} DISTINCT(terms_of_use_id) from ${informixTableName} order by terms_of_use_id asc`
    const data = await executeQueryAsync(databaseName, query)
    logger.warn(`Number of Terms: ${data.length}`)
    if (data.length < 1) running = false
    for (let i = 0; i < data.length; i += 1) {
      const termsOfUseId = data[i].terms_of_use_id
      const userQuery = `select * from ${informixTableName} WHERE terms_of_use_id = ${termsOfUseId} AND create_date > DATE("${startDate}") order by user_id asc`
      // logger.debug(`userQuery ${JSON.stringify(userQuery)}`)
      const userData = await executeQueryAsync(databaseName, userQuery)
      const oldIds = userData.map(r => r.user_id)
      if (oldIds.length > 0) {
        const postgresTermsOfUseInfoQuery = `select "id", "legacyId" from ${config.DB_SCHEMA_NAME}."TermsOfUse" tu 
          where tu."legacyId" = ${termsOfUseId}`
        const [infoResult] = await sequelize.query(postgresTermsOfUseInfoQuery)

        // logger.debug(`Checking ${JSON.stringify(infoResult)}`)

        const postgresTermsOfUseQuery = `select ux.*, tu."legacyId" from ${config.DB_SCHEMA_NAME}."UserTermsOfUseXref" ux
          left join ${config.DB_SCHEMA_NAME}."TermsOfUse" tu on ux."termsOfUseId" = tu.id
          where ux.created > '${startDate}' AND tu."legacyId" = ${termsOfUseId}`

        // logger.debug(`postgres ${JSON.stringify(postgresTermsOfUseQuery)}`)
        // const newUserTerms = await UserTermsOfUseXref.findAll(postgresTermsOfUseQuery)
        const [results] = await sequelize.query(postgresTermsOfUseQuery)
        // logger.debug(`Old IDs: ${JSON.stringify(oldIds)}`)
        let idsToAdd = []
        if (results.length > 0) {
          // logger.debug(JSON.stringify(results))
          const newIds = results.map(r => r.userId)
          // logger.debug(`New IDs: ${JSON.stringify(newIds)}`)
          idsToAdd = difference(oldIds, newIds)
        } else {
          // logger.debug(`New IDs: none`)
          idsToAdd = oldIds
        }
        logger.debug(`User IDs to Add to V5 for Terms ID: ${infoResult[0].id} - ${JSON.stringify(idsToAdd.length)}`)

        if (idsToAdd.length > 0) {
          // const toAdd = []
          for (const id of idsToAdd) {
            // logger.debug(`Finding ${JSON.stringify({ user_id: id })} in ${JSON.stringify(userData)}`)
            const obj = find(userData, { user_id: id })
            // logger.debug(`Found ${JSON.stringify(obj.create_date)}`)
            logger.debug(`Creating Entry: ${JSON.stringify({
              userId: id,
              termsOfUseId: infoResult[0].id,
              created: obj.create_date
            })}`)
            await UserTermsOfUseXref.create({
              userId: id,
              termsOfUseId: infoResult[0].id,
              created: obj.create_date
            })
          }
        } else {
          logger.debug(`IDs in Informix and Postgres are in sync`)
        }
      } else {
        logger.debug(`No Records, Skipping id: ${data[i].terms_of_use_id}`)
      }
    // running = false
    }
    skip += data.length
  }
}

async function migrateDocusignEnvelopes () {
  const informixTableName = 'docusign_envelope'
  const databaseName = 'informixoltp'
  let running = true
  let skip = 0
  let limit = 50

  while (running) {
    logger.debug(`-- Running skip ${skip}`)
    // get terms from informix
    const query = `select skip ${skip} limit ${limit} * from ${informixTableName} where is_completed = 1 order by docusign_envelope_id asc`
    const data = await executeQueryAsync(databaseName, query)
    // logger.warn(`Number of Envelopes: ${data.length}`)
    if (data.length < 1) running = false
    for (let i = 0; i < data.length; i += 1) {
      const obj = data[i]
      const newObj = { id: obj.docusign_envelope_id, docusignTemplateId: obj.docusign_template_id, userId: obj.user_id }
      const docusignResult = await DocusignEnvelope.findOne({ where: newObj })

      // logger.debug(`Result: ${JSON.stringify(docusignResult)}`)
      if (!docusignResult) {
        newObj.isCompleted = obj.is_completed
        await DocusignEnvelope.create(newObj)
        logger.debug(`Create New Entry ${JSON.stringify(newObj)}`)
      } else {
        // logger.debug(`Found Envelope ${obj.docusign_envelope_id}`)
      }
    }
    skip += data.length
  }
}

module.exports = {
  migrateUserTerms,
  migrateDocusignEnvelopes
}
