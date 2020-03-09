/**
 * The TermsOfUseDocusignTemplateXref model.
 */
const config = require('config')

module.exports = (sequelize, DataTypes) => {
  const TermsOfUseDocusignTemplateXref = sequelize.define('TermsOfUseDocusignTemplateXref', {
    termsOfUseId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    docusignTemplateId: { type: DataTypes.STRING, allowNull: false }
  }, {
    schema: config.DB_SCHEMA_NAME,
    tableName: 'TermsOfUseDocusignTemplateXref',
    timestamps: false
  })

  return TermsOfUseDocusignTemplateXref
}
