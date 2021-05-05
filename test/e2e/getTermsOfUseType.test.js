/**
 * Unit test of TermsOfUseService - get types of terms of use.
 */
const _ = require('lodash')
const config = require('config')
const should = require('should')
const { token, request } = require('../common/testData')
const { getRequest, clearLogs } = require('../common/testHelper')

const url = `http://localhost:${config.PORT}/terms/type`

module.exports = describe('get terms of use types', () => {
  beforeEach(() => {
    clearLogs()
  })

  it('get all types', async () => {
    const res = await getRequest(`${url}`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.body.find(type => type.id === 1).name, request.getTermsTypes.response.result[0].name)
    should.equal(res.body.find(type => type.id === 2).name, request.getTermsTypes.response.result[1].name)
    should.equal(res.body.find(type => type.id === 3).name, request.getTermsTypes.response.result[2].name)
    should.equal(res.body.find(type => type.id === 4).name, request.getTermsTypes.response.result[3].name)
    should.equal(res.body.find(type => type.id === 5).name, request.getTermsTypes.response.result[4].name)
    should.equal(res.body.find(type => type.id === 6).name, request.getTermsTypes.response.result[5].name)
    should.equal(res.body.find(type => type.id === 7).name, request.getTermsTypes.response.result[6].name)
    should.equal(res.body.find(type => type.id === 8).name, request.getTermsTypes.response.result[7].name)
    should.equal(res.body.find(type => type.id === 9).name, request.getTermsTypes.response.result[8].name)
  })

  it('return 401 if no token', async () => {
    try {
      await getRequest(`${url}`)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), 'No token provided.')
    }
  })

  it('return 401 if invalid', async () => {
    try {
      await getRequest(`${url}`, 'invalid token')
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), 'Invalid Token.')
    }
  })

  it('return 403 if no permission', async () => {
    try {
      await getRequest(`${url}`, token.invalidUser)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 403)
      should.equal(_.get(err, 'response.body.message'), 'You are not allowed to perform this action!')
    }
  })
})
