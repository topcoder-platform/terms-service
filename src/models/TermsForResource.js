/**
 * The TermsForResource model.
 */
const config = require('config')

module.exports = (sequelize, DataTypes) => {
  const TermsForResource = sequelize.define('TermsForResource', {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    reference: { type: DataTypes.STRING, allowNull: false },
    referenceId: { type: DataTypes.STRING, allowNull: false },
    tag: { type: DataTypes.STRING, allowNull: false },
    termsOfUseIds: { type: DataTypes.ARRAY(DataTypes.UUID), allowNull: false },
    created: { type: DataTypes.DATE, allowNull: false },
    createdBy: { type: DataTypes.STRING, allowNull: false },
    updated: { type: DataTypes.DATE, allowNull: true },
    updatedBy: { type: DataTypes.STRING, allowNull: true }
  }, {
    schema: config.DB_SCHEMA_NAME,
    tableName: 'TermsForResource',
    timestamps: false,
    indexes: [
      { fields: ['reference', 'referenceId', 'tag'] }
    ]
  })

  return TermsForResource
}
