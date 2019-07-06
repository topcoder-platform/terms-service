/**
 * Unit test of TermsOfUseService - create terms of use.
 */

const _ = require('lodash')
const should = require('should')
const service = require('../../src/services/TermsOfUseService')
const models = require('../../src/models')
const { user, request } = require('../common/testData')
const { assertError, assertValidationError, clearLogs } = require('../common/testHelper')

const TermsOfUse = models.TermsOfUse
const TermsOfUseDocusignTemplateXref = models.TermsOfUseDocusignTemplateXref

module.exports = describe('create terms of use', () => {
  beforeEach(() => {
    clearLogs()
  })

  it('create terms of use without docusign template success', async () => {
    let data = _.cloneDeep(request.createTermsOfUse.reqBody)
    data = _.omit(data, 'docusignTemplateId')
    data.agreeabilityTypeId = 3
    const entity = await service.createTermsOfUse(user.user1, data)
    const record = await TermsOfUse.findOne({ where: { id: entity.id, deletedAt: null }, raw: true })
    should.equal(record.text, 'text')
    should.equal(record.typeId, 10)
    should.equal(record.title, 'title')
    should.equal(record.url, 'url')
    should.equal(record.agreeabilityTypeId, 3)
    const existed = await TermsOfUseDocusignTemplateXref.findAll({ where: { termsOfUseId: entity.id }, raw: true })
    should.equal(existed.length, 0)
  })

  it('create terms of use without docusign template using m2m success', async () => {
    let data = _.cloneDeep(request.createTermsOfUse.reqBody)
    data = _.omit(data, 'docusignTemplateId')
    data.agreeabilityTypeId = 3
    const entity = await service.createTermsOfUse(user.m2mWrite, data)
    const record = await TermsOfUse.findOne({ where: { id: entity.id, deletedAt: null }, raw: true })
    should.equal(record.text, 'text')
    should.equal(record.typeId, 10)
    should.equal(record.title, 'title')
    should.equal(record.url, 'url')
    should.equal(record.agreeabilityTypeId, 3)
    should.equal(record.createdBy, user.m2mWrite.sub)
    const existed = await TermsOfUseDocusignTemplateXref.findAll({ where: { termsOfUseId: entity.id }, raw: true })
    should.equal(existed.length, 0)
  })

  it('create terms of use with docusign template success', async () => {
    const entity = await service.createTermsOfUse(user.user1, request.createTermsOfUse.reqBody)
    const record = await TermsOfUse.findOne({ where: { id: entity.id, deletedAt: null }, raw: true })
    should.equal(record.text, 'text')
    should.equal(record.typeId, 10)
    should.equal(record.title, 'title')
    should.equal(record.url, 'url')
    should.equal(record.agreeabilityTypeId, 4)
    const existed = await TermsOfUseDocusignTemplateXref.findAll({ where: { termsOfUseId: entity.id }, raw: true })
    should.equal(existed.length, 1)
    should.equal(existed[0].docusignTemplateId, 'test-template-1')
  })

  it('failure - no terms of use agreeability type found', async () => {
    let data = _.cloneDeep(request.createTermsOfUse.reqBody)
    data.agreeabilityTypeId = 100
    try {
      await service.createTermsOfUse(user.user1, data)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'BadRequestError')
      assertError(err, `TermsOfUseAgreeabilityType not found with id: 100`)
    }
  })

  it('failure - docusign template is missing', async () => {
    let data = _.cloneDeep(request.createTermsOfUse.reqBody)
    data = _.omit(data, 'docusignTemplateId')
    try {
      await service.createTermsOfUse(user.user1, data)
      throw new Error('should not throw error here')
    } catch (err) {
      assertValidationError(err, `"docusignTemplateId" is required`)
    }
  })
})
