/**
 * The DocusignEnvelope model.
 */
const config = require('config')

module.exports = (sequelize, DataTypes) => {
  const DocusignEnvelope = sequelize.define('DocusignEnvelope', {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    docusignTemplateId: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.BIGINT, allowNull: false },
    isCompleted: { type: DataTypes.BIGINT, allowNull: false }
  }, {
    schema: config.DB_SCHEMA_NAME,
    tableName: 'DocusignEnvelope',
    timestamps: false
  })

  return DocusignEnvelope
}
