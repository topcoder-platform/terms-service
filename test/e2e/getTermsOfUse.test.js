/**
 * E2E test of the get Terms of Use endpoint.
 */

const _ = require('lodash')
const config = require('config')
const should = require('should')
const { token } = require('../common/testData')
const { getRequest, clearLogs } = require('../common/testHelper')

const url = `http://localhost:${config.PORT}/terms`

module.exports = describe('Get terms of use endpoint', () => {
  beforeEach(() => {
    clearLogs()
  })

  it('get terms of use by user who has agreed', async () => {
    const res = await getRequest(`${url}/21303`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.body.id, 21303)
    should.equal(res.body.title, 'Standard Terms for Topcoder Competitions v2.2')
    should.equal(res.body.url, '')
    should.equal(res.body.text, 'text')
    should.equal(res.body.agreed, true)
    should.equal(res.body.agreeabilityType, 'Electronically-agreeable')
  })

  it(`get terms of use by user who hasn't agreed`, async () => {
    const res = await getRequest(`${url}/21303`, token.user2)
    should.equal(res.status, 200)
    should.equal(res.body.id, 21303)
    should.equal(res.body.title, 'Standard Terms for Topcoder Competitions v2.2')
    should.equal(res.body.url, '')
    should.equal(res.body.text, 'text')
    should.equal(res.body.agreed, false)
    should.equal(res.body.agreeabilityType, 'Electronically-agreeable')
  })

  it(`get terms of use noauth`, async () => {
    const res = await getRequest(`${url}/21303?noauth=true`)
    should.equal(res.status, 200)
    should.equal(res.body.id, 21303)
    should.equal(res.body.title, 'Standard Terms for Topcoder Competitions v2.2')
    should.equal(res.body.url, '')
    should.equal(res.body.text, 'text')
    should.not.exist(res.body.agreed)
    should.equal(res.body.agreeabilityType, 'Electronically-agreeable')
  })

  it(`get terms of use noauth using m2m token`, async () => {
    const res = await getRequest(`${url}/21303?noauth=true`, token.m2mWrite)
    should.equal(res.status, 200)
    should.equal(res.body.id, 21303)
    should.equal(res.body.title, 'Standard Terms for Topcoder Competitions v2.2')
    should.equal(res.body.url, '')
    should.equal(res.body.text, 'text')
    should.not.exist(res.body.agreed)
    should.equal(res.body.agreeabilityType, 'Electronically-agreeable')
  })

  it(`get terms of use noauth is false with user`, async () => {
    const res = await getRequest(`${url}/21303?noauth=false`, token.user1)
    should.equal(res.status, 200)
    should.equal(res.body.id, 21303)
    should.equal(res.body.title, 'Standard Terms for Topcoder Competitions v2.2')
    should.equal(res.body.url, '')
    should.equal(res.body.text, 'text')
    should.equal(res.body.agreed, true)
    should.equal(res.body.agreeabilityType, 'Electronically-agreeable')
  })

  it(`get terms of use with docusignTemplateId`, async () => {
    const res = await getRequest(`${url}/21304?noauth=true`)
    should.equal(res.status, 200)
    should.equal(res.body.id, 21304)
    should.equal(res.body.title, 'Standard Terms for Topcoder Competitions v2.2')
    should.equal(res.body.url, '')
    should.equal(res.body.text, 'another text')
    should.not.exist(res.body.agreed)
    should.equal(res.body.docusignTemplateId, '100')
    should.equal(res.body.agreeabilityType, 'Docusign-template')
  })

  it('failure - get terms of use missing Docusign template', async () => {
    try {
      await getRequest(`${url}/21305?noauth=true`)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 500)
      should.equal(_.get(err, 'response.body.message'), 'Docusign template id is missing.')
    }
  })

  it(`failure - invalid parameter termsOfUseId`, async () => {
    try {
      await getRequest(`${url}/string?noauth=true`)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 400)
      should.equal(_.get(err, 'response.body.message'), `"termsOfUseId" must be a number`)
    }
  })

  it('failure - get terms of use not found', async () => {
    try {
      await getRequest(`${url}/1121305?noauth=true`)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 404)
      should.equal(_.get(err, 'response.body.message'), `Terms of use with id: 1121305 doesn't exists.`)
    }
  })

  it('failure - missing authentication', async () => {
    try {
      await getRequest(`${url}/21303`)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), `Authentication credential was missing.`)
    }
  })

  it('failure - missing authentication(using m2m token)', async () => {
    try {
      await getRequest(`${url}/21303`, token.m2mRead)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), `Authentication credential was missing.`)
    }
  })

  it('failure - invalid token', async () => {
    try {
      await getRequest(`${url}/21303`, 'invalid')
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 401)
      should.equal(_.get(err, 'response.body.message'), 'Invalid Token.')
    }
  })
})
