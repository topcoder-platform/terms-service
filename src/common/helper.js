/**
 * This file defines helper methods
 */

const _ = require('lodash')
const config = require('config')
const util = require('util')
const querystring = require('querystring')
const request = require('superagent')
const errors = require('./errors')
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

/**
 * Remove invalid properties from the object and hide long arrays
 * @param {Object} obj the object
 * @returns {Object} the new object with removed properties
 * @private
 */
function _sanitizeObject (obj) {
  try {
    return JSON.parse(JSON.stringify(obj, (name, value) => {
      if (_.isArray(value) && value.length > 30) {
        return `Array(${value.length})`
      }
      return value
    }))
  } catch (e) {
    return obj
  }
}

/**
 * Convert the object into user-friendly string which is used in error message.
 * @param {Object} obj the object
 * @returns {String} the string value
 */
function toString (obj) {
  return util.inspect(_sanitizeObject(obj), { breakLength: Infinity })
}

/**
 * Ensure entity exists for given criteria. Throw error if no result.
 * @param {Object} Model the model to query
 * @param {Object|String|Number} criteria the criteria
 * @param {Boolean} raw the flag indicate whether return raw object or not
 * @returns {Object} the found entity
 */
async function ensureExists (Model, criteria, raw = true) {
  const result = await Model.findOne({ where: criteria, raw })
  if (_.isNull(result)) {
    throw new errors.NotFoundError(`${Model.name} not found with id: ${criteria.id}`)
  }
  return result
}

/**
 * Clear the object, remove all null field
 * @param {Object|Array} obj the given object
 */
function clearObject (obj) {
  if (_.isNull(obj)) {
    return undefined
  }
  if (_.isArray(obj)) {
    return _.map(obj, e => _.omitBy(e, _.isNull))
  } else {
    return _.omitBy(obj, _.isNull)
  }
}

/**
 * Get link for a given page.
 * @param {Object} req the HTTP request
 * @param {Number} page the page number
 * @returns {String} link for the page
 */
function getPageLink (req, page) {
  const q = _.assignIn({}, req.query, { page })
  return `${req.protocol}://${req.get('Host')}${req.baseUrl}${req.path}?${querystring.stringify(q)}`
}

/**
 * Set HTTP response headers from result.
 * @param {Object} req the HTTP request
 * @param {Object} res the HTTP response
 * @param {Object} result the operation result
 */
function setResHeaders (req, res, result) {
  const totalPages = Math.ceil(result.total / result.perPage)
  if (result.page < totalPages) {
    res.set('X-Next-Page', result.page + 1)
  }
  res.set('X-Page', result.page)
  res.set('X-Per-Page', result.perPage)
  res.set('X-Total', result.total)
  res.set('X-Total-Pages', totalPages)
  // set Link header
  if (totalPages > 0) {
    let link = `<${getPageLink(req, 1)}>; rel="first", <${getPageLink(req, totalPages)}>; rel="last"`
    if (result.page > 1) {
      link += `, <${getPageLink(req, result.page - 1)}>; rel="prev"`
    }
    if (result.page < totalPages) {
      link += `, <${getPageLink(req, result.page + 1)}>; rel="next"`
    }
    res.set('Link', link)
  }
}

/**
 * Check if exists.
 *
 * @param {Array} source the array in which to search for the term
 * @param {Array | String} term the term to search
 */
function checkIfExists (source, term) {
  let terms

  if (!_.isArray(source)) {
    throw new Error('Source argument should be an array')
  }

  source = source.map(s => s.toLowerCase())

  if (_.isString(term)) {
    terms = term.split(' ')
  } else if (_.isArray(term)) {
    terms = term.map(t => t.toLowerCase())
  } else {
    throw new Error('Term argument should be either a string or an array')
  }

  for (let i = 0; i < terms.length; i++) {
    if (source.includes(terms[i])) {
      return true
    }
  }

  return false
}

module.exports = {
  wrapExpress,
  autoWrapExpress,
  getM2Mtoken,
  postRequest,
  getRequest,
  toString,
  ensureExists,
  clearObject,
  getPageLink,
  setResHeaders,
  checkIfExists
}
