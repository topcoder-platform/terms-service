/**
 * Controller for Docusign endpoints
 */
const service = require('../services/DocusignService')
// const logger = require('../common/logger')

/**
 * Docusign callback
 * @param req the request
 * @param res the response
 */
async function docusignCallback (req, res) {
  // logger.debug(`Docusign Callback. Query: ${JSON.stringify(req.query)}, Body: ${JSON.stringify(req.body)}`)
  res.send(await service.docusignCallback(req.query))
}

/**
 * Generate docusign view url.
 * @param req the request
 * @param res the response
 */
async function generateDocusignViewURL (req, res) {
  res.send(await service.generateDocusignViewURL(req.authUser, req.body))
}

module.exports = {
  docusignCallback,
  generateDocusignViewURL
}
