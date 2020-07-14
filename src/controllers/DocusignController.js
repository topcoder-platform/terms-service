/**
 * Controller for Docusign endpoints
 */
const service = require('../services/DocusignService')
// const logger = require('../common/logger')

/**
 * Generate docusign view url.
 * @param req the request
 * @param res the response
 */
async function generateDocusignViewURL (req, res) {
  res.send(await service.generateDocusignViewURL(req.authUser, req.body))
}

module.exports = {
  generateDocusignViewURL
}
