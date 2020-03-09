/**
 * This service provides operations of TermsOfUse.
 */

const _ = require('lodash')
const config = require('config')
const Joi = require('joi')
const helper = require('../common/helper')
const logger = require('../common/logger')
const errors = require('../common/errors')
const models = require('../models')
const { AGREE_FOR_DOCUSIGN_TEMPLATE, ELECT_AGREEABLE } = require('../../app-constants')

const TermsOfUse = models.TermsOfUse
const UserTermsOfUseXref = models.UserTermsOfUseXref
const UserTermsOfUseBanXref = models.UserTermsOfUseBanXref
const TermsOfUseDependency = models.TermsOfUseDependency
const TermsOfUseAgreeabilityType = models.TermsOfUseAgreeabilityType
const TermsOfUseDocusignTemplateXref = models.TermsOfUseDocusignTemplateXref

/**
 * Get terms of use by id
 * @param {Object} currentUser the user who perform this operation.
 * @param {String} termsOfUseId the terms of use id
 * @param {Object} query the query object
 * @returns {Object} the terms of use
 */
async function getTermsOfUse (currentUser, termsOfUseId, query) {
  const noauth = query.noauth === 'true'
  if (!noauth && (!currentUser || currentUser.isMachine)) {
    // since we can get terms of use anonymous, we can accept any valid m2m token.
    // however it should be consider as anonymous, so noauth query parameter should be true
    throw new errors.UnauthorizedError('Authentication credential was missing.')
  }

  const include = [
    {
      model: TermsOfUseAgreeabilityType,
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
    where: { id: termsOfUseId, deletedAt: null },
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

  return convertRawData(termsOfUse)
}

/**
 * Convert raw terms of use data.
 * @params {termsOfUse} the raw terms of use
 * @returns the converted terms of use
 */
function convertRawData (termsOfUse, throwError = true) {
  termsOfUse.docusignTemplateId = termsOfUse['TermsOfUseDocusignTemplateXref.docusignTemplateId']
  delete termsOfUse['TermsOfUseDocusignTemplateXref.docusignTemplateId']
  termsOfUse.agreeabilityType = termsOfUse['TermsOfUseAgreeabilityType.agreeabilityType']
  delete termsOfUse['TermsOfUseAgreeabilityType.agreeabilityType']
  if (termsOfUse.agreeabilityTypeId === AGREE_FOR_DOCUSIGN_TEMPLATE) {
    // check whether this is for docusign template and that template exists
    if (throwError && _.isNull(termsOfUse.docusignTemplateId)) {
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
  termsOfUseId: Joi.string().guid(),
  query: Joi.object().keys({
    noauth: Joi.string()
  })
}

/**
 * Agree terms of use
 * @param {Object} currentUser the user who perform this operation.
 * @param {String} termsOfUseId the terms of use id
 * @returns {Object} successful message if user agree terms of use successfully
 */
async function agreeTermsOfUse (currentUser, termsOfUseId) {
  // get terms of use
  const result = await TermsOfUse.findAll({
    include: [{
      model: TermsOfUseAgreeabilityType,
      attributes: [['name', 'agreeabilityType']]
    }],
    where: { id: termsOfUseId, deletedAt: null },
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

  const body = {
    userId: currentUser.userId,
    termsOfUseId,
    created: new Date()
  }
  await UserTermsOfUseXref.create(body)

  await helper.postEvent(config.TERMS_UPDATE_TOPIC, body)

  return { success: true }
}

agreeTermsOfUse.schema = {
  currentUser: Joi.any(),
  termsOfUseId: Joi.string().guid()
}

/**
 * Perform validation on terms of use data
 * @params {Object} termsOfUse the terms of use
 */
async function validateTermsOfUse (termsOfUse) {
  if (termsOfUse.agreeabilityTypeId) {
    try {
      await helper.ensureExists(TermsOfUseAgreeabilityType, { id: termsOfUse.agreeabilityTypeId })
    } catch (err) {
      if (err.name === 'NotFoundError') {
        throw new errors.BadRequestError(err.message)
      }
      throw err
    }
  }
}

/**
 * Create terms of use
 * @params {Object} currentUser the user who perform this operation
 * @params {Object} termsOfUse the terms of use to be created
 * @returns {Object} the created terms of use
 */
async function createTermsOfUse (currentUser, termsOfUse) {
  await validateTermsOfUse(termsOfUse)

  termsOfUse.created = new Date()
  termsOfUse.createdBy = currentUser.handle || currentUser.sub

  let created = await TermsOfUse.create(_.omit(termsOfUse, 'docusignTemplateId'))

  if (termsOfUse.docusignTemplateId) {
    await TermsOfUseDocusignTemplateXref.create({
      termsOfUseId: created.id,
      docusignTemplateId: termsOfUse.docusignTemplateId
    })
  }

  return created
}

createTermsOfUse.schema = {
  currentUser: Joi.any(),
  termsOfUse: Joi.object().keys({
    id: Joi.string().guid().optional(),
    legacyId: Joi.numberId().optional(),
    text: Joi.string(),
    typeId: Joi.numberId(),
    title: Joi.string().required(),
    url: Joi.string(),
    agreeabilityTypeId: Joi.uuid(),
    docusignTemplateId: Joi.when('agreeabilityTypeId', {
      is: AGREE_FOR_DOCUSIGN_TEMPLATE,
      then: Joi.string().required(),
      otherwise: Joi.string()
    })
  }).required()
}

/**
 * Update terms of use
 * @params {Object} currentUser the user who perform this operation
 * @params {Number} termsForResourceId the id
 * @params {Object} data the data to be updated
 * @returns {Object} the updated terms of use
 */
async function updateTermsOfUse (currentUser, termsOfUseId, data, isFull) {
  await validateTermsOfUse(data, false)

  const termsOfUse = await helper.ensureExists(TermsOfUse, { id: termsOfUseId, deletedAt: null }, false)
  const docusignTemplateXref = await termsOfUse.getTermsOfUseDocusignTemplateXref()

  if (_.get(data, 'agreeabilityTypeId', termsOfUse.agreeabilityTypeId) === AGREE_FOR_DOCUSIGN_TEMPLATE &&
    _.isNull(docusignTemplateXref) && _.isUndefined(data.docusignTemplateId)) {
    throw new errors.BadRequestError('Docusign template id is missing.')
  }

  if (isFull && !_.isNull(docusignTemplateXref) && _.isUndefined(data.docusignTemplateId)) {
    await docusignTemplateXref.destroy()
  }

  if (isFull) {
    data.text = data.text || null
    data.url = data.url || null
  }

  if (data.docusignTemplateId) {
    if (_.isNull(docusignTemplateXref)) {
      await TermsOfUseDocusignTemplateXref.create({
        termsOfUseId,
        docusignTemplateId: data.docusignTemplateId
      })
    } else {
      docusignTemplateXref.docusignTemplateId = data.docusignTemplateId
      await docusignTemplateXref.save()
    }
  }

  data.updatedBy = currentUser.handle || currentUser.sub
  data.updated = new Date()
  await termsOfUse.update(_.omit(data, 'docusignTemplateId'))

  if (!isFull && _.isUndefined(data.docusignTemplateId) && !_.isNull(docusignTemplateXref)) {
    data.docusignTemplateId = docusignTemplateXref.docusignTemplateId
  }

  return helper.clearObject(_.assign(termsOfUse.dataValues, data))
}

/**
 * Partially update terms of use
 * @params {Object} currentUser the user who perform this operation
 * @params {String} termsOfUseId the id
 * @params {Object} data the data to be updated
 * @returns {Object} the updated terms of use
 */
async function partiallyUpdateTermsOfUse (currentUser, termsOfUseId, data) {
  return updateTermsOfUse(currentUser, termsOfUseId, data, false)
}

partiallyUpdateTermsOfUse.schema = {
  currentUser: Joi.any(),
  termsOfUseId: Joi.string().guid(),
  data: Joi.object().keys({
    text: Joi.string(),
    typeId: Joi.optionalNumberId(),
    title: Joi.string(),
    url: Joi.string(),
    agreeabilityTypeId: Joi.string().uuid().optional(),
    docusignTemplateId: Joi.string()
  }).required()
}

/**
 * Fully update terms of use
 * @params {Object} currentUser the user who perform this operation
 * @params {String} termsOfUseId the id
 * @params {Object} data the data to be updated
 * @returns {Object} the updated terms of use
 */
async function fullyUpdateTermsOfUse (currentUser, termsOfUseId, data) {
  return updateTermsOfUse(currentUser, termsOfUseId, data, true)
}

fullyUpdateTermsOfUse.schema = {
  currentUser: Joi.any(),
  termsOfUseId: Joi.string().guid(),
  data: createTermsOfUse.schema.termsOfUse
}

/**
 * Delete terms of use
 * @params {String} termsOfUseId the id
 */
async function deleteTermsOfUse (termsOfUseId) {
  const termsOfUse = await helper.ensureExists(TermsOfUse, { id: termsOfUseId, deletedAt: null }, false)
  await termsOfUse.update({ deletedAt: new Date() })
}

deleteTermsOfUse.schema = {
  termsOfUseId: Joi.string().guid()
}

/**
 * List terms of use
 * @params {Object} criteria the search criteria, only pagination and legacy Id currently
 * @returns {Object} the search result, contain total/page/perPage and result array
 */
async function searchTermsOfUses (criteria) {
  const countResult = await TermsOfUse.findOne({
    attributes: [[models.Sequelize.fn('COUNT', models.Sequelize.col('id')), 'total']],
    where: { deletedAt: null },
    raw: true
  })

  const result = await TermsOfUse.findAll({
    order: [['id', 'ASC']],
    attributes: ['id', 'title', 'url', 'text', 'agreeabilityTypeId'],
    include: [
      {
        model: TermsOfUseAgreeabilityType,
        attributes: [['name', 'agreeabilityType']]
      },
      {
        model: models.TermsOfUseDocusignTemplateXref,
        attributes: ['docusignTemplateId']
      }
    ],
    where: _.assign({ deletedAt: null }, _.omit(criteria, ['perPage', 'page'])),
    limit: criteria.perPage,
    offset: (criteria.page - 1) * criteria.perPage,
    raw: true
  })

  for (const element of result) {
    convertRawData(element, false)
  }

  return {
    total: countResult.total,
    page: criteria.page,
    perPage: criteria.perPage,
    result: helper.clearObject(result)
  }
}

searchTermsOfUses.schema = {
  criteria: Joi.object().keys({
    page: Joi.page(),
    perPage: Joi.perPage(),
    legacyId: Joi.numberId().optional()
  }).required()
}

module.exports = {
  getTermsOfUse,
  agreeTermsOfUse,
  createTermsOfUse,
  partiallyUpdateTermsOfUse,
  fullyUpdateTermsOfUse,
  deleteTermsOfUse,
  searchTermsOfUses
}

logger.buildService(module.exports)
