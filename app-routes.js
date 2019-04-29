/**
 * Configure all routes for express app
 */

const _ = require('lodash')
const config = require('config')
const HttpStatus = require('http-status-codes')
const helper = require('./src/common/helper')
const errors = require('./src/common/errors')
const routes = require('./src/routes')
const authenticator = require('tc-core-library-js').middleware.jwtAuthenticator

/**
 * Configure all routes for express app
 * @param app the express app
 */
module.exports = (app) => {
  // Load all routes
  _.each(routes, (verbs, path) => {
    _.each(verbs, (def, verb) => {
      const controllerPath = `./src/controllers/${def.controller}`
      const method = require(controllerPath)[def.method]; // eslint-disable-line
      if (!method) {
        throw new Error(`${def.method} is undefined`)
      }

      const actions = []
      actions.push((req, res, next) => {
        req.signature = `${def.controller}#${def.method}`
        next()
      })

      // add Authenticator check if route has auth
      if (def.auth || def.optionalAuth) {
        actions.push((req, res, next) => {
          if (def.auth || (def.optionalAuth && req.headers.authorization)) {
            authenticator(_.pick(config, ['AUTH_SECRET', 'VALID_ISSUERS']))(req, res, next)
          } else {
            next()
          }
        })

        actions.push((req, res, next) => {
          if (def.auth || (def.optionalAuth && req.headers.authorization)) {
            if (req.authUser.isMachine) {
              next(new errors.ForbiddenError('M2M token is not supported'))
            }
          }
          next()
        })
      }

      actions.push(method)
      app[verb](path, helper.autoWrapExpress(actions))
    })
  })

  // Check if the route is not found or HTTP method is not supported
  app.use('*', (req, res) => {
    const route = routes[req.baseUrl]
    if (route) {
      res.status(HttpStatus.METHOD_NOT_ALLOWED).json({ message: 'The requested HTTP method is not supported.' })
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'The requested resource cannot be found.' })
    }
  })
}
