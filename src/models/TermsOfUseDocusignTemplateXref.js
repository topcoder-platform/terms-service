/**
 * The TermsOfUseDocusignTemplateXref model.
 */

module.exports = (sequelize, DataTypes) => {
  const TermsOfUseDocusignTemplateXref = sequelize.define('TermsOfUseDocusignTemplateXref', {
    termsOfUseId: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    docusignTemplateId: { type: DataTypes.STRING, allowNull: false }
  }, {
    schema: 'termsdb',
    tableName: 'TermsOfUseDocusignTemplateXref',
    timestamps: false
  })

  return TermsOfUseDocusignTemplateXref
}
