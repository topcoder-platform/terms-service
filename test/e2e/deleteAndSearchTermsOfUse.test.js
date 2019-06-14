/**
 * E2E test of the delete/search Terms of Use endpoint.
 */

const _ = require('lodash')
const config = require('config')
const should = require('should')
const models = require('../../src/models')
const { token, request } = require('../common/testData')
const { getRequest, deleteRequest } = require('../common/testHelper')

const TermsOfUse = models.TermsOfUse

const url = `http://localhost:${config.PORT}/terms`

module.exports = describe('delete and search terms of use', () => {
  it('search terms of use success', async () => {
    const res = await getRequest(`${url}?page=1&perPage=5`, token.user1)
    should.equal(_.isEqual(res.body.result, request.searchTermsOfUse.response.result), true)
    should.equal(res.headers['x-page'], 1)
    should.equal(res.headers['x-per-page'], 5)
    should.equal(res.headers['x-total'], 11)
    should.equal(res.headers['x-total-pages'], 3)
  })

  it('delete terms of use success', async () => {
    const res = await deleteRequest(`${url}/30000`, token.user1)
    should.equal(res.status, 204)
    const record = await TermsOfUse.findOne({ where: { id: 30000 }, raw: true })
    should.exist(record.deletedAt)
  })

  it('failure - delete terms of use not found', async () => {
    try {
      await deleteRequest(`${url}/20000`, token.user1)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 404)
      should.equal(_.get(err, 'response.body.message'), `TermsOfUse not found with id: 20000`)
    }
  })

  it('failure - search terms of use no token', async () => {
    try {
      await getRequest(`${url}?page=1&perPage=5`)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), 'No token provided.')
    }
  })

  it('failure - search terms of use invalid token', async () => {
    try {
      await getRequest(`${url}?page=1&perPage=5`, 'invalid')
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), 'Invalid Token.')
    }
  })

  it('failure - search terms of use forbidden', async () => {
    try {
      await getRequest(`${url}?page=1&perPage=5`, token.user2)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 403)
      should.equal(_.get(err, 'response.body.message'), `You are not allowed to perform this action!`)
    }
  })

  it('failure - delete terms of use no token', async () => {
    try {
      await deleteRequest(`${url}/30000`)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), 'No token provided.')
    }
  })

  it('failure - delete terms of use invalid token', async () => {
    try {
      await deleteRequest(`${url}/30000`, 'invalid')
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), 'Invalid Token.')
    }
  })

  it('failure - delete terms of use forbidden', async () => {
    try {
      await deleteRequest(`${url}/30000`, token.user2)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 403)
      should.equal(_.get(err, 'response.body.message'), `You are not allowed to perform this action!`)
    }
  })
})
