/**
 * The UserTermsOfUseXref model.
 */

module.exports = (sequelize, DataTypes) => {
  const UserTermsOfUseBanXref = sequelize.define('UserTermsOfUseBanXref', {
    userId: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    termsOfUseId: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    created: { type: DataTypes.DATE, allowNull: false }
  }, {
    schema: 'termsdb',
    tableName: 'UserTermsOfUseBanXref',
    timestamps: false,
    indexes: [
      { fields: ['userId'] },
      { fields: ['termsOfUseId'] }
    ]
  })

  return UserTermsOfUseBanXref
}
