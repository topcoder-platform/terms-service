/**
 * Unit test of TermsForResourceService - get/delete terms for resource.
 */

const should = require('should')
const service = require('../../src/services/TermsForResourceService')
const models = require('../../src/models')
const { assertError, clearLogs } = require('../common/testHelper')

const TermsForResource = models.TermsForResource

module.exports = describe('get and delete terms for resource', () => {
  beforeEach(() => {
    clearLogs()
  })

  const id = 'a41d1974-5823-473e-bacb-7eed17500ad1'
  const id2 = 'a41d1974-5823-473e-bacb-7eed17500ad2'
  const notFoundId = 'b41d1974-5823-473e-bacb-7eed17500ad1'

  it('Get terms for resource success', async () => {
    const record = await service.getTermsForResource(id)
    should.equal(record.reference, 'new-reference')
    should.equal(record.referenceId, '11111')
    should.equal(record.tag, 'tester')
    should.equal(record.termsOfUseIds.length, 1)
    should.equal(record.termsOfUseIds[0], 21305)
    should.equal(record.createdBy, 'admin')
    should.exist(record.created)
    should.equal(record.updatedBy, 'TonyJ')
    should.exist(record.updated)
  })

  it('Failure - get terms for resource not found', async () => {
    try {
      await service.getTermsForResource(notFoundId)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'NotFoundError')
      assertError(err, `TermsForResource not found with id: ${notFoundId}`)
    }
  })

  it('Delete terms for resource success', async () => {
    await service.deleteTermsForResource(id)
    const record = await TermsForResource.findOne({ where: { id }, raw: true })
    should.not.exist(record)
  })

  it('Delete terms for resource 2 success', async () => {
    await service.deleteTermsForResource(id2)
    const record = await TermsForResource.findOne({ where: { id: id2 }, raw: true })
    should.not.exist(record)
  })

  it('Failure - delete terms for resource not found', async () => {
    try {
      await service.deleteTermsForResource(notFoundId)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.name, 'NotFoundError')
      assertError(err, `TermsForResource not found with id: ${notFoundId}`)
    }
  })
})
