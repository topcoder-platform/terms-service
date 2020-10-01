/**
 * Unit test of TermsOfUseService - get users of terms of use.
 */
const _ = require('lodash')
const config = require('config')
const should = require('should')
const termsOfUseIdsMapping = require('../../src/test-data').termsOfUseIdsMapping
const { token, request } = require('../common/testData')
const { getRequest, clearLogs } = require('../common/testHelper')

const url = `http://localhost:${config.PORT}/terms/:termsOfUseId/users`

module.exports = describe('get terms of use users', () => {
  beforeEach(() => {
    clearLogs()
  })

  const termsOfUseId = termsOfUseIdsMapping[21306]
  const userId1 = 23124329
  const userId2 = 151743
  const userId3 = 16096823
  const userNotSignId = 100000
  const signedAtFrom = new Date('2020-09-25T00:00:00.000Z')
  const signedAtTo = new Date('2020-09-27T00:00:00.000Z')

  it('all signed users', async () => {
    const res = await getRequest(`${url.replace(':termsOfUseId', termsOfUseId)}?page=1&perPage=100`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 3)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 100)
    should.equal(res.headers['x-total-pages'], 1)
    should.equal(res.body.result.length, 3)
    should.equal(_.isEqual(res.body.result, request.getTermsOfUseLegacyId21306Users.response.result), true)
  })

  it('check if a user has signed', async () => {
    const res = await getRequest(`${url.replace(':termsOfUseId', termsOfUseId)}?page=1&perPage=10&userId=${userId1}`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 1)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 10)
    should.equal(res.headers['x-total-pages'], 1)
    should.equal(res.body.result.length, 1)
    should.equal(_.isEqual(res.body.result[0], userId1), true)
  })

  it('filter signed users from the list', async () => {
    const res = await getRequest(`${url.replace(':termsOfUseId', termsOfUseId)}?page=1&perPage=10&userId=${userId1},${userId2},${userNotSignId}`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 2)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 10)
    should.equal(res.headers['x-total-pages'], 1)
    should.equal(res.body.result.length, 2)
    should.equal(_.isEqual(res.body.result.sort(), [userId1, userId2].sort()), true)
  })

  it('return an empty array if the user has not signed', async () => {
    const res = await getRequest(`${url.replace(':termsOfUseId', termsOfUseId)}?page=1&perPage=10&userId=${userNotSignId}`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 0)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 10)
    should.equal(res.headers['x-total-pages'], 0)
    should.equal(res.body.result.length, 0)
  })

  it('get all signed users from the date', async () => {
    const res = await getRequest(`${url.replace(':termsOfUseId', termsOfUseId)}?page=1&perPage=10&signedAtFrom=${signedAtFrom}`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 2)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 10)
    should.equal(res.headers['x-total-pages'], 1)
    should.equal(res.body.result.length, 2)
    should.equal(_.isEqual(res.body.result.sort(), [userId2, userId3].sort()), true)
  })

  it('get all signed users to the date', async () => {
    const res = await getRequest(`${url.replace(':termsOfUseId', termsOfUseId)}?page=1&perPage=10&signedAtTo=${signedAtTo}`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 2)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 10)
    should.equal(res.headers['x-total-pages'], 1)
    should.equal(res.body.result.length, 2)
    should.equal(_.isEqual(res.body.result.sort(), [userId1, userId2].sort()), true)
  })

  it('get all signed users between dates', async () => {
    const res = await getRequest(`${url.replace(':termsOfUseId', termsOfUseId)}?page=1&perPage=10&signedAtFrom=${signedAtFrom}&signedAtTo=${signedAtTo}`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 1)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 10)
    should.equal(res.headers['x-total-pages'], 1)
    should.equal(res.body.result.length, 1)
    should.equal(_.isEqual(res.body.result, [userId2]), true)
  })

  it('pagination should work', async () => {
    const res = await getRequest(`${url.replace(':termsOfUseId', termsOfUseId)}?page=2&perPage=2`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 3)
    should.equal(res.headers['x-page'], 2)
    should.equal(res.headers['x-per-page'], 2)
    should.equal(res.headers['x-total-pages'], 2)
    should.equal(res.body.result.length, 1)
    should.equal(_.isEqual(res.body.result, [userId3]), true)
  })

  it('return 404 if terms of use not found', async () => {
    try {
      await getRequest(`${url.replace(':termsOfUseId', termsOfUseIdsMapping['not-exist-1'])}?page=2&perPage=2`, token.user1)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 404)
      should.equal(_.get(err, 'response.body.message'), `Terms of use with id: ${termsOfUseIdsMapping['not-exist-1']} doesn't exists.`)
    }
  })

  it('return 400 if validation error', async () => {
    try {
      await getRequest(`${url.replace(':termsOfUseId', termsOfUseId)}?page=2&perPage=2&userIds=${userId1}`, token.user1)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 400)
      should.equal(_.get(err, 'response.body.message'), '"userIds" is not allowed')
    }
  })

  it('return 401 if no token', async () => {
    try {
      await getRequest(`${url.replace(':termsOfUseId', termsOfUseId)}?page=1&perPage=10`)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), 'No token provided.')
    }
  })

  it('return 401 if invalid', async () => {
    try {
      await getRequest(`${url.replace(':termsOfUseId', termsOfUseId)}?page=1&perPage=10`, 'invalid token')
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), 'Invalid Token.')
    }
  })

  it('return 403 if no permission', async () => {
    try {
      await getRequest(`${url.replace(':termsOfUseId', termsOfUseId)}?page=1&perPage=10`, token.invalidUser)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 403)
      should.equal(_.get(err, 'response.body.message'), 'You are not allowed to perform this action!')
    }
  })
})
