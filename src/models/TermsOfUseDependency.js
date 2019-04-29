/**
 * The TermsOfUseDependency model.
 */

module.exports = (sequelize, DataTypes) => {
  const TermsOfUseDependency = sequelize.define('TermsOfUseDependency', {
    dependencyTermsOfUseId: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    dependentTermsOfUseId: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true }
  }, {
    schema: 'termsdb',
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
