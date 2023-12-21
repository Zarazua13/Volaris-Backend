
const ERRORS_HANDLERS = {
  TokenExpiredError: res => res.status(401).json({ error: 'unauthorized' }),

  defaultError: (res, error) => {
    console.error(error.name)
    res.status(500).end()
  }
}
/* eslint-disable no-unused-vars */
module.exports = function (err, req, res, next) {

  console.log(err.name)

  const handler = ERRORS_HANDLERS[err.name] || ERRORS_HANDLERS.defaultError
  
  handler(res, err)
}