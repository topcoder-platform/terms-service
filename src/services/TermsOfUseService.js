/**
 * This service provides operations of TermsOfUse.
 */

const _ = require('lodash')
const Joi = require('joi')
const logger = require('../common/logger')
const errors = require('../common/errors')
const models = require('../models')
const { AGREE_FOR_DOCUSIGN_TEMPLATE, ELECT_AGREEABLE } = require('../../app-constants')

const TermsOfUse = models.TermsOfUse
const UserTermsOfUseXref = models.UserTermsOfUseXref
const UserTermsOfUseBanXref = models.UserTermsOfUseBanXref
const TermsOfUseDependency = models.TermsOfUseDependency

/**
 * Get terms of use by id
 * @param {Object} currentUser the user who perform this operation.
 * @param {Number} termsOfUseId the terms of use id
 * @param {Object} query the query object
 * @returns {Object} the terms of use
 */
async function getTermsOfUse (currentUser, termsOfUseId, query) {
  const noauth = query.noauth === 'true'
  if (!noauth && !currentUser) {
    throw new errors.UnauthorizedError('Authentication credential was missing.')
  }

  const include = [
    {
      model: models.TermsOfUseAgreeabilityType,
      attributes: [['name', 'agreeabilityType']]
    },
    {
      model: models.TermsOfUseDocusignTemplateXref,
      attributes: ['docusignTemplateId']
    }
  ]
  if (!noauth) {
    include.push({
      model: UserTermsOfUseXref,
      where: { userId: currentUser.userId },
      attributes: ['userId'],
      required: false
    })
  }

  // get terms of use
  const result = await TermsOfUse.findAll({
    attributes: ['id', 'title', 'url', 'text', 'agreeabilityTypeId'],
    include,
    where: { id: termsOfUseId },
    raw: true
  })
  if (result.length === 0) {
    throw new errors.NotFoundError(`Terms of use with id: ${termsOfUseId} doesn't exists.`)
  }
  const termsOfUse = result[0]
  if (!noauth) {
    termsOfUse.agreed = !_.isNull(termsOfUse['UserTermsOfUseXrefs.userId'])
    delete termsOfUse['UserTermsOfUseXrefs.userId']
  }
  termsOfUse.docusignTemplateId = termsOfUse['TermsOfUseDocusignTemplateXref.docusignTemplateId']
  delete termsOfUse['TermsOfUseDocusignTemplateXref.docusignTemplateId']
  termsOfUse.agreeabilityType = termsOfUse['TermsOfUseAgreeabilityType.agreeabilityType']
  delete termsOfUse['TermsOfUseAgreeabilityType.agreeabilityType']
  if (termsOfUse.agreeabilityTypeId === AGREE_FOR_DOCUSIGN_TEMPLATE) {
    // check whether this is for docusign template and that template exists
    if (_.isNull(termsOfUse.docusignTemplateId)) {
      throw new errors.InternalServerError('Docusign template id is missing.')
    }
  } else {
    delete termsOfUse.docusignTemplateId
  }
  delete termsOfUse.agreeabilityTypeId

  return _.omitBy(termsOfUse, _.isNull)
}

getTermsOfUse.schema = {
  currentUser: Joi.any(),
  termsOfUseId: Joi.numberId(),
  query: Joi.object().keys({
    noauth: Joi.string()
  })
}

/**
 * Agree terms of use
 * @param {Object} currentUser the user who perform this operation.
 * @param {Number} termsOfUseId the terms of use id
 * @returns {Object} successful message if user agree terms of use successfully
 */
async function agreeTermsOfUse (currentUser, termsOfUseId) {
  // get terms of use
  const result = await TermsOfUse.findAll({
    include: [{
      model: models.TermsOfUseAgreeabilityType,
      attributes: [['name', 'agreeabilityType']]
    }],
    where: { id: termsOfUseId },
    raw: true
  })
  if (result.length === 0) {
    throw new errors.NotFoundError(`Terms of use with id: ${termsOfUseId} doesn't exists.`)
  }
  if (result[0]['TermsOfUseAgreeabilityType.agreeabilityType'] !== ELECT_AGREEABLE) {
    throw new errors.BadRequestError('The term is not electronically agreeable.')
  }

  // check whether user has agreed before
  const exist = await UserTermsOfUseXref.findAll({
    where: { userId: currentUser.userId, termsOfUseId }
  })
  if (exist.length > 0) {
    throw new errors.BadRequestError('You have agreed to this terms of use before.')
  }

  // check user has agreed all dependency terms of use
  const dependency = await TermsOfUseDependency.findAll({
    attributes: [],
    include: [
      {
        model: UserTermsOfUseXref,
        attributes: ['userId'],
        where: { userId: currentUser.userId },
        required: false
      }
    ],
    where: { dependentTermsOfUseId: termsOfUseId },
    raw: true
  })
  for (let i = 0; i < dependency.length; i++) {
    if (_.isNull(dependency[i]['UserTermsOfUseXrefs.userId'])) {
      throw new errors.BadRequestError(`You can't agree to this terms of use before you have agreed to all the dependencies terms of use.`)
    }
  }

  // check whether user is banned
  const ban = await UserTermsOfUseBanXref.findAll({
    where: { userId: currentUser.userId, termsOfUseId }
  })
  if (ban.length > 0) {
    throw new errors.ForbiddenError('Sorry, you can not agree to this terms of use.')
  }

  await UserTermsOfUseXref.create({
    userId: currentUser.userId,
    termsOfUseId,
    created: new Date()
  })

  return { success: true }
}

agreeTermsOfUse.schema = {
  currentUser: Joi.any(),
  termsOfUseId: Joi.numberId()
}

module.exports = {
  getTermsOfUse,
  agreeTermsOfUse
}

logger.buildService(module.exports)
