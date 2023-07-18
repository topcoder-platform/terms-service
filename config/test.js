/**
 * The configuration file.
 */

module.exports = {
  WAIT_TIME: 5000,
  DOCUSIGN: {
    ASSIGNMENT_TERMS_OF_USE_ID: 'db39ac76-612f-11ea-9c41-3c15c2e2c206'
  },
  AUTH_V2_URL: process.env.AUTH_V2_URL || 'https://topcoder-dev.auth0.com/oauth/ro',
  AUTH_V2_CLIENT_ID: process.env.AUTH_V2_CLIENT_ID || '',
  AUTH_V3_URL: process.env.AUTH_V3_URL || 'https://api.topcoder-dev.com/v3/authorizations',
  ADMIN_CREDENTIALS_USERNAME: process.env.ADMIN_CREDENTIALS_USERNAME || '',
  ADMIN_CREDENTIALS_PASSWORD: process.env.ADMIN_CREDENTIALS_PASSWORD || '',
  USER_CREDENTIALS_USERNAME: process.env.USER_CREDENTIALS_USERNAME || '',
  USER_CREDENTIALS_PASSWORD: process.env.USER_CREDENTIALS_PASSWORD || ''
}
