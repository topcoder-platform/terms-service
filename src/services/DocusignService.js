/**
 * This service provides operations of Docusign.
 */

const _ = require('lodash')
const config = require('config')
const Joi = require('joi')
const helper = require('../common/helper')
const logger = require('../common/logger')
const errors = require('../common/errors')
const { Templates, TEMPLATE_ID_INVALID } = require('../../app-constants')
const models = require('../models')

const DocusignEnvelope = models.DocusignEnvelope

/**
 * Send an email
 * @param {Object} params the parameters, include from address, to address, subject and etc.
 */
async function sendEmail (params) {
  let eventMessage = {
    data: params,
    version: 'v3',
    recipients: [params.toAddress],
    from: {
      name: 'Terms service',
      email: params.fromAddress
    }
  }
  helper.postEvent(config.TERMS_EMAIL_SUPPORT_TOPIC, { payload: eventMessage }).then(() => {
    logger.info(`Successfully sent ${config.TERMS_EMAIL_SUPPORT_TOPIC} event` +
      ` with body ${JSON.stringify(eventMessage)} to bus api`)
  }).catch((err) => {
    logger.error(`Failed to send ${config.TERMS_EMAIL_SUPPORT_TOPIC} event` +
      `; error: ${err.message}` +
      `; with body ${JSON.stringify(eventMessage)} to bus api`)
    logger.logFullError(err)
  })
}

/**
 * Docusign callback
 * @param {Object} data the input data
 * @returns {Object} the result message
 */
async function docusignCallback (data) {
  if (data.connectKey !== config.DOCUSIGN.CALLBACK_CONNECT_KEY) {
    throw new errors.NotFoundError('Connect Key is missing or invalid.')
  }
  if (data.envelopeStatus !== 'Completed') {
    logger.info('Status is not completed.')
    return { message: 'success' }
  }
  if (/^[\s\xa0]*$/.test(data.envelopeId)) {
    logger.error('envelopeId is null or empty')
    return { message: 'success' }
  }

  let envelop
  // start transaction
  const transaction = await models.sequelize.transaction()

  try {
    const result = await DocusignEnvelope.findAll({
      where: { [models.Sequelize.Op.or]: [
        models.sequelize.where(models.sequelize.fn('lower', models.sequelize.col('id')), data.envelopeId),
        models.sequelize.where(models.sequelize.fn('upper', models.sequelize.col('id')), data.envelopeId)
      ] },
      transaction
    })
    if (result.length === 0) {
      logger.error(`No enevelope with id: ${data.envelopeId} was found.`)
      await transaction.commit()
      // still return success
      return { message: 'success' }
    }
    envelop = result[0]
    // Update the envelop
    await envelop.update({ isCompleted: 1 }, { transaction })
    // Find the template for the envelope
    const template = _.find(Templates, { templateId: envelop.docusignTemplateId })
    if (_.isUndefined(template)) {
      logger.warn(`No Template was found for template id: ${envelop.docusignTemplateId}`)
      await transaction.commit()
      // still return success
      return { message: 'success' }
    }
    // Call the handlers for the template, one after the other
    for (let i = 0; i < template.handlers.length; i++) {
      await template.handlers[i](envelop.userId, data.tabs, transaction)
    }

    // commit
    await transaction.commit()

    return { message: 'success' }
  } catch (err) {
    // All errors need to be communicated to the support staff
    await sendEmail({
      subject: config.DOCUSIGN.CALLBACK_FAILED_EMAIL_SUBJECT,
      toAddress: config.DOCUSIGN.CALLBACK_FAILED_SUPPORT_EMAIL_ADDRESS,
      fromAddress: config.DOCUSIGN.CALLBACK_FAILED_FROM_EMAIL_ADDRESS,
      userId: envelop.userId,
      templateId: envelop.docusignTemplateId,
      envelopeId: envelop.id,
      message: err.message
    })

    // roll back
    await transaction.rollback()

    // Only temporary errors are to return 500, otherwise 200
    if (err.temporary === true) {
      throw new errors.InternalServerError(err.message, err)
    } else {
      return { message: err.message }
    }
  }
}

docusignCallback.schema = {
  data: Joi.object().keys({
    envelopeStatus: Joi.string().required(),
    envelopeId: Joi.string().required(),
    tabs: Joi.array().items(Joi.object().keys({
      tabLabel: Joi.string().required(),
      tabValue: Joi.string().allow('').required()
    })).required(),
    connectKey: Joi.string().required()
  }).required()
}

