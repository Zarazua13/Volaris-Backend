const Location = require('../models/Location')

exports.getAll = async function (req, res) {
  const locations = await Location.findAll()

  res.json(locations)
}
