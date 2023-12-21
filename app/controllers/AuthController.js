const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const fs = require('fs').promises
const path = require('path')
const saveKeys = require('../services/saveKeys')
const { TENANT_URL, KEYS_ROUTE } = require('../../utils/auth')

require('../models/Session')

const config = {
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretRefresh: process.env.JWT_SECRET_REFRESH
}

exports.login = async (req, res) => {
  if (!validator.isEmail(req.body.email))
    res.status(400).send({ message: 'Please enter a valid email address.' })
  if (validator.isEmpty(req.body.password))
    res.status(400).send({ message: 'Password cannot be blank.' })

  try {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (user === null) return res.status(400).send({ message: 'Invalid user.' })

    const doMatch = await bcrypt.compare(req.body.password, user.password)

    if (!doMatch) return res.status(400).send({ message: 'Wrong password.' })

    const { id, fullName, email } = user.dataValues

    const token = jwt.sign({ id, fullName, email }, config.jwtSecret, {
      expiresIn: 600
    })

    const refreshToken = jwt.sign(
      { id, fullName, email },
      config.jwtSecretRefresh,
      {
        expiresIn: 600
      }
    )

    user.refreshToken = refreshToken

    await user.save()

    return res.json({ token, refreshToken, id, email, fullName })
  } catch (err) {
    console.log(err)
    res.status(500)
  }
}

exports.logout = (req, res) => {
  if (res.locals.isAuthenticated) {
    req.session.destroy(() => {
      return res.redirect('/')
    })
  } else {
    return res.redirect('/login')
  }
}

exports.signup = async (req, res) => {
  const { jwt: msalToken } = req.body

  try {
    const { kid, alg } = jwt.decode(msalToken, { complete: true }).header
    
    if (alg === 'none') throw 'invalid encryption algorithm'

    let text = await fs.readFile(path.join(__dirname, '..', '..', 'key.json'), 'utf8')
      .catch(err => {
        console.log(err)
        return saveKeys().then(() => fs.readFile(KEYS_ROUTE, 'utf8'))
      })
    
    let cert = null

    for (let key of JSON.parse(text).keys) {
      if (key.kid !== kid || key.issuer !== TENANT_URL) continue
      cert = key.x5c[0]
      break
    }

    if (!cert) {
      text = await saveKeys().then(() => fs.readFile(KEYS_ROUTE, 'utf8'))
      for (let key of JSON.parse(text).keys) {
        if (key.kid !== kid || key.issuer !== TENANT_URL) continue
        cert = key.x5c[0]
        break
      }
      if (!cert) throw 'no matching cert for:\n' + msalToken
    }

    const { aud, iss, email, name } = jwt.verify(msalToken, `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----`,{ algorithms: [alg] })

    if ( aud !== process.env.MICROSOFT_CLIENT_ID || iss !== TENANT_URL) {
      throw 'invalid aud or iss'
    }

    const token = jwt.sign({ email, name }, config.jwtSecret, {
      expiresIn: 600
    })

    res.json({ token })
  } catch(error) {
    console.log(error)
  }
}

exports.signUp = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return bcrypt
          .hash(req.body.password, 12)
          .then(hashedPassword => {
            const user = new User({
              fullName: req.body.name,
              email: req.body.email,
              password: hashedPassword
            })
            return user.save()
          })
          .then(() => {
            return res.redirect('/login')
          })
      } else {
        req.flash(
          'error',
          'E-Mail exists already, please pick a different one.'
        )
        req.flash('oldInput', { name: req.body.name })
        return res.redirect('/sign-up')
      }
    })
    .catch(err => console.log(err))
}

exports.forgotPassword = (req, res) => {
  const validationErrors = []
  if (!validator.isEmail(req.body.email))
    validationErrors.push('Please enter a valid email address.')

  if (validationErrors.length) {
    req.flash('error', validationErrors)
    return res.redirect('/forgot-password')
  }
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/forgot-password')
    }
    const token = buffer.toString('hex')
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        if (!user) {
          req.flash('error', 'No user found with that email')
          return res.redirect('/forgot-password')
        }
        user.resetToken = token
        user.resetTokenExpiry = Date.now() + 3600000
        return user.save()
      })
      .then(result => {
        if (result) return res.redirect('/resetlink')
      })
      .catch(err => {
        console.log(err)
      })
  })
}

exports.refreshToken = async (req, res) => {
  const refreshToken = req.get('refresh')

  if (!refreshToken) res.status(400).json({ message: 'Something goes wrong!' })

  let user

  try {
    const verifyResult = jwt.verify(refreshToken, config.jwtSecretRefresh)
    const { id } = verifyResult
    user = await User.getOne({ where: { id } })
  } catch (err) {
    return res.status(400).json({ message: 'Something goes wrong!' })
  }

  const { id, fullName, email } = user.dataValues

  const token = jwt.sign({ id, fullName, email }, config.jwtSecret, {
    expiresIn: '7d'
  })

  res.json({ token })
}
