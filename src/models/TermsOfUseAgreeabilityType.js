/**
 * The TermsOfUseAgreeabilityType model.
 */
const config = require('config')

module.exports = (sequelize, DataTypes) => {
  const TermsOfUseAgreeabilityType = sequelize.define('TermsOfUseAgreeabilityType', {
    id: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
  }, {
    schema: config.DB_SCHEMA_NAME,
    tableName: 'TermsOfUseAgreeabilityType',
    timestamps: false
  })

  return TermsOfUseAgreeabilityType
}
