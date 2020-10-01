/**
 * The Terms of Use Type model.
 */
const config = require('config')

module.exports = (sequelize, DataTypes) => {
  const TermsOfUseType = sequelize.define('TermsOfUseType', {
    id: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }
  }, {
    schema: config.DB_SCHEMA_NAME,
    tableName: 'TermsOfUseType',
    timestamps: false
  })

  return TermsOfUseType
}
