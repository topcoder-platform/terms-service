/**
 * Unit tests for application log sanitization.
 */

const logger = require('../../src/common/logger')
const should = require('should')

module.exports = describe('logger', () => {
  it('redacts authorization tokens and private keys from full errors', () => {
    const messages = []
    const originalError = logger.error
    const privateKey = '-----BEGIN RSA PRIVATE KEY-----\nprivate-material\n-----END RSA PRIVATE KEY-----'
    const error = new Error('External request failed')
    error.request = {
      header: {
        Authorization: 'Bearer secret-bearer-token',
        private_rsa_key: privateKey
      },
      url: 'https://example.com/oauth?client_secret=secret-client-value'
    }

    logger.error = message => messages.push(String(message))
    try {
      logger.logFullError(error)
    } finally {
      logger.error = originalError
    }

    const output = messages.join('\n')
    should(output).not.match(/secret-bearer-token/)
    should(output).not.match(/private-material/)
    should(output).not.match(/secret-client-value/)
    should(output).match(/<redacted/)
  })
})
