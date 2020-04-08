const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const _ = require('lodash')
const path = require('path')
const config = require('config')
const models = require('./models')
const logger = require('./common/logger')
const { executeQueryAsync } = require('./common/informixWrapper')
const { resolveTermsOfUseId, resolveAgreeabilityTypeId } = require('./common/utils')

const limit = config.BATCH_COUNT
const filePath = path.join(__dirname, '../progress/progress.json')

const oderByClause = {
  'terms_of_use': 'order by terms_of_use_id asc',
  'terms_of_use_agreeability_type_lu': 'order by terms_of_use_agreeability_type_id asc',
  'terms_of_use_dependency': 'order by dependency_terms_of_use_id asc, dependent_terms_of_use_id asc',
  'docusign_envelope': 'where is_completed = 1 order by docusign_envelope_id asc',
  'terms_of_use_docusign_template_xref': 'order by terms_of_use_id asc',
  'user_terms_of_use_ban_xref': 'order by terms_of_use_id asc, user_id asc',
  'user_terms_of_use_xref': 'order by terms_of_use_id asc, user_id asc'
}

const fieldsMapping = {
  DocusignEnvelope: {
    id: 'docusign_envelope_id',
    docusignTemplateId: 'docusign_template_id',
    userId: 'user_id',
    isCompleted: 'is_completed'
  },
  TermsOfUse: {
    legacyId: 'terms_of_use_id',
    text: 'terms_text',
    typeId: 'terms_of_use_type_id',
    title: 'title',
    url: 'url',
    agreeabilityTypeId: resolveAgreeabilityTypeId('terms_of_use_agreeability_type_id'),
    created: 'create_date',
    updated: 'modify_date'
  },
  TermsOfUseAgreeabilityType: {
    legacyId: 'terms_of_use_agreeability_type_id',
    name: 'name',
    description: 'description'
  },
  TermsOfUseDependency: {
    dependencyTermsOfUseId: resolveTermsOfUseId('dependency_terms_of_use_id'),
    dependentTermsOfUseId: resolveTermsOfUseId('dependent_terms_of_use_id')
  },
  TermsOfUseDocusignTemplateXref: {
    termsOfUseId: resolveTermsOfUseId('terms_of_use_id'),
    docusignTemplateId: 'docusign_template_id'
  },
  UserTermsOfUseBanXref: {
    userId: 'user_id',
    termsOfUseId: resolveTermsOfUseId('terms_of_use_id'),
    created: 'create_date'
  },
  UserTermsOfUseXref: {
    userId: 'user_id',
    termsOfUseId: resolveTermsOfUseId('terms_of_use_id'),
    created: 'create_date'
  }
}

const extraFieldValues = {
  TermsOfUse: {
    createdBy: 'admin',
    updatedBy: 'admin'
  }
}

async function process (informixTableName, modelName, lastSkip) {
  const databaseName = informixTableName === 'docusign_envelope' ? 'informixoltp' : 'common_oltp'
  const model = models[modelName]
  let skip = lastSkip
  while (true) {
    const data = await executeQueryAsync(databaseName,
      `select skip ${skip} limit ${limit} * from ${informixTableName} ${oderByClause[informixTableName]}`)
    if (data.length === 0) {
      break
    }
    let entities = []
    for (const element of data) {
      let entity = _.mapValues(fieldsMapping[modelName], (value, key) => {
        if (_.isFunction(value)) {
          return Promise.resolve(value(element))
        } else {
          if (!_.isNil(element[value])) {
            if (key === 'created' || key === 'updated') {
              return Promise.resolve(new Date(element[value]))
            } else {
              return Promise.resolve(element[value])
            }
          } else {
            if (key === 'created' || key === 'updated') {
              return Promise.resolve(new Date())
            }
          }
        }
      })
      entity = _.zipObject(_.keys(entity), await Promise.all(_.values(entity)))
      if (extraFieldValues[modelName]) {
        _.assign(entity, extraFieldValues[modelName])
      }

      entities.push(entity)
    }
    // handle entities
    await model.bulkCreate(entities, {raw: true})
    skip += data.length

    // write skip to file
    logger.info(
      `migrate from ${informixTableName} to ${modelName} ${skip - data.length + 1} ${skip}`)
    await fs.writeFileAsync(filePath, JSON.stringify({ modelName, skip }, null, 4))
  }

  await fs.writeFileAsync(filePath, JSON.stringify({ modelName, finishStep: true }, null, 4))
}

module.exports = {
  process
}
