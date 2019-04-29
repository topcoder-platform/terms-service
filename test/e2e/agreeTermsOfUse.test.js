/**
 * E2E test of the agree Terms of Use endpoint.
 */

const _ = require('lodash')
const config = require('config')
const should = require('should')
const models = require('../../src/models')
const { token } = require('../common/testData')
const { postRequest } = require('../common/testHelper')

const UserTermsOfUseXref = models.UserTermsOfUseXref

const url = `http://localhost:${config.PORT}/terms`

module.exports = describe('Agree terms of use endpoint', () => {
  it('agree terms of use success', async () => {
    let records = await UserTermsOfUseXref.findAll({ where: { userId: 23124329, termsOfUseId: 21303 } })
    should.equal(records.length, 0)
    const res = await postRequest(`${url}/21303/agree`, undefined, token.user2)
    should.equal(res.status, 200)
    should.equal(res.body.success, true)
    records = await UserTermsOfUseXref.findAll({ where: { userId: 23124329, termsOfUseId: 21303 } })
    should.equal(records.length, 1)
  })

  it('failure - user has agreed terms of use before', async () => {
    try {
      await postRequest(`${url}/21303/agree`, undefined, token.user1)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 400)
      should.equal(_.get(err, 'response.body.message'), 'You have agreed to this terms of use before.')
    }
  })

  it(`failure - user hasn't agreed dependencies terms`, async () => {
    try {
      await postRequest(`${url}/21303/agree`, undefined, token.user3)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 400)
      should.equal(_.get(err, 'response.body.message'), `You can't agree to this terms of use before you have agreed to all the dependencies terms of use.`)
    }
  })

  it(`failure - user was banned`, async () => {
    try {
      await postRequest(`${url}/21303/agree`, undefined, token.user4)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 403)
      should.equal(_.get(err, 'response.body.message'), `Sorry, you can not agree to this terms of use.`)
    }
  })

  it('failure - terms of use not found', async () => {
    try {
      await postRequest(`${url}/121303/agree`, undefined, token.user1)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 404)
      should.equal(_.get(err, 'response.body.message'), `Terms of use with id: 121303 doesn't exists.`)
    }
  })

  it('failure - terms of use not found', async () => {
    try {
      await postRequest(`${url}/21304/agree`, undefined, token.user1)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 400)
      should.equal(_.get(err, 'response.body.message'), `The term is not electronically agreeable.`)
    }
  })

  it(`failure - invalid parameter termsOfUseId`, async () => {
    try {
      await postRequest(`${url}/string/agree`, undefined, token.user1)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 400)
      should.equal(_.get(err, 'response.body.message'), `"termsOfUseId" must be a number`)
    }
  })

  it('failure - M2M not supported', async () => {
    try {
      await postRequest(`${url}/21303/agree`, undefined, token.m2m)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 403)
      should.equal(_.get(err, 'response.body.message'), 'M2M token is not supported')
    }
  })

  it('failure - invalid token', async () => {
    try {
      await postRequest(`${url}/21303/agree`, undefined, 'invalid')
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), 'Invalid Token.')
    }
  })

  it('failure - no token', async () => {
    try {
      await postRequest(`${url}/21303/agree`, undefined)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), 'No token provided.')
    }
  })
})
