/**
 * Unit tests for non-blocking DocuSign envelope notifications.
 */

const helper = require('../../src/common/helper')
const logger = require('../../src/common/logger')
const service = require('../../src/services/DocusignService')
const should = require('should')

module.exports = describe('publish DocuSign envelope-created event', () => {
  it('does not reject the signing flow when the BUS API is unavailable', async () => {
    const originalPostEvent = helper.postEvent
    const originalError = logger.error
    const messages = []
    helper.postEvent = async () => {
      const error = new Error('Service Unavailable')
      error.status = 503
      throw error
    }
    logger.error = message => messages.push(String(message))

    try {
      await service.publishEnvelopeCreatedEvent({ id: 'envelope-id' })
    } finally {
      helper.postEvent = originalPostEvent
      logger.error = originalError
    }

    should(messages).containEql(
      'Failed to publish the DocuSign envelope-created event. BUS API status: 503.'
    )
  })
})
