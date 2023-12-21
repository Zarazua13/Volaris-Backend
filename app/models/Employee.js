const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../config/database')
const Location = require('./Location')
const Position = require('./Position')

class Employee extends Model {}

Employee.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employee_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    boss_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: Employee,
        key: 'id',
      },
    },
    position_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Position,
        key: 'id',
      },
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Location,
        key: 'id',
      },
    },
  },
  {
    modelName: 'employee',
    sequelize,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['employee_number'],
      },
    ],
  }
)

Employee.belongsTo(Location, {
  foreignKey: 'location_id',
})

Employee.belongsTo(Position, {
  foreignKey: 'position_id',
})

Employee.belongsTo(Employee, {
  foreignKey: 'boss_id',
  as: 'boss',
})

module.exports = Employee
