const Employee = require('../models/Employee')
const Location = require('../models/Location')
const Position = require('../models/Position')

exports.getAll = async function (req, res) {
  let page = 1
  let size = 10

  if (req.query.page) page = +req.query.page
  if (req.query.size) size = +req.query.size

  const employees = await Employee.findAll({
    offset: +page * +size,
    limit: +size,
    include: [
      {
        model: Position,
      },
      {
        model: Location,
      },
    ],
  })

  res.json(employees)
}

exports.getOne = async function (req, res) {
  const { employee_number } = req.params

  const employee = await Employee.findOne({
    where: { employee_number },
    attributes: ['id', 'name', 'employee_number', 'email'],
    include: [
      { model: Position },
      { model: Location },
      { model: Employee, 
        as: 'boss', 
        include: [
          { model: Position },
          { model: Location },
        ] 
      },
    ],
  })

  return res.json(employee)
}
