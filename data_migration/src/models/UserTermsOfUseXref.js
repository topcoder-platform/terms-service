/**
 * The UserTermsOfUseXref model.
 */
const config = require('config')

module.exports = (sequelize, DataTypes) => {
  const UserTermsOfUseXref = sequelize.define('UserTermsOfUseXref', {
    userId: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    termsOfUseId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    created: { type: DataTypes.DATE, allowNull: false }
  }, {
    schema: config.DB_SCHEMA_NAME,
    tableName: 'UserTermsOfUseXref',
    timestamps: false,
    indexes: [
      { fields: ['userId'] },
      { fields: ['termsOfUseId'] }
    ]
  })

  return UserTermsOfUseXref
}
