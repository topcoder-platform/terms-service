/**
 * The configuration file.
 */

module.exports = {
  PORT: process.env.PORT || 8081,

  DOCUSIGN_CALLBACK_ENDPOINT: process.env.DOCUSIGN_CALLBACK_ENDPOINT || 'http://localhost:3000/terms/docusignCallback'
}
