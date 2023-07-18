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
const TermsOfUseType = models.TermsOfUseType

logger.info('Insert test data into database.')

const termsOfUseIdsMapping = {
  21306: '0181d416-6131-11ea-b3fb-3c15c2e2c206',
  21307: '055135a0-6131-11ea-818f-3c15c2e2c206',
  21303: '5248ebfc-612f-11ea-8e8b-3c15c2e2c206',
  40001: '5601eae0-6162-11ea-a957-3c15c2e2c206',
  40002: '5e3039c4-6162-11ea-b48d-3c15c2e2c206',
  40003: '605f4910-6162-11ea-9304-3c15c2e2c206',
  21304: '998cdd42-6130-11ea-8ed5-3c15c2e2c206',
  21305: '9cd0eda4-6130-11ea-9d3a-3c15c2e2c206',
  30000: '9f5ef7be-6130-11ea-be4f-3c15c2e2c206',
  30001: 'a1ee97a0-6130-11ea-b4f6-3c15c2e2c206',
  30002: 'a696e4f6-6130-11ea-9277-3c15c2e2c206',
  20754: 'db39ac76-612f-11ea-9c41-3c15c2e2c206',
  40000: 'a93ffa9e-6130-11ea-96a6-3c15c2e2c206',
  'not-exist-1': '2b392e3c-6134-11ea-85f1-3c15c2e2c206',
  'not-exist-2': '316929f6-6134-11ea-9183-3c15c2e2c206',
  'not-published': '00000000-0000-0000-0000-000000000000',
  'nda0': '00000000-0000-0000-0000-000000000001'
}

const agreeabilityTypeIdsMapping = {
  1: '2285af84-61f4-11ea-9a2c-3c15c2e2c206',
  2: '282f857c-61f4-11ea-a4ef-3c15c2e2c206',
  3: '2c78f834-61f4-11ea-bd4f-3c15c2e2c206',
  4: '301a36ec-61f4-11ea-bc96-3c15c2e2c206',
  5: '999a26ad-b334-453c-8425-165d4cf496d7',
  'not-exist': 'ceba3d90-61f6-11ea-99b6-3c15c2e2c206'
}

