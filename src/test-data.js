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
  'not-exist-2': '316929f6-6134-11ea-9183-3c15c2e2c206'
}

const agreeabilityTypeIdsMapping = {
  1 : '2285af84-61f4-11ea-9a2c-3c15c2e2c206',
  2 : '282f857c-61f4-11ea-a4ef-3c15c2e2c206',
  3 : '2c78f834-61f4-11ea-bd4f-3c15c2e2c206',
  4 : '301a36ec-61f4-11ea-bc96-3c15c2e2c206',
  'not-exist': 'ceba3d90-61f6-11ea-99b6-3c15c2e2c206'
}

const insertData = async () => {
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
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[20754],
    legacyId: 20754,
    text: 'text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date()
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[21303],
    legacyId: 21303,
    text: 'text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date()
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[21304],
    legacyId: 21304,
    text: 'another text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[4],
    created: new Date()
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[21305],
    legacyId: 21305,
    text: 'failure test case',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[4],
    created: new Date()
  })
  await TermsOfUseDocusignTemplateXref.create({
    termsOfUseId: termsOfUseIdsMapping[21304],
    docusignTemplateId: "100"
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
    created: new Date()
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[21307],
    legacyId: 21307,
    text: 'text',
    typeId: 10,
    title: 'Standard Terms for Topcoder Competitions v2.2',
    url: '',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date()
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
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 23124329,
    termsOfUseId: termsOfUseIdsMapping[21307],
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 151743,
    termsOfUseId: termsOfUseIdsMapping[21306],
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 151743,
    termsOfUseId: termsOfUseIdsMapping[21307],
    created: new Date()
  })
  await UserTermsOfUseXref.create({
    userId: 16096823,
    termsOfUseId: termsOfUseIdsMapping[21306],
    created: new Date()
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
    created: new Date()
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[30001],
    legacyId: 30001,
    text: 'test-for-update',
    typeId: 10,
    title: 'test-title',
    url: 'test-url',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[4],
    created: new Date()
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
    created: new Date()
  })
  await TermsOfUse.create({
    id: termsOfUseIdsMapping[40000],
    legacyId: 40000,
    text: 'test-for-delete',
    typeId: 10,
    title: 'test-title',
    url: 'test-url',
    agreeabilityTypeId: agreeabilityTypeIdsMapping[3],
    created: new Date()
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
