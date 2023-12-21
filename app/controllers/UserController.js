const User = require('../models/User')

exports.getAll = async (_, res) => {
  const users = await User.findAll()
  res.json(users)
}