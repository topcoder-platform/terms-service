/**
 * Controller for Terms Reference endpoints
 */
const HttpStatus = require('http-status-codes')
const service = require('../services/TermsForResourceService')
const helper = require('../common/helper')

/**
 * Create terms for resource
 * @param req the request
 * @param res the response
 */
async function createTermsForResource (req, res) {
  res.send(await service.createTermsForResource(req.authUser, req.body))
}

/**
 * Fully update terms for resource
 * @param req the request
 * @param res the response
 */
async function fullyUpdateTermsForResource (req, res) {
  res.send(await service.fullyUpdateTermsForResource(req.authUser, req.params.termsForResourceId, req.body))
}

/**
 * Partially update terms for resource
 * @param req the request
 * @param res the response
 */
async function partiallyUpdateTermsForResource (req, res) {
  res.send(await service.partiallyUpdateTermsForResource(req.authUser, req.params.termsForResourceId, req.body))
}

/**
 * Get a terms for resource by id
 * @param req the request
 * @param res the response
 */
async function getTermsForResource (req, res) {
  res.send(await service.getTermsForResource(req.params.termsForResourceId))
}

/**
 * Delete terms for resource by id
 * @param req the request
 * @param res the response
 */
async function deleteTermsForResource (req, res) {
  await service.deleteTermsForResource(req.params.termsForResourceId)
  res.status(HttpStatus.NO_CONTENT).end()
}

/**
 * Checking whether the user has agreed to terms for a resource
 * @param req the request
 * @param res the response
 */
async function checkTermsForResourceOfUser (req, res) {
  res.send(await service.checkTermsForResourceOfUser(req.params.userId, req.query))
}

/**
 * List terms for resource
 * @param req the request
 * @param res the response
 */
async function searchTermsForResources (req, res) {
  const result = await service.searchTermsForResources(req.query)
  helper.setResHeaders(req, res, result)
  res.send({ result: result.result })
}

module.exports = {
  createTermsForResource,
  fullyUpdateTermsForResource,
  partiallyUpdateTermsForResource,
  getTermsForResource,
  deleteTermsForResource,
  checkTermsForResourceOfUser,
  searchTermsForResources
}
