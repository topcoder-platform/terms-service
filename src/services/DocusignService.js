/**
 * This service provides operations of Docusign.
 */

const _ = require('lodash')
const config = require('config')
const Joi = require('joi')
const helper = require('../common/helper')
const logger = require('../common/logger')
const errors = require('../common/errors')
const { TEMPLATE_ID_INVALID } = require('../../app-constants')
const models = require('../models')

const DocusignEnvelope = models.DocusignEnvelope

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
  logger.debug(`generateDocusignViewURL ${JSON.stringify(currentUser)} ${JSON.stringify(data)}`)
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
      if (data.tabs && data.tabs.length > 0) {
        for (let i = 0; i < data.tabs.length; i++) {
          const tab = data.tabs[i].split('||')
          textTabs.push({ tabLabel: tab[0], value: tab[1] })
        }
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
      logger.debug(`docusign envelope request body ${JSON.stringify(body)}`)
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
      // envelope existed. Check if it's already signed
      logger.debug(`Docusign Envelope Found ${JSON.stringify(docuEnvelope)}`)
    }

    // Request recipient view
    const url = `${baseUrl}/envelopes/${envelopeId}/views/recipient`
    // Request body
    const envelopeBody = {
      clientUserId: config.DOCUSIGN.CLIENT_USER_ID,
      email: userEmail,
      returnUrl: _.template(data.returnUrl || config.DOCUSIGN.RETURN_URL)({ envelopeId }),
      userName: `${user.firstName} ${user.lastName}`,
      authenticationMethod: 'none'
    }
    logger.debug(`docusign request body ${JSON.stringify(envelopeBody)}`)
    let recipientViewUrl
    try {
      const res = await helper.postRequest(url, envelopeBody)
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
  generateDocusignViewURL
}

logger.buildService(module.exports)
