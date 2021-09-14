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
  '/terms/reference': {
    post: {
      controller: 'TermsForResourceController',
      method: 'createTermsForResource',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Write]
    },
    get: {
      controller: 'TermsForResourceController',
      method: 'searchTermsForResources',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Read]
    }
  },
  '/terms/types': {
    get: {
      controller: 'TermsOfUseController',
      method: 'getTermsOfUseTypes',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Read]
    }
  },
  '/terms/agreeability-types': {
    get: {
      controller: 'TermsOfUseController',
      method: 'getTermsOfUseAgreeabilityTypes',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Read]
    }
  },
  '/terms/agreeability-types/:id': {
    get: {
      controller: 'TermsOfUseController',
      method: 'getTermsOfUseAgreeabilityType',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Read]
    }
  },
  '/terms': {
    post: {
      controller: 'TermsOfUseController',
      method: 'createTermsOfUse',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Write]
    },
    get: {
      controller: 'TermsOfUseController',
      method: 'searchTermsOfUses'
    }
  },
  '/terms/internal/jobs/clean':{
    post: {
      controller: 'CleanUpController',
      method: 'cleanUpTestData',
      auth: 'jwt',
      scopes: [constants.Scopes.Terms.Write]
    }
  },
  '/terms/:termsOfUseId': {
    get: {
      controller: 'TermsOfUseController',
      method: 'getTermsOfUse',
      optionalAuth: 'jwt',
      scopes: [constants.Scopes.Terms.Read]
    },
    put: {
      controller: 'TermsOfUseController',
      method: 'fullyUpdateTermsOfUse',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Write]
    },
    patch: {
      controller: 'TermsOfUseController',
      method: 'partiallyUpdateTermsOfUse',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Write]
    },
    delete: {
      controller: 'TermsOfUseController',
      method: 'deleteTermsOfUse',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Write]
    }
  },
  '/terms/:termsOfUseId/agree': {
    post: {
      controller: 'TermsOfUseController',
      method: 'agreeTermsOfUse',
      auth: 'jwt'
    }
    // delete: {
    //   controller: 'TermsOfUseController',
    //   method: 'deleteAgreeTermsOfUse',
    //   auth: 'jwt',
    //   access: [constants.UserRoles.Admin],
    //   scopes: [constants.Scopes.Terms.Write]
    // }
  },
  '/terms/reference/:termsForResourceId': {
    get: {
      controller: 'TermsForResourceController',
      method: 'getTermsForResource',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Read]
    },
    put: {
      controller: 'TermsForResourceController',
      method: 'fullyUpdateTermsForResource',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Write]
    },
    patch: {
      controller: 'TermsForResourceController',
      method: 'partiallyUpdateTermsForResource',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Write]
    },
    delete: {
      controller: 'TermsForResourceController',
      method: 'deleteTermsForResource',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Write]
    }
  },
  '/terms/user/:userId/reference': {
    get: {
      controller: 'TermsForResourceController',
      method: 'checkTermsForResourceOfUser',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Read]
    }
  },
  '/terms/:termsOfUseId/users': {
    get: {
      controller: 'TermsOfUseController',
      method: 'getTermsOfUseUsers',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Read]
    },
    post: {
      controller: 'TermsOfUseController',
      method: 'signTermsOfUseUser',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Write]
    }
  },
  '/terms/:termsOfUseId/users/:userId': {
    delete: {
      controller: 'TermsOfUseController',
      method: 'unsignTermsOfUseUser',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.Terms.Write]
    }
  }
}
