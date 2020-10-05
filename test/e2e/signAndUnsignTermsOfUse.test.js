/**
 * Unit test of TermsOfUseService - sign / unsign terms of use.
 */
const config = require('config')
const should = require('should')
const { token } = require('../common/testData')
const { postRequest, deleteRequest, clearLogs } = require('../common/testHelper')
const UserTermsOfUseXref = require('../../src/models').UserTermsOfUseXref
const termsOfUseIdsMapping = require('../../src/test-data').termsOfUseIdsMapping

const signUrl = `http://localhost:${config.PORT}/terms/:termsOfUseId/users`
const unsignUrl = `http://localhost:${config.PORT}/terms/:termsOfUseId/users/:userId`

module.exports = describe('sign/unsign terms of use', () => {
  beforeEach(() => {
    clearLogs()
  })

  const termsOfUseId = termsOfUseIdsMapping[21306]
  const userId = 8547899

  it('sign terms of use for user', async () => {
    let records = await UserTermsOfUseXref.findAll({ where: { userId, termsOfUseId } })
    should.equal(records.length, 0)
    const res = await postRequest(`${signUrl.replace(':termsOfUseId', termsOfUseId)}`, { userId }, token.user1)
    should.equal(res.status, 200)
    should.equal(res.body.success, true)
    records = await UserTermsOfUseXref.findAll({ where: { userId, termsOfUseId } })
    should.equal(records.length, 1)
  })

  it('unsign terms of use for user', async () => {
    let records = await UserTermsOfUseXref.findAll({ where: { userId, termsOfUseId } })
    should.equal(records.length, 1)
    const res = await deleteRequest(`${unsignUrl.replace(':termsOfUseId', termsOfUseId).replace(':userId', userId)}`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.body.success, true)
    records = await UserTermsOfUseXref.findAll({ where: { userId, termsOfUseId } })
    should.equal(records.length, 0)
  })
})
