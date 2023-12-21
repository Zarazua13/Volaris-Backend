const jwt = require('jsonwebtoken')
const fs = require('fs').promises
const path = require('path')

const saveKeys = require('../services/saveKeys')
const { KEYS_ROUTE, TENANT_URL } = require('../../utils/auth')

module.exports = async  function(req, res, next) {
  const authorization = req.headers.authorization

  try {
    let token = ''

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'invalid token' })
    }

    token = authorization.replace('Bearer ', '')

    const { kid, alg } = jwt.decode(token, { complete: true }).header

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
      if (!cert) throw 'no matching cert for:\n' + token
    }

    const { aud, iss } = jwt.verify(token, `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----`,{ algorithms: [alg] })

    
    if ( aud !== process.env.MICROSOFT_CLIENT_ID || iss !== TENANT_URL) {
      throw 'invalid aud or iss'
    }
    next()

  } catch (e) {
    res.status(401).json({ message: 'invalid token' })
    return
  }

  // req.userId = decodedToken.userId

}

// const { jwt: token } = req.body

// try {
//   const { kid, alg } = jwt.decode(token, { complete: true }).header
  
//   if (alg === 'none') throw 'invalid encryption algorithm'

//   let text = await fs.readFile(path.join(__dirname, '..', '..', 'key.json'), 'utf8')
//     .catch(err => {
//       console.log(err)
//       return saveKeys().then(() => fs.readFile(KEYS_ROUTE, 'utf8'))
//     })
  
//   let cert = null

//   for (let key of JSON.parse(text).keys) {
//     if (key.kid !== kid || key.issuer !== TENANT_URL) continue
//     cert = key.x5c[0]
//     break
//   }

//   if (!cert) {
//     text = await saveKeys().then(() => fs.readFile(KEYS_ROUTE, 'utf8'))
//     for (let key of JSON.parse(text).keys) {
//       if (key.kid !== kid || key.issuer !== TENANT_URL) continue
//       cert = key.x5c[0]
//       break
//     }
//     if (!cert) throw 'no matching cert for:\n' + token
//   }

//   const { aud, iss, email, name } = jwt.verify(token, `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----`,{ algorithms: [alg] })

//   if ( aud !== process.env.MICROSOFT_CLIENT_ID || iss !== TENANT_URL) {
//     throw 'invalid aud or iss'
//   }

//   res.json({ email, name })
// } catch(error) {
//   console.log(error)
// }