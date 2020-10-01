/**
 * Unit test of TermsOfUseService - get users of terms of use.
 */
const _ = require('lodash')
const should = require('should')
const service = require('../../src/services/TermsOfUseService')
const { request } = require('../common/testData')
const termsOfUseIdsMapping = require('../../src/test-data').termsOfUseIdsMapping
const { assertError, clearLogs } = require('../common/testHelper')

module.exports = describe('get terms of use users', () => {
  beforeEach(() => {
    clearLogs()
  })

  const termsOfuseId = termsOfUseIdsMapping[21306]
  const userId1 = 23124329
  const userId2 = 151743
  const userId3 = 16096823
  const userNotSignId = 100000
  const signedAtFrom = new Date('2020-09-25T00:00:00.000Z')
  const signedAtTo = new Date('2020-09-27T00:00:00.000Z')

  it('all signed users', async () => {
    const result = await service.getTermsOfUseUsers(termsOfuseId, { page: 1, perPage: 100 })
    should.equal(result.total, 3)
    should.equal(result.page, 1)
    should.equal(result.perPage, 100)
    should.equal(result.result.length, 3)
    should.equal(_.isEqual(result.result, request.getTermsOfUseLegacyId21306Users.response.result), true)
  })

  it('check if a user has signed', async () => {
    const result = await service.getTermsOfUseUsers(termsOfuseId, { userId: `${userId1}`, page: 1, perPage: 10 })
    should.equal(result.total, 1)
    should.equal(result.page, 1)
    should.equal(result.perPage, 10)
    should.equal(result.result.length, 1)
    should.equal(_.isEqual(result.result[0], userId1), true)
  })

  it('filter signed users from the list', async () => {
    const result = await service.getTermsOfUseUsers(termsOfuseId, { userId: `${userId1},${userId2},${userNotSignId}`, page: 1, perPage: 10 })
    should.equal(result.total, 2)
    should.equal(result.page, 1)
    should.equal(result.perPage, 10)
    should.equal(result.result.length, 2)
    should.equal(_.isEqual(result.result.sort(), [userId1, userId2].sort()), true)
  })

  it('return an empty array if the user has not signed', async () => {
    const result = await service.getTermsOfUseUsers(termsOfuseId, { userId: `${userNotSignId}`, page: 1, perPage: 10 })
    should.equal(result.total, 0)
    should.equal(result.page, 1)
    should.equal(result.perPage, 10)
    should.equal(result.result.length, 0)
  })

  it('get all signed users from the date', async () => {
    const result = await service.getTermsOfUseUsers(termsOfuseId, { signedAtFrom, page: 1, perPage: 10 })
    should.equal(result.total, 2)
    should.equal(result.page, 1)
    should.equal(result.perPage, 10)
    should.equal(result.result.length, 2)
    should.equal(_.isEqual(result.result.sort(), [userId2, userId3].sort()), true)
  })

  it('get all signed users to the date', async () => {
    const result = await service.getTermsOfUseUsers(termsOfuseId, { signedAtTo, page: 1, perPage: 10 })
    should.equal(result.total, 2)
    should.equal(result.page, 1)
    should.equal(result.perPage, 10)
    should.equal(result.result.length, 2)
    should.equal(_.isEqual(result.result.sort(), [userId1, userId2].sort()), true)
  })

  it('get all signed users between dates', async () => {
    const result = await service.getTermsOfUseUsers(termsOfuseId, { signedAtFrom, signedAtTo, page: 1, perPage: 10 })
    should.equal(result.total, 1)
    should.equal(result.page, 1)
    should.equal(result.perPage, 10)
    should.equal(result.result.length, 1)
    should.equal(_.isEqual(result.result, [userId2]), true)
  })

  it('pagination should work', async () => {
    const result = await service.getTermsOfUseUsers(termsOfuseId, { page: 2, perPage: 2 })
    should.equal(result.total, 3)
    should.equal(result.page, 2)
    should.equal(result.perPage, 2)
    should.equal(result.result.length, 1)
    should.equal(_.isEqual(result.result, [userId3]), true)
  })

  it('return 404 if terms of use not found', async () => {
    try {
      await service.getTermsOfUseUsers(termsOfUseIdsMapping['not-exist-1'], { page: 2, perPage: 2 })
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'NotFoundError')
      assertError(err, `Terms of use with id: ${termsOfUseIdsMapping['not-exist-1']} doesn't exists.`)
    }
  })
})
