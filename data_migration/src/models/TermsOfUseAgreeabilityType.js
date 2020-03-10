/**
 * The TermsOfUseAgreeabilityType model.
 */
const config = require('config')

module.exports = (sequelize, DataTypes) => {
  const TermsOfUseAgreeabilityType = sequelize.define('TermsOfUseAgreeabilityType', {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    legacyId: { type: DataTypes.BIGINT, allowNull: true, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false }
  }, {
    schema: config.DB_SCHEMA_NAME,
    tableName: 'TermsOfUseAgreeabilityType',
    timestamps: false
  })

  return TermsOfUseAgreeabilityType
}
