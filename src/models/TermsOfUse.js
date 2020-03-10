/**
 * The TermsOfUse model.
 */
const config = require('config')

module.exports = (sequelize, DataTypes) => {
  const TermsOfUse = sequelize.define('TermsOfUse', {
    id: { type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    legacyId: { type: DataTypes.BIGINT, allowNull: true, unique: true },
    text: { type: DataTypes.TEXT, allowNull: true },
    typeId: { type: DataTypes.BIGINT, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: true },
    agreeabilityTypeId: { type: DataTypes.UUID, allowNull: false, defaultValue: config.AGREE_ELECTRONICALLY },
    created: { type: DataTypes.DATE, allowNull: false },
    createdBy: { type: DataTypes.STRING, allowNull: true },
    updated: { type: DataTypes.DATE, allowNull: true },
    updatedBy: { type: DataTypes.STRING, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true }
  }, {
    schema: config.DB_SCHEMA_NAME,
    tableName: 'TermsOfUse',
    timestamps: false
  })

  TermsOfUse.associate = (models) => {
    TermsOfUse.belongsTo(models.TermsOfUseAgreeabilityType, { foreignKey: 'agreeabilityTypeId' })
    TermsOfUse.hasOne(models.TermsOfUseDocusignTemplateXref, { foreignKey: 'termsOfUseId' })
    TermsOfUse.hasMany(models.UserTermsOfUseXref, { foreignKey: 'termsOfUseId' })
  }

  return TermsOfUse
}