/**
 * Get user by user id
 * @param {String} userId the user id
 * @returns {Object} the user data
 */
async function getUser (userId) {
  const m2mToken = await helper.getM2Mtoken()
  const res = await helper.getRequest(`${config.USER_API_URL}?filter=id=${userId}`, `Bearer ${m2mToken}`)
  if (res.body.result.content.length === 0) {
    throw new errors.NotFoundError(`User with given id: ${userId} doesn't exist`)
  }
  return res.body.result.content[0]
}

/**
 * Generate docusign view url.
 * @param {Object} currentUser the user who perform this operation.
 * @param {Object} data the input data
 * @returns {Object} the recipient view url and envelop id
 */
async function generateDocusignViewURL (currentUser, data) {
  let baseUrl
  try {
    const res = await helper.getRequest(`${config.DOCUSIGN.SERVER_URL}/login_information`)
    baseUrl = res.body.loginAccounts[0].baseUrl
  } catch (err) {
    throw new errors.InternalServerError('Login to DocuSign server failed.')
  }

  const user = await getUser(currentUser.userId)
  // use email from decoded token during development
  const userEmail = process.env.NODE_ENV === 'production' ? user.email : currentUser.email
  const docuEnvelope = await DocusignEnvelope.findOne({
    where: { userId: currentUser.userId, docusignTemplateId: data.templateId, isCompleted: 1 },
    raw: true
  })
  let envelopeId

  // start transaction
  const transaction = await models.sequelize.transaction()

  try {
    if (_.isNull(docuEnvelope)) {
      let textTabs = []
      // Set the default tab values if provided
      for (let i = 0; i < data.tabs.length; i++) {
        const tab = data.tabs[i].split('||')
        textTabs.push({ tabLabel: tab[0], value: tab[1] })
      }

      textTabs.push({ tabLabel: 'TopCoder Handle', value: user.handle })

      const body = {
        templateId: data.templateId,
        status: 'sent',
        enableWetSign: false,
        templateRoles: [{
          name: `${user.firstName} ${user.lastName}`,
          email: userEmail,
          roleName: config.DOCUSIGN.ROLENAME,
          clientUserId: config.DOCUSIGN.CLIENT_USER_ID,
          tabs: {
            textTabs: textTabs
          }
        }]
      }
      try {
        const res = await helper.postRequest(`${baseUrl}/envelopes`, body)
        envelopeId = res.body.envelopeId
      } catch (err) {
        if (_.get(err, 'response.body.errorCode') === TEMPLATE_ID_INVALID) {
          throw new errors.NotFoundError('Template with given id was not found.')
        }
        throw new errors.InternalServerError('Requesting Signature via template failed.')
      }

      const envelopeData = {
        id: envelopeId,
        docusignTemplateId: data.templateId,
        userId: currentUser.userId,
        isCompleted: 0
      }

      await DocusignEnvelope.create(envelopeData, { transaction })
      await helper.postEvent(config.DOCUSIGN_ENVELOPE_CREATE_TOPIC, envelopeData)
    } else {
      envelopeId = docuEnvelope.id
    }

    // Request recipient view
    const url = `${baseUrl}/envelopes/${envelopeId}/views/recipient`
    // Request body
    const body = {
      clientUserId: config.DOCUSIGN.CLIENT_USER_ID,
      email: userEmail,
      returnUrl: _.template(data.returnUrl || config.DOCUSIGN.RETURN_URL)({ envelopeId }),
      userName: `${user.firstName} ${user.lastName}`,
      authenticationMethod: 'none'
    }
    let recipientViewUrl
    try {
      const res = await helper.postRequest(url, body)
      recipientViewUrl = res.body.url
    } catch (err) {
      logger.logFullError(err)
      throw new errors.BadRequestError('Requesting recipient view failed.')
    }

    // commit
    await transaction.commit()

    return { recipientViewUrl, envelopeId }
  } catch (err) {
    // roll back and re-throw error
    await transaction.rollback()

    throw err
  }
}

generateDocusignViewURL.schema = {
  currentUser: Joi.any(),
  data: Joi.object().keys({
    templateId: Joi.uuid(),
    tabs: Joi.array().items(Joi.string().regex(/^.+\|\|.+$/)),
    returnUrl: Joi.string()
  }).required()
}

module.exports = {
  docusignCallback,
  generateDocusignViewURL
}

logger.buildService(module.exports)
