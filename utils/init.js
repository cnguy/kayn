const init = function() {
  require('dotenv').config()

  const api = require('../dist/kindred-api')
  const { REGIONS } = api
  const debug = false

  const k = api.QuickStart(process.env.KEY, REGIONS.NORTH_AMERICA, debug)

  return k
}

module.exports = init