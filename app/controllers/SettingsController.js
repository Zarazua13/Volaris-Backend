const Settings = require('../models/Settings')

exports.getAll = async function (req, res) {
  const settings = await Settings.findAll()

  res.json(settings.reduce((prev, curr) => ({ ...prev, [curr.key]: curr.value }), {}))
}