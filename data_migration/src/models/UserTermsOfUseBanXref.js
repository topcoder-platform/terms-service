/**
 * The UserTermsOfUseXref model.
 */
const config = require('config')

module.exports = (sequelize, DataTypes) => {
  const UserTermsOfUseBanXref = sequelize.define('UserTermsOfUseBanXref', {
    userId: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    termsOfUseId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    created: { type: DataTypes.DATE, allowNull: false }
  }, {
    schema: config.DB_SCHEMA_NAME,
    tableName: 'UserTermsOfUseBanXref',
    timestamps: false,
    indexes: [
      { fields: ['userId'] },
      { fields: ['termsOfUseId'] }
    ]
  })

  return UserTermsOfUseBanXref
}
