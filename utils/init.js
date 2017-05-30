const init = function (debug) {
  require('dotenv').config()

  const api = require('../dist/kindred-api')
  const { REGIONS } = api

  return api.QuickStart(process.env.KEY, REGIONS.NORTH_AMERICA, debug)
}

module.exports = init