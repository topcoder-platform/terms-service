/**
 * App constants
 */

const _ = require('lodash')
const config = require('config')
const logger = require('./src/common/logger')
const models = require('./src/models')

/**
 * The function that actually handles the document
 * All future document handlers must also follow the same method signature as used here
 * It accept termsOfUseId parameter and return a function which accept three parameters userId, tabs and transaction
 * userId The user for which to handle the document
 * tabs Arrays of objects which have tabLabel and tabValue parameters.
 * transaction the transaction object
 */
const termsOfUseHandler = (termsOfUseId = 0) => async (userId, tabs, transaction) => {
  try {
    const termsOfUse = await models.TermsOfUse.findByPk(termsOfUseId, { raw: true })
    if (_.isNull(termsOfUse)) {
      throw new Error(`No terms of use exists for id: ${termsOfUseId}`)
    }
    const ban = await models.UserTermsOfUseBanXref.findAll({
      where: { userId, termsOfUseId },
      raw: true
    })
    if (ban.length !== 0) {
      logger.error(`User with id: ${userId} is not allowed to accept terms of use with id: ${termsOfUseId}`)
      return
    }
    const exists = await models.UserTermsOfUseXref.findAll({
      where: { userId, termsOfUseId },
      raw: true
    })
    if (exists.length !== 0) {
      logger.warn(`User with id: ${userId} has already accepted terms of use with id: ${termsOfUseId}`)
      return
    }
    await models.UserTermsOfUseXref.create({
      userId,
      termsOfUseId,
      created: new Date()
    }, { transaction })
  } catch (err) {
    const e = new Error(`Unable to process terms of use. The reason is: ${err.message}. Try again later.`)
    e.cause = err
    e.temporary = true
    throw e
  }
}

const Templates = [{
  name: 'W9',
  templateId: config.DOCUSIGN.W9TEMPLATE_ID,
  handlers: []
}, {
  name: 'W-8BEN',
  templateId: config.DOCUSIGN.W8BEN_TEMPLATE_ID,
  handlers: []
}, {
  name: 'TopCoder Assignment v2.0',
  templateId: config.DOCUSIGN.ASSIGNMENT_V2_TEMPLATE_ID,
  handlers: [ termsOfUseHandler(config.DOCUSIGN.ASSIGNMENT_TERMS_OF_USE_ID) ]
}, {
  name: 'Appirio Mutual NDA',
  templateId: config.DOCUSIGN.NDA_TEMPLATE_ID,
  handlers: []
}, {
  name: 'Affidavit',
  templateId: config.DOCUSIGN.AFFIDAVIT_TEMPLATE_ID,
  handlers: []
}]

const UserRoles = {
  Admin: 'Administrator'
}

const Scopes = {
  Terms: {
    Read: 'terms:read',
    Write: 'terms:write'
  }
}

module.exports = {
  Templates,
  AGREE_FOR_DOCUSIGN_TEMPLATE: 4,
  ELECT_AGREEABLE: 'Electronically-agreeable',
  TEMPLATE_ID_INVALID: 'TEMPLATE_ID_INVALID',
  UserRoles,
  Scopes
}
