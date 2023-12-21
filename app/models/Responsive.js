const { Model, DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const Employee = require('./Employee')
const Location = require('./Location')

class Responsive extends Model {}

Responsive.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    serial_number: DataTypes.STRING,
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    type: DataTypes.STRING,
    comment: DataTypes.STRING,
    is_signed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    assigner_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Employee,
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
    receiver_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Employee,
        key: 'id',
      },
    },
    approver_id: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: Employee,
        key: 'id',
      },
    },
    created_at: DataTypes.DATE
  },
  {
    modelName: 'responsive',
    sequelize,
    timestamps: false,
    createdAt: false,
    indexes: [
      {
        unique: true,
        fields: ['id'],
      },
    ],
  }
)

Responsive.belongsTo(Employee, {
  foreignKey: 'assigner_id',
  as: 'assigner',
})
Responsive.belongsTo(Employee, {
  foreignKey: 'receiver_id',
  as: 'receiver',
})
Responsive.belongsTo(Employee, {
  foreignKey: 'approver_id',
  as: 'approver',
})
Responsive.belongsTo(Location, {
  foreignKey: 'location_id',
  as: 'location',
})

module.exports = Responsive
