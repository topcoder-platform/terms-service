/**
 * E2E test of the Docusign Callback Listener.
 */

const _ = require('lodash')
const config = require('config')
const request = require('superagent')
const should = require('should')
const fs = require('fs')
const path = require('path')

const url = `http://localhost:${config.PORT}${config.DOCUSIGN_LISTENER_PATH}`

/**
 * These tests are just to check that the docusignCallbackListener is able to parse the xml and connectKey properly.
 * and that it makes calls to the Docusign Callback Action.
 * The tests for the Docusign Callback Action are separate and they check the actual functionality and the database state.
 */
describe('Test Docusign Callback Listener', () => {
  /**
   * The xml to send in the request
   */
  let xmlBody

  /**
   * Uses superagent to proxy post request
   * @param {String} url the url
   * @param {Object} body the request body
   * @returns {Object} the response
   */
  async function postRequest (url, body) {
    return request.post(url).send(body)
      .set('Content-Type', 'text/xml')
      .set('Accept', 'application/json')
  }

  before(() => {
    xmlBody = fs.readFileSync(path.join(__dirname, '../common/sample.xml'), { encoding: 'utf8' })
  })

  /**
   * Test docusignCallbackListener when the envelope status node is missing
   * should not crash, should make a call to the Docusign Callback Action which will just return 200 and body='Success'
   */
  it('should return 200 and body=Success if envelope status node is missing', async () => {
    const body = xmlBody.replace('<Status>Completed</Status>', '')
    const res = await postRequest(`${url}?connectKey=ABCDED-12435-EDFADSEC`, body)
    should.equal(res.status, 200)
    should.equal(res.body.message, 'success')
  })

  /**
   * Test docusignCallbackListener when the envelope id node is missing
   * should not crash, should make a call to the Docusign Callback Action which will just return 200 and body='Success'
   */
  it('should return 200 and body=Success if envelope id node is missing', async () => {
    const body = xmlBody.replace('<EnvelopeID>9e045db0-b50f-11e3-a5e2-0800200c9a66</EnvelopeID>', '')
    const res = await postRequest(`${url}?connectKey=ABCDED-12435-EDFADSEC`, body)
    should.equal(res.status, 200)
    should.equal(res.body.message, 'success')
  })

  /**
   * Test docusignCallbackListener when the connectKey is missing or invalid
   * should not crash, should make a call to the Docusign Callback Action which will just return 404 and body='Connect Key is missing or invalid.'
   */
  it('should return 404 when connect key missing or invalid', async () => {
    try {
      await postRequest(`${url}?connectKey=ABCDED-12435-EDFADBBB`, xmlBody)
      throw new Error('should not throw error here')
    } catch (err) {
      should.equal(err.status, 404)
      should.equal(_.get(err, 'response.body.message'), 'Connect Key is missing or invalid.')
    }
  })

  /**
   * Test docusignCallbackListener when a TabValue is empty
   * should not crash
   */
  it('should return 200 when a TabValue is empty', async () => {
    const body = xmlBody.replace('<TabValue>foo@fooonyou.com</TabValue>', '<TabValue />')
    const res = await postRequest(`${url}?connectKey=ABCDED-12435-EDFADSEC`, body)
    should.equal(res.status, 200)
    should.equal(res.body.message, 'success')
  })
})
