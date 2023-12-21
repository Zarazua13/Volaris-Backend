const { Model, DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

class Settings extends Model {}

Settings.init(
  {
    key: DataTypes.STRING,
    value: DataTypes.STRING,
  },
  {
    modelName: 'settings',
    sequelize,
    timestamps: false,
    createdAt: false,
  }
)

Settings.removeAttribute('id')

module.exports = Settings
