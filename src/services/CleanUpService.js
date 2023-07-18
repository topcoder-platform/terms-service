/**
 * This service provides operations to clean up the environment for running automated tests.
 */

 const _ = require('lodash')
 const config = require('config')
 const models = require('../models')
 const helper = require('../common/helper')
 const logger = require('../common/logger')
 
const TermsForResource = models.TermsForResource
const TermsOfUse = models.TermsOfUse
const DocusignEnvelope = models.DocusignEnvelope
const UserTermsOfUseXref = models.UserTermsOfUseXref
const UserTermsOfUseBanXref = models.UserTermsOfUseBanXref
const TermsOfUseDocusignTemplateXref = models.TermsOfUseDocusignTemplateXref
 
 /**
  * Clear the postman test data. The main function of this class.
  * @returns {Promise<void>}
  */
 const cleanUpTestData = async (currentUser) => {
   logger.info('clear the test data from postman test!')

    // delete docusign envelopes created by current user
    if(!currentUser.isMachine) {
      await DocusignEnvelope.destroy({
        where: {
          userId: currentUser.userId
        }
      })
    }
    // get terms of use created by user
    let terms = await TermsOfUse.findAll({
      where: {
        createdBy: currentUser.handle || currentUser.sub
      }
    })
    for (let term of terms) {
      let termsOfUseId = term.id
      let legacyId = term.legacyId

      // delete terms of use reference to docusign template
      TermsOfUseDocusignTemplateXref.destroy({
        where:{termsOfUseId}
      })

      // delete user terms of use agreements
      UserTermsOfUseXref.destroy({
        where:{termsOfUseId}
      })

      // delete banned users
      UserTermsOfUseBanXref.destroy({
        where:{termsOfUseId}
      })

      term.destroy()
      // post event
      await helper.postEvent(config.TERMS_DELETE_TOPIC, { termsOfUseId, legacyId })
    }

    // get terms for resource for the user
    let entities = await TermsForResource.findAll({
      where:{
        createdBy: currentUser.handle || currentUser.sub
      }
    })

    // delete each resource and post event
    for(entity of entities) {
      const deletedEntity = _.cloneDeep(entity)

      await entity.destroy()
      await helper.postEvent(config.RESOURCE_TERMS_DELETE_TOPIC, deletedEntity)
    }

   logger.info('clear the test data from postman test completed!')
 }
 
 module.exports = {
   cleanUpTestData
 }
 
 logger.buildService(module.exports)