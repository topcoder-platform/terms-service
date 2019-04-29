const config = require('config')
const request = require('supertest')
const assert = require('chai').assert
const fs = require('fs')
const path = require('path')

/**
 * These tests are just to check that the docusignCallbackListener is able to parse the xml and connectKey properly.
 * and that it makes calls to the Docusign Callback Action.
 * The tests for the Docusign Callback Action are separate and they check the actual functionality and the database state.
 */
describe('Test Docusign Callback Listener', function () {
  /**
     * The xml to send in the request
     */
  let xmlBody

  /**
     * Creates a Request object for calling the docusign callback listener
     * Sets the expected response code using the expectedStatusCode parameter
     * @param {Number} expectedStatusCode the expected status code of the response
     */
  function getRequest (expectedStatusCode, connectKey) {
    const req = request(config.DOCUSIGN_LISTENER_ENDPOINT + (connectKey ? '?connectKey=' + connectKey : ''))
      .post('')
      .set('Content-Type', 'text/xml')
      .expect('Content-Type', 'text/plain')
      .expect(expectedStatusCode)
    return req
  }

  /**
     * This function is run before all tests.
     * @param {Function<err>} done the callback
     */
  before(function (done) {
    xmlBody = fs.readFileSync(path.join(__dirname, '/sample.xml'), { encoding: 'utf8' })
    done()
  })

  /**
   * This function is run after all tests.
   * @param {Function<err>} done the callback
   */
  after(function (done) {
    done()
  })

  /**
     * Checks that the response has the correct body
     * @param err the error (if any) in the response
     * @param resp the response
     * @param message the expected message
     * @param done the callback to call when we are done
     */
  function assertBody (err, resp, expected, done) {
    if (err) {
      done(err)
      return
    }
    assert.equal(resp.text, expected)
    done()
  }

  /**
     * Test docusignCallbackListener when the envelope status node is missing
     * should not crash, should make a call to the Docusign Callback Action which will just return 200 and body='Success'
     */
  it('should return 200 and body=Success if envelope status node is missing', function (done) {
    const req = getRequest(200, 'ABCDED-12435-EDFADSEC')
    const body = xmlBody.replace('<Status>Completed</Status>', '')
    req.send(body)
      .end(function (err, resp) {
        assertBody(err, resp, 'success', done)
      })
  })

  /**
     * Test docusignCallbackListener when the envelope id node is missing
     * should not crash, should make a call to the Docusign Callback Action which will just return 200 and body='Success'
     */
  it('should return 200 and body=Success if envelope id node is missing', function (done) {
    const req = getRequest(200, 'ABCDED-12435-EDFADSEC')
    const body = xmlBody.replace('<EnvelopeID>abb29293-432b-4cbc-b83c-5338df01f20e</EnvelopeID>', '')
    req.send(body)
      .end(function (err, resp) {
        assertBody(err, resp, 'success', done)
      })
  })

  /**
     * Test docusignCallbackListener when the connectKey is missing or invalid
     * should not crash, should make a call to the Docusign Callback Action which will just return 404 and body='Connect Key is missing or invalid.'
     */
  it('should return 404 when connect key missing or invalid', function (done) {
    const req = getRequest(404, 'ABCDED-12435-EDFADBBB')
    req.send(xmlBody)
      .end(function (err, resp) {
        assertBody(err, resp, 'Connect Key is missing or invalid.', done)
      })
  })

  /**
     * Test docusignCallbackListener when a TabValue is empty
     * should not crash
     */
  it('should return 200 when a TabValue is empty', function (done) {
    const req = getRequest(200, 'ABCDED-12435-EDFADSEC')
    const body = xmlBody.replace('<TabValue>foo@fooonyou.com</TabValue>', '<TabValue />')
    req.send(body)
      .end(function (err, resp) {
        assertBody(err, resp, 'success', done)
      })
  })
})
