/**
 * Unit tests for DocuSign recipient-view resilience.
 */

const helper = require('../../src/common/helper')
const models = require('../../src/models')
const service = require('../../src/services/DocusignService')
const should = require('should')

const TEMPLATE_ID = '400b989d-1c75-4889-b6f6-421e1f924709'

module.exports = describe('generate resilient DocuSign recipient view', () => {
  it('commits and returns without waiting for the envelope event', async () => {
    const originalGetM2Mtoken = helper.getM2Mtoken
    const originalGetRequest = helper.getRequest
    const originalPostEvent = helper.postEvent
    const originalPostRequest = helper.postRequest
    const originalCreate = models.DocusignEnvelope.create
    const originalFindOne = models.DocusignEnvelope.findOne
    const originalTransaction = models.sequelize.transaction
    const sequence = []
    let rollbackCalled = false

    helper.getM2Mtoken = async () => 'm2m-token'
    helper.getRequest = async url => url.includes('/oauth/userinfo')
      ? {
          body: {
            accounts: [{ account_id: 'account-id', base_uri: 'https://docusign.example' }]
          }
        }
      : {
          body: [{ email: 'member@example.com', firstName: 'Test', handle: 'tester', lastName: 'Member' }]
        }
    helper.postRequest = async url => url.endsWith('/envelopes')
      ? { body: { envelopeId: 'envelope-id' } }
      : { body: { url: 'https://docusign.example/sign' } }
    helper.postEvent = () => {
      sequence.push('publish')
      return new Promise(() => {})
    }
    models.DocusignEnvelope.findOne = async () => null
    models.DocusignEnvelope.create = async () => {
      sequence.push('create')
    }
    models.sequelize.transaction = async () => ({
      commit: async () => {
        sequence.push('commit')
      },
      rollback: async () => {
        rollbackCalled = true
      }
    })

    try {
      const result = await Promise.race([
        service.generateDocusignViewURL({ email: 'member@example.com', userId: 123 }, {
          returnUrl: 'https://www.topcoder-dev.com/community-app-assets/iframe-break',
          templateId: TEMPLATE_ID
        }),
        new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Recipient view waited for BUS API')), 100)
        })
      ])

      should(result).deepEqual({
        envelopeId: 'envelope-id',
        recipientViewUrl: 'https://docusign.example/sign'
      })
      should(sequence).deepEqual(['create', 'commit', 'publish'])
      should(rollbackCalled).be.false()
    } finally {
      helper.getM2Mtoken = originalGetM2Mtoken
      helper.getRequest = originalGetRequest
      helper.postEvent = originalPostEvent
      helper.postRequest = originalPostRequest
      models.DocusignEnvelope.create = originalCreate
      models.DocusignEnvelope.findOne = originalFindOne
      models.sequelize.transaction = originalTransaction
    }
  })
})
