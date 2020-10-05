/**
 * Controller for TermsOfUse endpoints
 */
const HttpStatus = require('http-status-codes')
const service = require('../services/TermsOfUseService')
const helper = require('../common/helper')

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

/**
 * Delete agree terms of use
 * @param req the request
 * @param res the response
 */
async function deleteAgreeTermsOfUse (req, res) {
  res.send(await service.deleteAgreeTermsOfUse(req.params.termsOfUseId, req.query.userId))
}

/**
 * Create terms of use
 * @param req the request
 * @param res the response
 */
async function createTermsOfUse (req, res) {
  res.send(await service.createTermsOfUse(req.authUser, req.body))
}

/**
 * Partially update terms of use
 * @param req the request
 * @param res the response
 */
async function partiallyUpdateTermsOfUse (req, res) {
  res.send(await service.partiallyUpdateTermsOfUse(req.authUser, req.params.termsOfUseId, req.body))
}

/**
 * Fully update terms of use
 * @param req the request
 * @param res the response
 */
async function fullyUpdateTermsOfUse (req, res) {
  res.send(await service.fullyUpdateTermsOfUse(req.authUser, req.params.termsOfUseId, req.body))
}

/**
 * Delete terms of use
 * @param req the request
 * @param res the response
 */
async function deleteTermsOfUse (req, res) {
  await service.deleteTermsOfUse(req.params.termsOfUseId)
  res.status(HttpStatus.NO_CONTENT).end()
}

/**
 * Search terms of use
 * @param req the request
 * @param res the response
 */
async function searchTermsOfUses (req, res) {
  const result = await service.searchTermsOfUses(req.query)
  helper.setResHeaders(req, res, result)
  res.send({ result: result.result })
}

/**
 * Search users who signed the term
 * @param req the request
 * @param res the response
 */
async function getTermsOfUseUsers (req, res) {
  const result = await service.getTermsOfUseUsers(req.params.termsOfUseId, req.query)
  helper.setResHeaders(req, res, result)
  res.send({ result: result.result })
}

/**
 * Sign a term for a user
 * @param req the request
 * @param res the response
 */
async function signTermsOfUseUser (req, res) {
  res.send(await service.signTermsOfUseUser(req.params.termsOfUseId, req.body))
}

/**
 * Unsign a term for a user
 * @param req the request
 * @param res the response
 */
async function unsignTermsOfUseUser (req, res) {
  res.send(await service.unsignTermsOfUseUser(req.params.termsOfUseId, req.params.userId))
}

/**
 * Get all term of use types
 * @param req the request
 * @param res the response
 */
async function getTermsOfUseTypes (req, res) {
  res.send(await service.getTermsOfUseTypes())
}

module.exports = {
  getTermsOfUse,
  agreeTermsOfUse,
  deleteAgreeTermsOfUse,
  createTermsOfUse,
  partiallyUpdateTermsOfUse,
  fullyUpdateTermsOfUse,
  deleteTermsOfUse,
  searchTermsOfUses,
  getTermsOfUseUsers,
  signTermsOfUseUser,
  unsignTermsOfUseUser,
  getTermsOfUseTypes
}
