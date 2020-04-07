/**
 * The TermsOfUseDependency model.
 */
const config = require('config')

module.exports = (sequelize, DataTypes) => {
  const TermsOfUseDependency = sequelize.define('TermsOfUseDependency', {
    dependencyTermsOfUseId: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    dependentTermsOfUseId: { type: DataTypes.UUID, allowNull: false, primaryKey: true }
  }, {
    schema: config.DB_SCHEMA_NAME,
    tableName: 'TermsOfUseDependency',
    timestamps: false,
    indexes: [
      { fields: ['dependencyTermsOfUseId'] },
      { fields: ['dependentTermsOfUseId'] }
    ]
  })

  TermsOfUseDependency.associate = (models) => {
    TermsOfUseDependency.hasMany(models.UserTermsOfUseXref, { foreignKey: 'termsOfUseId', sourceKey: 'dependencyTermsOfUseId' })
  }

  return TermsOfUseDependency
}
