const { v4: uuid } = require('uuid')
const Employee = require('../models/Employee')
const Responsive = require('../models/Responsive')
const { generatePdf } = require('../services/generate-pdf')
const Location = require('../models/Location')
const Position = require('../models/Position')
const Settings = require('../models/Settings')

exports.getAll = async function (req, res) {
  const responsives = await Responsive.findAll({
    attributes: [
      'id',
      'serial_number',
      'brand',
      'model',
      'type',
      'comment',
      'is_signed',
      'created_at'
    ],
    include: [
      {
        model: Employee,
        as: 'assigner',
      },
      {
        model: Employee,
        as: 'approver',
      },
      {
        model: Employee,
        as: 'receiver',
      },
      {
        model: Location,
        as: 'location',
      },
    ],
  })
  res.json(responsives)
}

exports.getOne = async function (req, res) {
  const { id } = req.params

  const responsive = await Responsive.findOne({
    where: { id },
    attributes: [
      'id',
      'serial_number',
      'brand',
      'model',
      'type',
      'comment',
      'is_signed',
      'created_at'
    ],
    include: [
      {
        model: Employee,
        as: 'assigner',
      },
      {
        model: Employee,
        as: 'approver',
      },
      {
        model: Employee,
        as: 'receiver',
      },
    ],
  })

  const name = await generatePdf(responsive, res)

  res.json({ file: name })

}

exports.create = async function (req, res) {
  try {
    const {
      device,
      brand,
      serialNumber,
      model,
      description,
      assigner_id,
      receiver_id,
      location_id
    } = req.body

    const date = new Date()

    const newResponsive = Responsive.build({
      id: uuid(),
      serial_number: serialNumber,
      brand,
      model,
      comment: description,
      type: device,
      receiver_id,
      assigner_id,
      location_id,
      created_at: date
    })

    const response = await newResponsive.save()

    const responsive = await Responsive.findOne({
      where: { id: response.id },
      attributes: [
        'id',
        'serial_number',
        'brand',
        'model',
        'type',
        'comment',
        'is_signed',
        'created_at'
      ],
      include: [
        {
          model: Employee,
          as: 'assigner',
          include: [
            {
              model: Position,
              as: 'position'
            },
            {
              model: Location,
              as: 'location'
            },
          ]
        },
        {
          model: Employee,
          as: 'approver',
        },
        {
          model: Employee,
          as: 'receiver',
          include: [
            {
              model: Position,
              as: 'position'
            },
            {
              model: Location,
              as: 'location'
            },
          ]
        },
        {
          model: Location,
          as: 'location',
        },
      ],
      raw: true,
      nest: true
    })

    const settings = await Settings.findAll()

    const fileName = await generatePdf({...responsive, numeration: settings.filter(setting => setting.key = 'numeration').value, date})

    res.json({ file: fileName })
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json(error)
  }
}
