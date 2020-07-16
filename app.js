/**
 * The application entry point
 */

require('./app-bootstrap')

const _ = require('lodash')
const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const HttpStatus = require('http-status-codes')
const logger = require('./src/common/logger')
const interceptor = require('express-interceptor')

const YAML = require('yamljs')
const swaggerUi = require('swagger-ui-express')
const termsSwagger = YAML.load('./docs/swagger.yaml')

// setup express app
const app = express()

// serve challenge V5 API swagger definition
app.use('/v5/terms/docs', swaggerUi.serve, swaggerUi.setup(termsSwagger))

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', config.PORT)

// intercept the response body from jwtAuthenticator
app.use(interceptor((req, res) => {
  return {
    isInterceptable: () => {
      return res.statusCode === 403
    },

    intercept: (body, send) => {
      let obj
      if (body.length > 0) {
        try {
          obj = JSON.parse(body)
        } catch (e) {
          logger.error('Invalid response body.')
        }
      }
      if (obj && _.get(obj, 'result.content.message')) {
        const ret = { message: obj.result.content.message }
        res.statusCode = 401
        send(JSON.stringify(ret))
      } else {
        send(body)
      }
    }
  }
}))

// check if api is started
// TODO: check db connection, docusign callback
function check () {
  return true
}

// Check if the route is not found or HTTP method is not supported
app.use('/v5/terms/health', (req, res) => {
  if (check()) {
    res.status(HttpStatus.OK).json({ message: 'The service is up.' })
  } else {
    res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ message: 'The service is unavailable.' })
  }
})

// Register routes
require('./app-routes')(app)

// The error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.logFullError(err, req.signature || `${req.method} ${req.url}`)
  const errorResponse = {}
  const status = err.isJoi ? HttpStatus.BAD_REQUEST : (err.status || err.httpStatus || HttpStatus.INTERNAL_SERVER_ERROR)

  if (_.isArray(err.details)) {
    if (err.isJoi) {
      _.map(err.details, (e) => {
        if (e.message) {
          if (_.isUndefined(errorResponse.message)) {
            errorResponse.message = e.message
          } else {
            errorResponse.message += `, ${e.message}`
          }
        }
      })
    }
  }

  if (err.response) {
    // extract error message from V3 API
    errorResponse.message = _.get(err, 'response.body.result.content')
  }

  if (_.isUndefined(errorResponse.message)) {
    if (err.message && (err.httpStatus || status !== HttpStatus.INTERNAL_SERVER_ERROR)) {
      errorResponse.message = err.message
    } else {
      errorResponse.message = 'Internal server error'
    }
  }

  res.status(status).json(errorResponse)
})

const server = app.listen(app.get('port'), () => {
  logger.info(`Express server listening on port ${app.get('port')}`)
})

if (process.env.NODE_ENV === 'test') {
  module.exports = server
}
