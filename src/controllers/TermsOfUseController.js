/**
 * Controller for TermsOfUse endpoints
 */
const service = require('../services/TermsOfUseService')

/**
 * Get terms of use by id
 * @param req the request
 * @param res the response
 */
async function getTermsOfUse (req, res) {
  res.send(await service.getTermsOfUse(req.authUser, req.params.termsOfUseId, req.query))
}

/**
 * Agree terms of use
 * @param req the request
 * @param res the response
 */
async function agreeTermsOfUse (req, res) {
  res.send(await service.agreeTermsOfUse(req.authUser, req.params.termsOfUseId))
}

module.exports = {
  getTermsOfUse,
  agreeTermsOfUse
}
