/**
 * Unit test of TermsOfUseService - filter terms of uses by title, userId.
 */
const _ = require('lodash')
const config = require('config')
const should = require('should')
const { token, request } = require('../common/testData')
const { getRequest, clearLogs } = require('../common/testHelper')

const url = `http://localhost:${config.PORT}/terms`

module.exports = describe('filter terms of use', () => {
  beforeEach(() => {
    clearLogs()
  })

  const userId = 23124329

  it('by title', async () => {
    const res = await getRequest(`${url}?page=1&perPage=10&title=v2.2`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 6)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 10)
    should.equal(res.headers['x-total-pages'], 1)
    should.equal(res.body.result.length, 6)
    res.body.result.forEach((termsOfuse) => {
      const match = termsOfuse.title.toLowerCase().indexOf('v2.2') !== -1
      should.equal(match, true)
    })
  })

  it('by title case insensitive', async () => {
    const res = await getRequest(`${url}?page=1&perPage=10&title=stAndArd tErms`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 6)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 10)
    should.equal(res.headers['x-total-pages'], 1)
    should.equal(res.body.result.length, 6)
    res.body.result.forEach((termsOfuse) => {
      const match = termsOfuse.title.toLowerCase().indexOf('standard terms') !== -1
      should.equal(match, true)
    })
  })

  it('by title not found', async () => {
    const res = await getRequest(`${url}?page=1&perPage=10&title=not found`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 0)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 10)
    should.equal(res.headers['x-total-pages'], 0)
    should.equal(res.body.result.length, 0)
  })

  it('by userId', async () => {
    const res = await getRequest(`${url}?page=1&perPage=10&userId=${userId}`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 2)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 10)
    should.equal(res.headers['x-total-pages'], 1)
    should.equal(res.body.result.length, 2)
    should.equal(_.isEqual(res.body.result, request.searchTermsOfUseByUserId23124329.response.result), true)
  })

  it('by userId not found', async () => {
    const res = await getRequest(`${url}?page=1&perPage=10&userId=1234`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.headers['x-total'], 0)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 10)
    should.equal(res.headers['x-total-pages'], 0)
    should.equal(res.body.result.length, 0)
  })

  it('return 400 if validation error', async () => {
    try {
      await await getRequest(`${url}?page=1&perPage=10&userid=1234`, token.user1)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 400)
      should.equal(_.get(err, 'response.body.message'), '"userid" is not allowed')
    }
  })
})
