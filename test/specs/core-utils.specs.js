require('./core.specs.js')

var chai = require('chai')

var expect = chai.expect,
    should = chai.should,
    assert = chai.assert

require('dotenv').config()

var init = require('../../utils/init')

describe('Core Utils', function() {
  it('it throws on invalid region thru init', () => {
    const api = require('../../dist/kindred-api.min')
    const debug = true
    const garbageRegion = 'foo'

    assert.throws(() => api.QuickStart(process.env.KEY, garbageRegion, true), Error)
  })

  it('it does not throw on valid region thru init', () => {
    const api = require('../../dist/kindred-api.min')
    const debug = true
    const region = api.REGIONS.NORTH_AMERICA

    assert.doesNotThrow(() => api.QuickStart(process.env.KEY, region, true), Error)
  })

  it('it throws on invalid region thru setRegion', () => {
    const api = require('../../dist/kindred-api.min')
    const { REGIONS } = api
    const debug = true

    const garbageRegion = 'north_amurica' // jokez!

    const k = api.QuickStart(process.env.KEY, REGIONS.KOREA, true)
    assert.throws(() => k.setRegion(garbageRegion), Error)
  })

  it('it does not throw on valid region thru setRegion', () => {
    const api = require('../../dist/kindred-api.min')
    const { REGIONS } = api
    const debug = true

    const nonGarbageRegion = REGIONS.KOREA

    const k = api.QuickStart(process.env.KEY, REGIONS.NORTH_AMERICA, true)
    assert.doesNotThrow(() => k.setRegion(nonGarbageRegion), Error)
  })

  it('it throws on invalid name', () => {
    const api = require('../../dist/kindred-api.min')
    const REGIONS = api.REGIONS
    const debug = true

    const k = api.QuickStart(process.env.KEY, debug)

    // name parameters -> valid name -> sanitize name -> throw
    assert.throws(() => k.Summoner.get('foo%'), Error)
  })

  it('it throws on invalid name', () => {
    // name parameters -> valid name -> sanitize name -> throw
    const garbageName = 'foo%'
    assert.throws(() => init().Summoner.get(garbageName), Error)
  })

  it('it does not throw on valid name 1', () => {
    // name parameters -> valid name -> sanitize name -> no throw
    assert.throws(() => init().Summoner.get('chauisthebest'), Error)
  })

  it('it does not throw on valid name 2', () => {
    // name parameters -> valid name -> sanitize name -> no throw
    assert.throws(() => init().Summoner.get('chau.isthebest'), Error)
  })
})