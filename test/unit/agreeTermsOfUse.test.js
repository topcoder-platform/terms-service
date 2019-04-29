/**
 * Unit test of TermsOfUseService - agree terms of use.
 */

const should = require('should')
const service = require('../../src/services/TermsOfUseService')
const models = require('../../src/models')
const { user } = require('../common/testData')
const { assertError, assertValidationError } = require('../common/testHelper')

const UserTermsOfUseXref = models.UserTermsOfUseXref

module.exports = describe('agree terms of use', () => {
  it('agree terms of use success', async () => {
    let records = await UserTermsOfUseXref.findAll({ where: { userId: 23124329, termsOfUseId: 21303 } })
    should.equal(records.length, 0)
    const result = await service.agreeTermsOfUse(user.user2, 21303)
    should.equal(result.success, true)
    records = await UserTermsOfUseXref.findAll({ where: { userId: 23124329, termsOfUseId: 21303 } })
    should.equal(records.length, 1)
  })

  it('failure - user has agreed terms of use before', async () => {
    try {
      await service.agreeTermsOfUse(user.user1, 21303)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'BadRequestError')
      assertError(err, `You have agreed to this terms of use before.`)
    }
  })

  it(`failure - user hasn't agreed dependencies terms`, async () => {
    try {
      await service.agreeTermsOfUse(user.user3, 21303)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'BadRequestError')
      assertError(err, `You can't agree to this terms of use before you have agreed to all the dependencies terms of use.`)
    }
  })

  it(`failure - user was banned`, async () => {
    try {
      await service.agreeTermsOfUse(user.user4, 21303)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'ForbiddenError')
      assertError(err, `Sorry, you can not agree to this terms of use.`)
    }
  })

  it('failure - terms of use not found', async () => {
    try {
      await service.agreeTermsOfUse(user.user1, 121303)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'NotFoundError')
      assertError(err, `Terms of use with id: 121303 doesn't exists.`)
    }
  })

  it('failure - terms of use not found', async () => {
    try {
      await service.agreeTermsOfUse(user.user1, 21304)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'BadRequestError')
      assertError(err, `The term is not electronically agreeable.`)
    }
  })

  it(`failure - invalid parameter termsOfUseId`, async () => {
    try {
      await service.agreeTermsOfUse(user.user1, 'string')
      throw new Error('should not throw error here')
    } catch (err) {
      assertValidationError(err, `"termsOfUseId" must be a number`)
    }
  })
})
