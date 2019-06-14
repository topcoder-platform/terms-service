/**
 * Contains all routes
 */
const constants = require('../app-constants')

module.exports = {
  '/terms/docusignViewURL': {
    post: {
      controller: 'DocusignController',
      method: 'generateDocusignViewURL',
      auth: 'jwt'
    }
  },
  '/terms/docusignCallback': {
    post: {
      controller: 'DocusignController',
      method: 'docusignCallback'
    }
  },
  '/terms/reference': {
    post: {
      controller: 'TermsForResourceController',
      method: 'createTermsForResource',
      auth: 'jwt',
      access: [constants.UserRoles.Admin]
    },
    get: {
      controller: 'TermsForResourceController',
      method: 'searchTermsForResources',
      auth: 'jwt',
      access: [constants.UserRoles.Admin]
    }
  },
  '/terms': {
    post: {
      controller: 'TermsOfUseController',
      method: 'createTermsOfUse',
      auth: 'jwt',
      access: [constants.UserRoles.Admin]
    },
    get: {
      controller: 'TermsOfUseController',
      method: 'searchTermsOfUses',
      auth: 'jwt',
      access: [constants.UserRoles.Admin]
    }
  },
  '/terms/:termsOfUseId': {
    get: {
      controller: 'TermsOfUseController',
      method: 'getTermsOfUse',
      optionalAuth: 'jwt'
    },
    put: {
      controller: 'TermsOfUseController',
      method: 'fullyUpdateTermsOfUse',
      auth: 'jwt',
      access: [constants.UserRoles.Admin]
    },
    patch: {
      controller: 'TermsOfUseController',
      method: 'partiallyUpdateTermsOfUse',
      auth: 'jwt',
      access: [constants.UserRoles.Admin]
    },
    delete: {
      controller: 'TermsOfUseController',
      method: 'deleteTermsOfUse',
      auth: 'jwt',
      access: [constants.UserRoles.Admin]
    }
  },
  '/terms/:termsOfUseId/agree': {
    post: {
      controller: 'TermsOfUseController',
      method: 'agreeTermsOfUse',
      auth: 'jwt'
    }
  },
  '/terms/reference/:termsForResourceId': {
    get: {
      controller: 'TermsForResourceController',
      method: 'getTermsForResource',
      auth: 'jwt',
      access: [constants.UserRoles.Admin]
    },
    put: {
      controller: 'TermsForResourceController',
      method: 'fullyUpdateTermsForResource',
      auth: 'jwt',
      access: [constants.UserRoles.Admin]
    },
    patch: {
      controller: 'TermsForResourceController',
      method: 'partiallyUpdateTermsForResource',
      auth: 'jwt',
      access: [constants.UserRoles.Admin]
    },
    delete: {
      controller: 'TermsForResourceController',
      method: 'deleteTermsForResource',
      auth: 'jwt',
      access: [constants.UserRoles.Admin]
    }
  },
  '/terms/user/:userId/reference': {
    get: {
      controller: 'TermsForResourceController',
      method: 'checkTermsForResourceOfUser',
      auth: 'jwt',
      access: [constants.UserRoles.Admin]
    }
  }
}
