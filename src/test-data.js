/**
 * Insert test data to database.
 */
require('../app-bootstrap')
const config = require('config')
const models = require('./models')
const logger = require('./common/logger')

const TermsOfUse = models.TermsOfUse
const TermsOfUseAgreeabilityType = models.TermsOfUseAgreeabilityType
const UserTermsOfUseXref = models.UserTermsOfUseXref
const TermsOfUseDocusignTemplateXref = models.TermsOfUseDocusignTemplateXref
const UserTermsOfUseBanXref = models.UserTermsOfUseBanXref
const TermsOfUseDependency = models.TermsOfUseDependency
const DocusignEnvelope = models.DocusignEnvelope
const TermsForResource = models.TermsForResource

logger.info('Insert test data into database.')

const insertData = async () => {
  await TermsOfUseAgreeabilityType.create({
    id: 3,
    name: 'Electronically-agreeable',
    description: 'Electronically-agreeable'
  })
  await TermsOfUseAgreeabilityType.create({
    id: 4,
    name: 'Docusign-template',
    description: 'Docusign-template'
  })
  await TermsOfUse.create({
    id: 20754,
    text: 'text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: 3,
    created: new Date()
  })
  await TermsOfUse.create({
    id: 21303,
    text: 'text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: 3,
    created: new Date()
  })
  await TermsOfUse.create({
    id: 21304,
    text: 'another text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: 4,
    created: new Date()
  })
  await TermsOfUse.create({
    id: 21305,
    text: 'failure test case',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: 4,
    created: new Date()
  })
  await TermsOfUseDocusignTemplateXref.create({
    termsOfUseId: 21304,
    docusignTemplateId: 100
  })
  await TermsOfUseDocusignTemplateXref.create({
    termsOfUseId: 20754,
    docusignTemplateId: config.DOCUSIGN.ASSIGNMENT_V2_TEMPLATE_ID
  })
  await TermsOfUse.create({
    id: 21306,
    text: 'text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: 3,
    created: new Date()
  })
  await TermsOfUse.create({
    id: 21307,
    text: 'text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: 3,
    created: new Date()
  })
  await TermsOfUseDependency.create({
    dependentTermsOfUseId: 21303,
    dependencyTermsOfUseId: 21306
  })
  await TermsOfUseDependency.create({
    dependentTermsOfUseId: 21303,
    dependencyTermsOfUseId: 21307
  })
  await UserTermsOfUseXref.create({
    userId: 16096823,
    termsOfUseId: 20754,
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 8547899,
    termsOfUseId: 21303,
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 23124329,
    termsOfUseId: 21306,
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 23124329,
    termsOfUseId: 21307,
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 151743,
    termsOfUseId: 21306,
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 151743,
    termsOfUseId: 21307,
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 16096823,
    termsOfUseId: 21306,
    created: new Date()
  })
  await UserTermsOfUseBanXref.create({
    userId: 151743,
    termsOfUseId: 21303,
    created: new Date()
  })
  await UserTermsOfUseBanXref.create({
    userId: 23124329,
    termsOfUseId: 20754,
    created: new Date()
  })
  await DocusignEnvelope.create({
    id: 'test-fail-id',
    docusignTemplateId: config.DOCUSIGN.ASSIGNMENT_V2_TEMPLATE_ID,
    userId: '12345',
    isCompleted: 0
  })
  await DocusignEnvelope.create({
    id: 'no-template-found',
    docusignTemplateId: '12345678',
    userId: '12345',
    isCompleted: 0
  })
  await TermsOfUse.create({
    id: 30000,
    text: 'test-for-update',
    typeId: 10,
    title: 'test-title',
    url: 'test-url',
    agreeabilityTypeId: 3,
    created: new Date()
  })
  await TermsOfUse.create({
    id: 30001,
    text: 'test-for-update',
    typeId: 10,
    title: 'test-title',
    url: 'test-url',
    agreeabilityTypeId: 4,
    created: new Date()
  })
  await TermsOfUseDocusignTemplateXref.create({
    termsOfUseId: 30001,
    docusignTemplateId: 'template-id-1'
  })
  await TermsOfUse.create({
    id: 30002,
    text: 'test-for-update',
    typeId: 10,
    title: 'test-title',
    url: 'test-url',
    agreeabilityTypeId: 3,
    created: new Date()
  })
  await TermsOfUse.create({
    id: 40000,
    text: 'test-for-delete',
    typeId: 10,
    title: 'test-title',
    url: 'test-url',
    agreeabilityTypeId: 3,
    created: new Date()
  })
  await TermsOfUseDocusignTemplateXref.create({
    termsOfUseId: 30002,
    docusignTemplateId: 'template-id-2'
  })
  await TermsForResource.create({
    id: 'a41d1974-5823-473e-bacb-7eed17500ad1',
    reference: 'challenge',
    referenceId: '12345',
    tag: 'submitter',
    termsOfUseIds: [21303, 21304],
    created: new Date(),
    createdBy: 'admin'
  })
  await TermsForResource.create({
    id: 'a41d1974-5823-473e-bacb-7eed17500ad2',
    reference: 'challenge',
    referenceId: '12345',
    tag: 'copilot',
    termsOfUseIds: [21307],
    created: new Date(),
    createdBy: 'admin'
  })
  await TermsForResource.create({
    id: 'a41d1974-5823-473e-bacb-7eed17500ad3',
    reference: 'challenge',
    referenceId: '12345',
    tag: 'manager',
    termsOfUseIds: [21307],
    created: new Date(),
    createdBy: 'admin'
  })
}

if (!module.parent) {
  insertData().then(() => {
    logger.info('Done!')
    process.exit()
  }).catch((e) => {
    logger.logFullError(e)
    process.exit(1)
  })
}

module.exports = {
  insertData
}
