/**
 * Controller for Docusign endpoints
 */
const service = require('../services/DocusignService')

/**
 * Docusign callback
 * @param req the request
 * @param res the response
 */
async function docusignCallback (req, res) {
  res.send(await service.docusignCallback(req.body))
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
