/**
 * Unit test of TermsOfUseService - filter terms of uses by title, userId.
 */
const _ = require('lodash')
const should = require('should')
const service = require('../../src/services/TermsOfUseService')
const { request } = require('../common/testData')
const { clearLogs } = require('../common/testHelper')

module.exports = describe('filter terms of use', () => {
  beforeEach(() => {
    clearLogs()
  })

  const userId = 23124329

  it('by title', async () => {
    const result = await service.searchTermsOfUses({ title: 'v2.2', page: 1, perPage: 10 })
    should.equal(result.total, 6)
    should.equal(result.page, 1)
    should.equal(result.perPage, 10)
    should.equal(result.result.length, 6)
    result.result.forEach((termsOfuse) => {
      const match = termsOfuse.title.toLowerCase().indexOf('v2.2') !== -1
      should.equal(match, true)
    })
  })

  it('by title case insensitive', async () => {
    const result = await service.searchTermsOfUses({ title: 'stAndArd tErms', page: 1, perPage: 10 })
    should.equal(result.total, 6)
    should.equal(result.page, 1)
    should.equal(result.perPage, 10)
    should.equal(result.result.length, 6)
    result.result.forEach((termsOfuse) => {
      const match = termsOfuse.title.toLowerCase().indexOf('standard terms') !== -1
      should.equal(match, true)
    })
  })

  it('by title not found', async () => {
    const result = await service.searchTermsOfUses({ title: 'not found', page: 1, perPage: 10 })
    should.equal(result.total, 0)
    should.equal(result.page, 1)
    should.equal(result.perPage, 10)
    should.equal(result.result.length, 0)
  })

  it('by userId', async () => {
    const result = await service.searchTermsOfUses({ userId, page: 1, perPage: 10 })
    should.equal(result.total, 2)
    should.equal(result.page, 1)
    should.equal(result.perPage, 10)
    should.equal(result.result.length, 2)
    should.equal(_.isEqual(result.result, request.searchTermsOfUseByUserId23124329.response.result), true)
  })

  it('by userId not found', async () => {
    const result = await service.searchTermsOfUses({ userId: 1234, page: 1, perPage: 10 })
    should.equal(result.total, 0)
    should.equal(result.page, 1)
    should.equal(result.perPage, 10)
    should.equal(result.result.length, 0)
  })
})
