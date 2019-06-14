/**
 * Unit test of TermsOfUseService - delete/search terms of use.
 */

const _ = require('lodash')
const should = require('should')
const service = require('../../src/services/TermsOfUseService')
const models = require('../../src/models')
const { request } = require('../common/testData')
const { assertError } = require('../common/testHelper')

const TermsOfUse = models.TermsOfUse

module.exports = describe('delete and search terms of use', () => {
  it('search terms of use success', async () => {
    const ret = await service.searchTermsOfUses({ page: 1, perPage: 5 })
    should.equal(ret.total, 11)
    should.equal(ret.perPage, 5)
    should.equal(_.isEqual(ret.result, request.searchTermsOfUse.response.result), true)
  })

  it('delete terms of use success', async () => {
    await service.deleteTermsOfUse(30000)
    const record = await TermsOfUse.findOne({ where: { id: 30000 }, raw: true })
    should.exist(record.deletedAt)
  })

  it('failure - delete terms of not found', async () => {
    try {
      await service.deleteTermsOfUse(20000)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'NotFoundError')
      assertError(err, `TermsOfUse not found with id: 20000`)
    }
  })
})
