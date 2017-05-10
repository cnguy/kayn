require('./core.specs.js')

var chai = require('chai')

var expect = chai.expect,
    should = chai.should,
    assert = chai.assert

require('dotenv').config()

describe('Core Utils', function() {
  it('it throws on invalid region thru init', () => {
    const api = require('../../dist/kindred-api.min')
    const debug = true

    assert.throws(() => api.QuickStart(process.env.KEY, 'foo', true), Error)
  })

  it('it throws on invalid region thru setRegion', () => {
    const api = require('../../dist/kindred-api.min')
    const { REGIONS } = api
    const debug = true

    const k = api.QuickStart(process.env.KEY, REGIONS.KOREA, true)
    assert.throws(() => k.setRegion('foo'), Error)
  })

  it('it throws on invalid name', () => {
    const api = require('../../dist/kindred-api.min')
    const REGIONS = api.REGIONS
    const debug = true

    const k = api.QuickStart(process.env.KEY, debug)

    // name parameters -> valid name -> sanitize name -> throw
    assert.throws(() => k.Summoner.get('foo%'), Error)
  })
})