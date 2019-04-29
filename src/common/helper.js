/**
 * This file defines helper methods
 */

const _ = require('lodash')
const config = require('config')
const request = require('superagent')
const m2mAuth = require('tc-core-library-js').auth.m2m

const m2m = m2mAuth(_.pick(config, ['AUTH0_URL', 'AUTH0_AUDIENCE', 'TOKEN_CACHE_TIME', 'AUTH0_PROXY_SERVER_URL']))

const docuSignAuth = JSON.stringify({
  Username: config.DOCUSIGN.USERNAME,
  Password: config.DOCUSIGN.PASSWORD,
  IntegratorKey: config.DOCUSIGN.INTEGRATOR_KEY
})

/**
 * Wrap async function to standard express function
 * @param {Function} fn the async function
 * @returns {Function} the wrapped function
 */
function wrapExpress (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next)
  }
}

/**
 * Wrap all functions from object
 * @param obj the object (controller exports)
 * @returns {Object|Array} the wrapped object
 */
function autoWrapExpress (obj) {
  if (_.isArray(obj)) {
    return obj.map(autoWrapExpress)
  }
  if (_.isFunction(obj)) {
    if (obj.constructor.name === 'AsyncFunction') {
      return wrapExpress(obj)
    }
    return obj
  }
  _.each(obj, (value, key) => {
    obj[key] = autoWrapExpress(value)
  })
  return obj
}

/**
 * Get M2M token
 * @return {String} m2m token
 */
async function getM2Mtoken () {
  return m2m.getMachineToken(config.AUTH0_CLIENT_ID, config.AUTH0_CLIENT_SECRET)
}

/**
 * Uses superagent to proxy post request
 * @param {String} url the url
 * @param {Object} body the body
 * @returns {Object} the response
 */
async function postRequest (url, body) {
  return request
    .post(url)
    .send(body)
    .set('X-DocuSign-Authentication', docuSignAuth)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
}

/**
 * Uses superagent to proxy get request
 * @param {String} url the url
 * @param {String} m2mToken the M2M token
 * @returns {Object} the response
 */
async function getRequest (url, m2mToken) {
  const authHeader = m2mToken ? 'Authorization' : 'X-DocuSign-Authentication'
  return request
    .get(url)
    .set(authHeader, m2mToken || docuSignAuth)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
}

module.exports = {
  wrapExpress,
  autoWrapExpress,
  getM2Mtoken,
  postRequest,
  getRequest
}
