/**
 * Unit test of TermsOfUseService - get types of terms of use.
 */
const should = require('should')
const service = require('../../src/services/TermsOfUseService')
const { request } = require('../common/testData')
const { clearLogs } = require('../common/testHelper')

module.exports = describe('get terms of use types', () => {
  beforeEach(() => {
    clearLogs()
  })

  it('get all types', async () => {
    const result = await service.getTermsOfUseTypes()
    should.equal(result.find(type => type.id === 1).name, request.getTermsTypes.response.result[0].name)
    should.equal(result.find(type => type.id === 2).name, request.getTermsTypes.response.result[1].name)
    should.equal(result.find(type => type.id === 3).name, request.getTermsTypes.response.result[2].name)
    should.equal(result.find(type => type.id === 4).name, request.getTermsTypes.response.result[3].name)
    should.equal(result.find(type => type.id === 5).name, request.getTermsTypes.response.result[4].name)
    should.equal(result.find(type => type.id === 6).name, request.getTermsTypes.response.result[5].name)
    should.equal(result.find(type => type.id === 7).name, request.getTermsTypes.response.result[6].name)
    should.equal(result.find(type => type.id === 8).name, request.getTermsTypes.response.result[7].name)
    should.equal(result.find(type => type.id === 9).name, request.getTermsTypes.response.result[8].name)
  })
})
