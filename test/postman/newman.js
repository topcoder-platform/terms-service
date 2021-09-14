const apiTestLib = require('tc-api-testing-lib')
const logger = require('../../src/common/logger')
const helper = require('../../src/common/helper')
const config = require('config')
const {clearTestData} = require('./clearTestData')

const requests = [
  {
    folder: 'create terms of use by admin',
    iterationData: require('./testData/terms-of-use/create-terms-of-use-by-admin.json')
  },
  {
    folder: 'create terms of use by m2m',
    iterationData: require('./testData/terms-of-use/create-terms-of-use-by-m2m.json')
  },
  {
    folder: 'create terms of use with any optional fields',
    iterationData: require('./testData/terms-of-use/create-terms-of-use-with-any-optional-fields.json')
  },
  {
    folder: 'create terms of use with all kinds of invalid request body',
    iterationData: require('./testData/terms-of-use/create-terms-of-use-with-invalid-data.json')
  },
  {
    folder: 'create terms of use with all kinds of invalid token',
    iterationData: require('./testData/terms-of-use/create-terms-of-use-with-invalid-tokens.json')
  },
  {
    folder: 'partially update terms of use with any field by admin',
    iterationData: require('./testData/terms-of-use/partially-update-terms-of-use-with-any-fields-by-admin.json')
  },
  {
    folder: 'partially update terms of use with any field by m2m',
    iterationData: require('./testData/terms-of-use/partially-update-terms-of-use-with-any-fields-by-m2m.json')
  },
  {
    folder: 'partially update terms of use with invalid request body',
    iterationData: require('./testData/terms-of-use/partially-update-terms-of-use-with-invalid-data.json')
  },
  {
    folder: 'partially update terms of use with all kinds of invalid token',
    iterationData: require('./testData/terms-of-use/partially-update-terms-of-use-with-invalid-tokens.json')
  },
  {
    folder: 'fully update terms of use by admin',
    iterationData: require('./testData/terms-of-use/fully-update-terms-of-use-by-admin.json')
  },
  {
    folder: 'fully update terms of use by m2m',
    iterationData: require('./testData/terms-of-use/fully-update-terms-of-use-by-m2m.json')
  },
  {
    folder: 'fully update terms of use with any optional fields',
    iterationData: require('./testData/terms-of-use/fully-update-terms-of-use-with-any-optional-fields.json')
  },
  {
    folder: 'fully update terms of use with all kinds of invalid token',
    iterationData: require('./testData/terms-of-use/fully-update-terms-of-use-with-invalid-tokens.json')
  },
  {
    folder: 'fully update terms of use with invalid request body',
    iterationData: require('./testData/terms-of-use/fully-update-terms-of-use-with-invalid-data.json')
  },
  {
    folder: 'search terms of use by default values'
  },
  {
    folder: 'search terms of use with various parameters',
    iterationData: require('./testData/terms-of-use/search-terms-of-use-with-various-parameters.json')
  },
  {
    folder: 'search terms of use with invalid parameters',
    iterationData: require('./testData/terms-of-use/search-terms-of-use-with-invalid-parameters.json')
  },
  {
    folder: 'get term of use',
    iterationData: require('./testData/terms-of-use/get-terms-of-use.json')
  },
  {
    folder: 'get term of use with all invalid request',
    iterationData: require('./testData/terms-of-use/get-terms-of-use-with-invalid-data.json')
  },
  {
    folder: 'agree terms of use by user'
  },
  {
    folder: 'agree terms of use with all invalid request',
    iterationData: require('./testData/terms-of-use/agree-terms-of-use-with-invalid-request-data.json')
  },
  {
    folder: 'agree terms of use with all kinds of invalid token',
    iterationData: require('./testData/terms-of-use/agree-terms-of-use-with-invalid-tokens.json')
  },
  {
    folder: 'get terms of use users by admin',
    iterationData: require('./testData/terms-of-use/get-terms-of-use-users-by-admin.json')
  },
  {
    folder: 'get terms of use users by m2m',
    iterationData: require('./testData/terms-of-use/get-terms-of-use-users-by-m2m.json')
  },
  {
    folder: 'get terms of use users with various parameters',
    iterationData: require('./testData/terms-of-use/get-terms-of-use-users-with-various-parameters.json')
  },
  {
    folder: 'get terms of use users with invalid parameters',
    iterationData: require('./testData/terms-of-use/get-terms-of-use-users-with-invalid-parameters.json')
  },
  {
    folder: 'get terms of use users with all kinds of invalid token',
    iterationData: require('./testData/terms-of-use/get-terms-of-use-users-with-invalid-tokens.json')
  },
  {
    folder: 'sign a user by admin',
    iterationData: require('./testData/terms-of-use/sign-terms-of-use-user-by-admin.json')
  },
  {
    folder: 'sign a user by m2m',
    iterationData: require('./testData/terms-of-use/sign-terms-of-use-user-by-m2m.json')
  },
  {
    folder: 'sign a user with all kinds of invalid token',
    iterationData: require('./testData/terms-of-use/sign-terms-of-use-user-with-invalid-tokens.json')
  },
  {
    folder: 'sign a user with all kinds of invalid request body',
    iterationData: require('./testData/terms-of-use/sign-terms-of-use-user-with-invalid-data.json')
  },
  {
    folder: 'unsign a user by admin',
    iterationData: require('./testData/terms-of-use/unsign-terms-of-use-user-by-admin.json')
  },
  {
    folder: 'unsign a user by m2m',
    iterationData: require('./testData/terms-of-use/unsign-terms-of-use-user-by-m2m.json')
  },
  {
    folder: 'unsign a user with all kinds of invalid token',
    iterationData: require('./testData/terms-of-use/unsign-terms-of-use-user-with-invalid-tokens.json')
  },
  {
    folder: 'unsign a user with all kinds of invalid request',
    iterationData: require('./testData/terms-of-use/unsign-terms-of-use-user-with-invalid-data.json')
  },
  {
    folder: 'delete terms of use by admin'
  },
  {
    folder: 'delete terms of use by m2m'
  },
  {
    folder: 'delete terms of use with all kinds of invalid token',
    iterationData: require('./testData/terms-of-use/delete-terms-of-use-with-invalid-tokens.json')
  },
  {
    folder: 'delete terms of use with all kinds of invalid request',
    iterationData: require('./testData/terms-of-use/delete-terms-of-use-with-invalid-data.json')
  },
  {
    folder: 'get terms types by admin'
  },
  {
    folder: 'get terms types by m2m'
  },
  {
    folder: 'get terms types with all kinds of invalid token',
    iterationData: require('./testData/types/get-terms-types-with-invalid-tokens.json')
  },
  {
    folder: 'get agreeability types by admin'
  },
  {
    folder: 'get agreeability types by m2m'
  },
  {
    folder: 'get agreeability types with all kinds of invalid token',
    iterationData: require('./testData/agreeability-types/get-agreeability-types-with-invalid-tokens.json')
  },
  {
    folder: 'get agreeability type by id from admin',
    iterationData: require('./testData/agreeability-types/get-agreeability-type-by-id-from-admin.json')
  },
  {
    folder: 'get agreeability type by id from m2m',
    iterationData: require('./testData/agreeability-types/get-agreeability-type-by-id-from-m2m.json')
  },
  {
    folder: 'get agreeability type by id with all kinds of invalid token',
    iterationData: require('./testData/agreeability-types/get-agreeability-type-by-id-with-invalid-tokens.json')
  },
  {
    folder: 'get agreeability type by id with all kinds of invalid data',
    iterationData: require('./testData/agreeability-types/get-agreeability-type-by-id-with-invalid-data.json')
  },
  {
    folder: 'create terms for resource by admin',
    iterationData: require('./testData/terms-reference/create-terms-for-reference-by-admin.json')
  },
  {
    folder: 'create terms for resource by m2m',
    iterationData: require('./testData/terms-reference/create-terms-for-reference-by-m2m.json')
  },
  {
    folder: 'create terms for reference with all kinds of invalid token',
    iterationData: require('./testData/terms-reference/create-terms-for-reference-with-invalid-tokens.json')
  },
  {
    folder: 'create terms for reference with all kinds of invalid request body',
    iterationData: require('./testData/terms-reference/create-terms-for-reference-with-invalid-data.json')
  },
  {
    folder: 'search terms for resource by default values by admin'
  },
  {
    folder: 'search terms for resource by default values by m2m'
  },
  {
    folder: 'search terms for reference with all kinds of invalid token',
    iterationData: require('./testData/terms-reference/search-terms-for-reference-with-invalid-tokens.json')
  },
  {
    folder: 'search terms for reference with various parameters',
    iterationData: require('./testData/terms-reference/search-terms-for-reference-with-various-parameters.json')
  },
  {
    folder: 'search terms for reference with invalid parameters',
    iterationData: require('./testData/terms-reference/search-terms-for-reference-with-invalid-parameters.json')
  },
  {
    folder: 'get terms for resource by admin',
    iterationData: require('./testData/terms-reference/get-terms-for-reference-by-admin.json')
  },
  {
    folder: 'get terms for resource by m2m',
    iterationData: require('./testData/terms-reference/get-terms-for-reference-by-m2m.json')
  },
  {
    folder: 'get terms for reference with all kinds of invalid token',
    iterationData: require('./testData/terms-reference/get-terms-for-reference-with-invalid-tokens.json')
  },
  {
    folder: 'get terms for reference with all kinds of invalid id',
    iterationData: require('./testData/terms-reference/get-terms-for-reference-with-invalid-id.json')
  },
  {
    folder: 'partially update terms for resource with any field by admin',
    iterationData: require('./testData/terms-reference/partially-update-terms-for-reference-with-any-fields-by-admin.json')
  },
  {
    folder: 'partially update terms for resource with any field by m2m',
    iterationData: require('./testData/terms-reference/partially-update-terms-for-reference-with-any-fields-by-m2m.json')
  },
  {
    folder: 'partially update terms for resource with invalid request body',
    iterationData: require('./testData/terms-reference/partially-update-terms-for-reference-with-invalid-data.json')
  },
  {
    folder: 'partially update terms for resource with all kinds of invalid token',
    iterationData: require('./testData/terms-reference/partially-update-terms-for-reference-with-invalid-tokens.json')
  },
  {
    folder: 'fully update terms for resource by admin',
    iterationData: require('./testData/terms-reference/fully-update-terms-for-reference-by-admin.json')
  },
  {
    folder: 'fully update terms for resource by m2m',
    iterationData: require('./testData/terms-reference/fully-update-terms-for-reference-by-m2m.json')
  },
  {
    folder: 'fully update terms for resource with all kinds of invalid token',
    iterationData: require('./testData/terms-reference/fully-update-terms-for-reference-with-invalid-tokens.json')
  },
  {
    folder: 'fully update terms for resource with invalid request body',
    iterationData: require('./testData/terms-reference/fully-update-terms-for-reference-with-invalid-data.json')
  },
  {
    folder: 'delete terms for resource by admin'
  },
  {
    folder: 'delete terms for resource by m2m'
  },
  {
    folder: 'delete terms for resource with all kinds of invalid token',
    iterationData: require('./testData/terms-reference/delete-terms-for-reference-with-invalid-tokens.json')
  },
  {
    folder: 'delete terms for resource with all kinds of invalid request',
    iterationData: require('./testData/terms-reference/delete-terms-for-reference-with-invalid-data.json')
  },
  {
    folder: 'check the user terms for resource with parameters by admin',
    iterationData: require('./testData/terms-reference/check-terms-for-reference-with-various-parameters-admin.json')
  },
  {
    folder: 'check the user terms for resource with parameters by m2m',
    iterationData: require('./testData/terms-reference/check-terms-for-reference-with-various-parameters-m2m.json')
  },
  {
    folder: 'check the user terms for reference with all kinds of invalid token',
    iterationData: require('./testData/terms-reference/check-terms-for-reference-with-invalid-tokens.json')
  },
  {
    folder: 'check the user terms for reference with invalid parameters',
    iterationData: require('./testData/terms-reference/check-terms-for-reference-with-invalid-parameters.json')
  },
  {
    folder: 'generate docusign view url by admin',
    iterationData: require('./testData/generate-docusign/generate-docusign-by-admin.json')
  },
  {
    folder: 'generate docusign with all kinds of invalid token',
    iterationData: require('./testData/generate-docusign/generate-docusign-with-invalid-tokens.json')
  },
  {
    folder: 'generate docusign view url by template id only',
    iterationData: require('./testData/generate-docusign/generate-docusign-template-id-only.json')
  },
  {
    folder: 'generate docusign view url with all kinds of invalid request body',
    iterationData: require('./testData/generate-docusign/generate-docusign-with-invalid-data.json')
  },
  {
    folder: 'generate docusign view url by user',
    iterationData: require('./testData/generate-docusign/generate-docusign-by-user.json')
  }
]


/**
 * Run the postman tests.
 */
apiTestLib.runTests(requests, require.resolve('./terms-api.postman_collection.json'),
                      require.resolve('./terms-api.postman_environment.json')).then(async () => {
                        logger.info('newman test completed!')
                        await clearTestData()
                      }).catch(async (err) => {
                        logger.logFullError(err)

                        // Only calling the clean up function when it is not validation error.
                        if (err.name !== 'ValidationError') {
                          await clearTestData()
                        }
                      })
