const init = function() {
  require('dotenv').config()

  const api = require('../dist/kindred-api.min')
  const { REGIONS } = api
  const debug = true

  const k = api.QuickStart(process.env.KEY, REGIONS.NORTH_AMERICA, true)

  return k
}

module.exports = init