/**
 * Unit test of TermsOfUseService - sign / unsign terms of use.
 */
const should = require('should')
const service = require('../../src/services/TermsOfUseService')
const { clearLogs } = require('../common/testHelper')
const UserTermsOfUseXref = require('../../src/models').UserTermsOfUseXref
const termsOfUseIdsMapping = require('../../src/test-data').termsOfUseIdsMapping

module.exports = describe('sign/unsign terms of use', () => {
  beforeEach(() => {
    clearLogs()
  })

  const termsOfUseId = termsOfUseIdsMapping[21306]
  const userId = 8547899

  it('sign terms of use for user', async () => {
    let records = await UserTermsOfUseXref.findAll({ where: { userId, termsOfUseId } })
    should.equal(records.length, 0)
    const result = await service.signTermsOfUseUser(termsOfUseId, { userId })
    should.equal(result.success, true)
    records = await UserTermsOfUseXref.findAll({ where: { userId, termsOfUseId } })
    should.equal(records.length, 1)
  })

  it('unsign terms of use for user', async () => {
    let records = await UserTermsOfUseXref.findAll({ where: { userId, termsOfUseId } })
    should.equal(records.length, 1)
    const result = await service.unsignTermsOfUseUser(termsOfUseId, userId)
    should.equal(result.success, true)
    records = await UserTermsOfUseXref.findAll({ where: { userId, termsOfUseId } })
    should.equal(records.length, 0)
  })
})
