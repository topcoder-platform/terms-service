/**
 * Unit test of TermsOfUseService - get terms of use.
 */

const should = require('should')
const service = require('../../src/services/TermsOfUseService')
const { user } = require('../common/testData')
const { assertError, assertValidationError } = require('../common/testHelper')

module.exports = describe('get terms of use', () => {
  it('get terms of use by user who has agreed', async () => {
    const result = await service.getTermsOfUse(user.user1, 21303, {})
    should.equal(result.id, 21303)
    should.equal(result.title, 'Standard Terms for Topcoder Competitions v2.2')
    should.equal(result.url, '')
    should.equal(result.text, 'text')
    should.equal(result.agreed, true)
    should.equal(result.agreeabilityType, 'Electronically-agreeable')
  })

  it(`get terms of use by user who hasn't agreed`, async () => {
    const result = await service.getTermsOfUse(user.user2, 21303, {})
    should.equal(result.id, 21303)
    should.equal(result.title, 'Standard Terms for Topcoder Competitions v2.2')
    should.equal(result.url, '')
    should.equal(result.text, 'text')
    should.equal(result.agreed, false)
    should.equal(result.agreeabilityType, 'Electronically-agreeable')
  })

  it(`get terms of use noauth`, async () => {
    const result = await service.getTermsOfUse(undefined, 21303, { noauth: 'true' })
    should.equal(result.id, 21303)
    should.equal(result.title, 'Standard Terms for Topcoder Competitions v2.2')
    should.equal(result.url, '')
    should.equal(result.text, 'text')
    should.not.exist(result.agreed)
    should.equal(result.agreeabilityType, 'Electronically-agreeable')
  })

  it(`get terms of use noauth is false with user`, async () => {
    const result = await service.getTermsOfUse(user.user1, 21303, { noauth: 'false' })
    should.equal(result.id, 21303)
    should.equal(result.title, 'Standard Terms for Topcoder Competitions v2.2')
    should.equal(result.url, '')
    should.equal(result.text, 'text')
    should.equal(result.agreed, true)
    should.equal(result.agreeabilityType, 'Electronically-agreeable')
  })

  it(`get terms of use with docusignTemplateId`, async () => {
    const result = await service.getTermsOfUse(undefined, 21304, { noauth: 'true' })
    should.equal(result.id, 21304)
    should.equal(result.title, 'Standard Terms for Topcoder Competitions v2.2')
    should.equal(result.url, '')
    should.equal(result.text, 'another text')
    should.not.exist(result.agreed)
    should.equal(result.docusignTemplateId, '100')
    should.equal(result.agreeabilityType, 'Docusign-template')
  })

  it('failure - get terms of use missing Docusign template', async () => {
    try {
      await service.getTermsOfUse(undefined, 21305, { noauth: 'true' })
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'InternalServerError')
      assertError(err, 'Docusign template id is missing.')
    }
  })

  it(`failure - invalid parameter termsOfUseId`, async () => {
    try {
      await service.getTermsOfUse(undefined, 'string', { noauth: 'true' })
      throw new Error('should not throw error here')
    } catch (err) {
      assertValidationError(err, `"termsOfUseId" must be a number`)
    }
  })

  it('failure - get terms of use not found', async () => {
    try {
      await service.getTermsOfUse(undefined, 1121305, { noauth: 'true' })
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'NotFoundError')
      assertError(err, `Terms of use with id: 1121305 doesn't exists.`)
    }
  })

  it('failure - missing authentication', async () => {
    try {
      await service.getTermsOfUse(undefined, 21303, {})
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'UnauthorizedError')
      assertError(err, `Authentication credential was missing.`)
    }
  })
})
