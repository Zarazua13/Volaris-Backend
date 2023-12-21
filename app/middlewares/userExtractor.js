const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET

module.exports = function(req, res, next) {
  const authorization = req.headers.authorization

  let token = ''

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'invalid token' })
  }

  token = authorization.replace('Bearer ', '')

  let decodedToken = {}

  try {
    decodedToken = jwt.verify(token, jwtSecret)

    console.log(decodedToken)

  } catch (e) {
    next(e)
    return
  }

  next()
}