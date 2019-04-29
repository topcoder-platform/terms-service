/**
 * The DocusignEnvelope model.
 */

module.exports = (sequelize, DataTypes) => {
  const DocusignEnvelope = sequelize.define('DocusignEnvelope', {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    docusignTemplateId: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.BIGINT, allowNull: false },
    isCompleted: { type: DataTypes.BIGINT, allowNull: false }
  }, {
    schema: 'termsdb',
    tableName: 'DocusignEnvelope',
    timestamps: false
  })

  return DocusignEnvelope
}
