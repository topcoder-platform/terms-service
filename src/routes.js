/**
 * Contains all routes
 */

module.exports = {
  '/terms/:termsOfUseId': {
    get: {
      controller: 'TermsOfUseController',
      method: 'getTermsOfUse',
      optionalAuth: 'jwt'
    }
  },
  '/terms/:termsOfUseId/agree': {
    post: {
      controller: 'TermsOfUseController',
      method: 'agreeTermsOfUse',
      auth: 'jwt'
    }
  },
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
  }
}
