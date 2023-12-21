const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../config/database')

class Location extends Model {}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  {
    modelName: 'locations',
    sequelize,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  }
)

module.exports = Location
