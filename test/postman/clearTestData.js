/**
 * Clear the postman test data. All data created by postman e2e tests will be cleared.
 */
 const logger = require('../../src/common/logger')
 const helper = require('../../src/common/helper')
 const config = require('config')
 const envHelper = require('./envHelper')

 logger.info('Clear the Postman test data.')
 
 /**
  * Clear the postman test data. The main function of this class.
  * @returns {Promise<void>}
  */
 const clearTestData = async () => {
   const userToken = await envHelper.getUserToken()
   const adminToken = await envHelper.getAdminToken()
   const m2mToken = await envHelper.getM2MToken()

   // clean the data created by Machine
   await helper.post(`localhost:${config.PORT}${config.BASE_PATH}/terms/internal/jobs/clean`,m2mToken)

  // clean the data created by the Admin
   await helper.post(`localhost:${config.PORT}${config.BASE_PATH}/terms/internal/jobs/clean`,adminToken)

   // clean the data created by the User
   await helper.post(`localhost:${config.PORT}${config.BASE_PATH}/terms/internal/jobs/clean`,userToken)
 }
 
 if(!module.parent) {
  clearTestData().then(() => {
    logger.info('Completed!')
    process.exit()
  }).catch((e) => {
    logger.logFullError(e)
    process.exit(1)
  })
 }
 
 module.exports = {
   clearTestData
 }