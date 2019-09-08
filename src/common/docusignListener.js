const xpath = require('xpath')
const Dom = require('xmldom').DOMParser
const { docusignCallback } = require('../services/DocusignService')

module.exports = function (req, res, next) {
  // Read the XML, convert it into a normal POST request with body and call the docusignCallback action
  var body = ''
  req.on('data', function (chunk) {
    body += chunk.toString()
  })

  req.on('end', function () {
    let doc = new Dom().parseFromString(body)
    const select = xpath.useNamespaces({ ns: 'http://www.docusign.net/API/3.0' })

    let statusNode = select('/ns:DocuSignEnvelopeInformation/ns:EnvelopeStatus/ns:Status', doc)

    let envelopeNode = select('/ns:DocuSignEnvelopeInformation/ns:EnvelopeStatus/ns:EnvelopeID', doc)

    let connectKey = req.query.connectKey

    let tabStatusNodes = doc.getElementsByTagName('TabStatus')

    let envelopeStatus

    let envelopeId

    let tabs = []

    let x

    let tabLabelNode

    let tabValueNode

    // Even if status or id is not found, we will call the API with non-trimmed empty string
    // This is because we need to log the error as per the current codebase
    envelopeStatus = statusNode.length === 0 ? ' ' : statusNode[0].firstChild.data
    envelopeId = envelopeNode.length === 0 ? ' ' : envelopeNode[0].firstChild.data

    for (x = 0; x < tabStatusNodes.length; x += 1) {
      tabLabelNode = tabStatusNodes[x].getElementsByTagName('TabLabel')[0]
      tabValueNode = tabStatusNodes[x].getElementsByTagName('TabValue')[0]
      tabs.push({
        tabLabel: tabLabelNode.hasChildNodes() ? tabLabelNode.firstChild.data : '',
        tabValue: tabValueNode.hasChildNodes() ? tabValueNode.firstChild.data : ''
      })
    }

    docusignCallback({
      envelopeStatus: envelopeStatus,
      envelopeId: envelopeId,
      tabs: tabs,
      connectKey: connectKey
    }).then(result => {
      res.send(result)
    }).catch(next)
  })
}