const insertData = async () => {
  await TermsOfUseType.create({ id: 1, name: 'High School Web Site Terms' })
  await TermsOfUseType.create({ id: 2, name: 'Corp Site Terms of Use' })
  await TermsOfUseType.create({ id: 3, name: 'General Product Terms of Use' })
  await TermsOfUseType.create({ id: 4, name: 'Product Terms of Use' })
  await TermsOfUseType.create({ id: 5, name: 'Contest' })
  await TermsOfUseType.create({ id: 6, name: 'Reviewer Terms' })
  await TermsOfUseType.create({ id: 7, name: 'Testing Tool NDA' })
  await TermsOfUseType.create({ id: 8, name: 'Site Terms of Use' })
  await TermsOfUseType.create({ id: 9, name: 'Download Submission Terms of Use' })
  await TermsOfUseType.create({ id: 10, name: 'data-test-typeId 10' })
  await TermsOfUseType.create({ id: 11, name: 'data-test-typeId 11' })

  await TermsOfUseAgreeabilityType.create({
    id: agreeabilityTypeIdsMapping[3],
    legacyId: 3,
    name: 'Electronically-agreeable',
    description: 'Electronically-agreeable'
  })
  await TermsOfUseAgreeabilityType.create({
    id: agreeabilityTypeIdsMapping[4],
    legacyId: 4,
    name: 'Docusign-template',
    description: 'Docusign-template'
  })
  await TermsOfUseAgreeabilityType.create({
    id: agreeabilityTypeIdsMapping[5],
    legacyId: 5,
    name: 'Docusign-template',
    description: 'Docusign-template'
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[20754],
    legacyId: 20754,
    text: 'text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date(),
    isPublished: true
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[21303],
    legacyId: 21303,
    text: 'text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date(),
    isPublished: true
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[21304],
    legacyId: 21304,
    text: 'another text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[4],
    created: new Date(),
    isPublished: true
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[21305],
    legacyId: 21305,
    text: 'failure test case',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[4],
    created: new Date(),
    isPublished: true
  })
  await TermsOfUseDocusignTemplateXref.create({
    termsOfUseId: termsOfUseIdsMapping[21304],
    docusignTemplateId: '100'
  })
  await TermsOfUseDocusignTemplateXref.create({
    termsOfUseId: termsOfUseIdsMapping[20754],
    docusignTemplateId: config.DOCUSIGN.ASSIGNMENT_V2_TEMPLATE_ID
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[21306],
    legacyId: 21306,
    text: 'text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date(),
    isPublished: true
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[21307],
    legacyId: 21307,
    text: 'text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date(),
    isPublished: true
  })
  await TermsOfUseDependency.create({
    dependentTermsOfUseId: termsOfUseIdsMapping[21303],
    dependencyTermsOfUseId: termsOfUseIdsMapping[21306]
  })
  await TermsOfUseDependency.create({
    dependentTermsOfUseId: termsOfUseIdsMapping[21303],
    dependencyTermsOfUseId: termsOfUseIdsMapping[21307]
  })
  await UserTermsOfUseXref.create({
    userId: 16096823,
    termsOfUseId: termsOfUseIdsMapping[20754],
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 8547899,
    termsOfUseId: termsOfUseIdsMapping[21303],
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 23124329,
    termsOfUseId: termsOfUseIdsMapping[21306],
    created: new Date('2020-09-24T00:00:00.000Z')
  })
  await UserTermsOfUseXref.create({
    userId: 23124329,
    termsOfUseId: termsOfUseIdsMapping[21307],
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 151743,
    termsOfUseId: termsOfUseIdsMapping[21306],
    created: new Date('2020-09-26T00:00:00.000Z')
  })
  await UserTermsOfUseXref.create({
    userId: 151743,
    termsOfUseId: termsOfUseIdsMapping[21307],
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 16096823,
    termsOfUseId: termsOfUseIdsMapping[21306],
    created: new Date('2020-09-28T00:00:00.000Z')
  })
  await UserTermsOfUseBanXref.create({
    userId: 151743,
    termsOfUseId: termsOfUseIdsMapping[21303],
    created: new Date()
  })
  await UserTermsOfUseBanXref.create({
    userId: 23124329,
    termsOfUseId: termsOfUseIdsMapping[20754],
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
    id: termsOfUseIdsMapping[30000],
    legacyId: 30000,
    text: 'test-for-update',
    typeId: 10,
    title: 'test-title',
    url: 'test-url',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date(),
    isPublished: true
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[30001],
    legacyId: 30001,
    text: 'test-for-update',
    typeId: 10,
    title: 'test-title',
    url: 'test-url',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[4],
    created: new Date(),
    isPublished: true
  })
  await TermsOfUseDocusignTemplateXref.create({
    termsOfUseId: termsOfUseIdsMapping[30001],
    docusignTemplateId: 'template-id-1'
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[30002],
    legacyId: 30002,
    text: 'test-for-update',
    typeId: 10,
    title: 'test-title',
    url: 'test-url',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date(),
    isPublished: true
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[40000],
    legacyId: 40000,
    text: 'test-for-delete',
    typeId: 10,
    title: 'test-title',
    url: 'test-url',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date(),
    isPublished: true
  })
  await TermsOfUseDocusignTemplateXref.create({
    termsOfUseId: termsOfUseIdsMapping[30002],
    docusignTemplateId: 'template-id-2'
  })
  await TermsForResource.create({
    id: 'a41d1974-5823-473e-bacb-7eed17500ad1',
    reference: 'challenge',
    referenceId: '12345',
    tag: 'submitter',
    termsOfUseIds: [termsOfUseIdsMapping[21303], termsOfUseIdsMapping[21304]],
    created: new Date(),
    createdBy: 'admin'
  })
  await TermsForResource.create({
    id: 'a41d1974-5823-473e-bacb-7eed17500ad2',
    reference: 'challenge',
    referenceId: '12345',
    tag: 'copilot',
    termsOfUseIds: [termsOfUseIdsMapping[21307]],
    created: new Date(),
    createdBy: 'admin'
  })
  await TermsForResource.create({
    id: 'a41d1974-5823-473e-bacb-7eed17500ad3',
    reference: 'challenge',
    referenceId: '12345',
    tag: 'manager',
    termsOfUseIds: [termsOfUseIdsMapping[21307]],
    created: new Date(),
    createdBy: 'admin'
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping['not-published'],
    text: 'test-for-unpublished-term',
    typeId: 10,
    title: 'Unpublished term',
    url: 'test-url',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date(),
    key: 'nda',
    isPublished: false,
    version: '1.1.0'
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping['nda0'],
    text: 'test-for-key-search',
    typeId: 10,
    title: 'term with key',
    url: 'test-url',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date(),
    key: 'nda',
    isPublished: true,
    version: '1.0.0'
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
  insertData,
  termsOfUseIdsMapping,
  agreeabilityTypeIdsMapping
}
