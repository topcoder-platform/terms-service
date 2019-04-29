/**
 * E2E test of the Topcoder Terms API.
 */

process.env.NODE_ENV = 'test'

global.Promise = require('bluebird')

const config = require('config')
const logger = require('../../src/common/logger')
const testHelper = require('../common/testHelper')
const { initDB } = require('../../src/init-db')
const { insertData } = require('../../src/test-data')

describe('Topcoder - Topcoder Terms API E2E Test', () => {
  let app
  let infoLogs = []
  let errorLogs = []
  let debugLogs = []
  let warnLogs = []
  const info = logger.info
  const error = logger.error
  const debug = logger.debug
  const warn = logger.warn

  /**
   * Sleep with time from input
   * @param time the time input
   */
  const sleep = (time) => new Promise((resolve) => {
    setTimeout(resolve, time)
  })

  /**
   * Close http server
   * @param {Object} server the server
   */
  const closeServer = (server) => new Promise((resolve) => {
    server.close(() => {
      resolve()
    })
  })

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

    // start the application
    app = require('../../app')

    // wait until application init successfully
    while (true) {
      if (infoLogs.some(x => String(x).includes('Express server listening on port'))) {
        break
      }
      await sleep(config.WAIT_TIME)
    }
  })

  after(async () => {
    // close server
    await closeServer(app)

    // restore logger
    logger.error = error
    logger.info = info
    logger.debug = debug
    logger.warn = warn

    await initDB()
  })

  describe('Terms of Use endpoints', () => {
    require('./getTermsOfUse.test')
    require('./agreeTermsOfUse.test')
  })

  describe('Docusign Unit endpoints', () => {
    require('./generateDocusignViewUrl.test')
    require('./docusignCallback.test')
  })
})
