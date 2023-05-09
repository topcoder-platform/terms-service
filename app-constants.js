/**
 * App constants
 */

const config = require('config')

const UserRoles = {
  Admin: 'Administrator',
  TopGearAdmin: 'tgadmin'
}

const Scopes = {
  Terms: {
    Read: 'read:terms',
    Write: 'write:terms'
  }
}

module.exports = {
  AGREE_FOR_DOCUSIGN_TEMPLATE: config.AGREE_FOR_DOCUSIGN_TEMPLATE,
  ELECT_AGREEABLE: 'Electronically-agreeable',
  TEMPLATE_ID_INVALID: 'TEMPLATE_ID_INVALID',
  UserRoles,
  Scopes
}
