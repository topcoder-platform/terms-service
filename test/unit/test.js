/**
 * Unit test of the Topcoder Terms API.
 */
process.env.NODE_ENV = 'test'
require('../../app-bootstrap')

const logger = require('../../src/common/logger')
const testHelper = require('../common/testHelper')
const { initDB } = require('../../src/init-db')
const { insertData } = require('../../src/test-data')

describe('Topcoder - Terms API Unit Test', () => {
  let infoLogs = []
  let errorLogs = []
  let debugLogs = []
  let warnLogs = []
  const info = logger.info
  const error = logger.error
  const debug = logger.debug
  const warn = logger.warn

  before(async () => {
    // inject logger with log collector
    logger.info = (message) => {
      infoLogs.push(message)
      info(message)
    }
    logger.debug = (message) => {
      debugLogs.push(message)
      debug(message)
    }
    logger.error = (message) => {
      errorLogs.push(message)
      error(message)
    }
    logger.warn = (message) => {
      warnLogs.push(message)
      warn(message)
    }

    testHelper.initErrorLogs(errorLogs)
    testHelper.initWarnLogs(warnLogs)
    testHelper.initInfoLogs(infoLogs)

    await initDB()
    await insertData()
  })

  after(async () => {
    // restore logger
    logger.error = error
    logger.info = info
    logger.debug = debug
    logger.warn = warn

    await initDB()
  })

  describe('Terms for Resource Unit Test', () => {
    require('./searchAndCheckTermsForResource.test')
    require('./createTermsForResource.test')
    require('./updateTermsForResource.test')
    require('./getAndDeleteTermsForResource.test')
  })

  describe('Terms of Use Unit Test', () => {
    require('./createTermsOfUse.test')
    require('./updateTermsOfUse.test')
    require('./deleteAndSearchTermsOfUse.test')
    require('./getTermsOfUse.test')
    require('./agreeTermsOfUse.test')
  })

  describe('Docusign Unit Test', () => {
    require('./generateDocusignViewUrl.test')
    // require('./docusignCallback.test')
  })

  describe('New features', () => {
    before(async () => {
      await initDB()
      await insertData()
    })
    after(async () => {
      await initDB()
    })

    describe('Get Terms of Use Types Unit Test', () => {
      require('./getTermsOfUseType.test')
    })

    describe('Filter Terms of Use Unit Test', () => {
      require('./searchTermsOfUseFilter.test')
    })

    describe('Get Terms of Use Users Unit Test', () => {
      require('./getTermsOfUseUsers.test')
      require('./signAndUnsignTermsOfUse.test')
    })
  })
})
