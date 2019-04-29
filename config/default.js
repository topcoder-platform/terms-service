/**
 * The configuration file.
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3000,

  AUTH_SECRET: process.env.AUTH_SECRET || 'mysecret',
  VALID_ISSUERS: process.env.VALID_ISSUERS || '["https://api.topcoder-dev.com", "https://api.topcoder.com", "https://topcoder-dev.auth0.com/"]',

  POSTGRES_URL: process.env.POSTGRES_URL || 'postgres://postgres:password@localhost:5432/postgres',

  AUTH0_URL: process.env.AUTH0_URL,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || 'https://m2m.topcoder-dev.com/',
  TOKEN_CACHE_TIME: process.env.TOKEN_CACHE_TIME || 120,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  AUTH0_PROXY_SERVER_URL: process.env.AUTH0_PROXY_SERVER_URL || 'https://topcoder-dev.auth0.com/oauth/token',

  USER_API_URL: process.env.USER_API_URL || 'https://api.topcoder-dev.com/v3/users',

  DOCUSIGN: {
    USERNAME: process.env.DOCUSIGN_USERNAME,
    PASSWORD: process.env.DOCUSIGN_PASSWORD,
    INTEGRATOR_KEY: process.env.DOCUSIGN_INTEGRATOR_KEY,
    SERVER_URL: process.env.DOCUSIGN_SERVER_URL || 'https://demo.docusign.net/restapi/v2/',
    ROLENAME: process.env.DOCUSIGN_ROLENAME || 'Member',
    CLIENT_USER_ID: process.env.DOCUSIGN_CLIENT_USER_ID || 'Member',
    RETURN_URL: process.env.DOCUSIGN_RETURN_URL || 'http://localhost:3000/terms/docusign/returnSigning&envelopeId=<%= envelopeId %>',
    ASSIGNMENT_V2_TEMPLATE_ID: process.env.DOCUSIGN_ASSIGNMENT_V2_TEMPLATE_ID,
    W9TEMPLATE_ID: process.env.DOCUSIGN_W9TEMPLATE_ID,
    W8BEN_TEMPLATE_ID: process.env.DOCUSIGN_W8BEN_TEMPLATE_ID,
    NDA_TEMPLATE_ID: process.env.DOCUSIGN_NDA_TEMPLATE_ID,
    AFFIDAVIT_TEMPLATE_ID: process.env.DOCUSIGN_AFFIDAVIT_TEMPLATE_ID,
    ASSIGNMENT_TERMS_OF_USE_ID: process.env.ASSIGNMENT_TERMS_OF_USE_ID || 20753,
    CALLBACK_FAILED_EMAIL_SUBJECT: process.env.DOCUSIGN_CALLBACK_FAILED_EMAIL_SUBJECT || 'Processing DocuSign document failed',
    CALLBACK_CONNECT_KEY: process.env.DOCUSIGN_CALLBACK_CONNECT_KEY,
    CALLBACK_FAILED_SUPPORT_EMAIL_ADDRESS: process.env.DOCUSIGN_CALLBACK_FAILED_SUPPORT_EMAIL_ADDRESS,
    CALLBACK_FAILED_FROM_EMAIL_ADDRESS: process.env.DOCUSIGN_CALLBACK_FAILED_FROM_EMAIL_ADDRESS,
    CALLBACK_ENDPOINT: process.env.DOCUSIGN_CALLBACK_ENDPOINT || 'http://localhost:3000/terms/docusignCallback'
  },

  EMAIL: {
    ACCOUNT: process.env.TC_EMAIL_ACCOUNT,
    PASSWORD: process.env.TC_EMAIL_PASSWORD,
    FROM: process.env.TC_EMAIL_FROM,
    SECURED: String(process.env.TC_EMAIL_SECURED || 'false').toLowerCase() === 'true',
    HOST: process.env.TC_EMAIL_HOST,
    PORT: process.env.TC_EMAIL_HOST_PORT
  }
}
