const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../config/database')

class Position extends Model {}

Position.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  {
    modelName: 'positions',
    sequelize,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
)

module.exports = Position
