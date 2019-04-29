/**
 * The UserTermsOfUseXref model.
 */

module.exports = (sequelize, DataTypes) => {
  const UserTermsOfUseXref = sequelize.define('UserTermsOfUseXref', {
    userId: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    termsOfUseId: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    created: { type: DataTypes.DATE, allowNull: false }
  }, {
    schema: 'termsdb',
    tableName: 'UserTermsOfUseXref',
    timestamps: false,
    indexes: [
      { fields: ['userId'] },
      { fields: ['termsOfUseId'] }
    ]
  })

  return UserTermsOfUseXref
}
