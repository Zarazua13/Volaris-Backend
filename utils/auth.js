const path = require('path')

const TENANT_URL = `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0`

const KEYS_ROUTE = path.join(__dirname, 'key.json')

module.exports = {
  TENANT_URL,
  KEYS_ROUTE
}