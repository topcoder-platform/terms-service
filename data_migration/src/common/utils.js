const _ = require('lodash')

const models = require('../models')
const logger = require('./logger')

function resolveTermsOfUseId (column) {
  return async (element) => {
    let termsOfUse = await models['TermsOfUse'].findOne({ where: { legacyId: element[column] } })
    if (_.isNil(termsOfUse)) {
      throw new Error(`Terms of use with legacy ID ${element[column]} is not migrated yet!`)
    }
    return termsOfUse.id
  }
}

function resolveAgreeabilityTypeId (column) {
  return async (element) => {
    let type = await models['TermsOfUseAgreeabilityType'].findOne({ where: { legacyId: element[column] } })
    if (_.isNil(type)) {
      throw new Error(`Agreeability type with legacy ID ${element[column]} is not migrated yet!`)
    }
    return type.id
  }
}

module.exports = {
  resolveTermsOfUseId,
  resolveAgreeabilityTypeId
}
