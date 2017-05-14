var chai = require('chai')

var expect = chai.expect,
    should = chai.should,
    assert = chai.assert

require('dotenv').config()

var init = require('../../utils/init')

describe('Core', function() {
  it('Kindred exists', () => expect(
      require('../../dist/kindred-api')
  ).is.not.undefined)

  describe('Standard Initialization', () => {
    it('should not init w/o api key', () => {
      const api = require('../../dist/kindred-api')

      const { REGIONS } = api
      const debug = true

      assert.throws(() => new api.Kindred(), Error)
      assert.throws(() => new api.Kindred({ region: REGIONS.NORTH_AMERICA }), Error)
      assert.throws(() => new api.Kindred({ debug }), Error)
      assert.throws(() => new api.Kindred({ region: REGIONS.NORTH_AMERICA, debug }), Error)
    })

    it('should init with key & region & debug (3 args)', () => {
      const api = require('../../dist/kindred-api')

      const region = api.REGIONS.NORTH_AMERICA
      const debug = true

      const k = new api.Kindred({
        key: process.env.KEY, region, debug
      })

      expect(k).is.not.undefined
    })

    it('should init with key (1 arg)', () => {
      const api = require('../../dist/kindred-api')

      const k = new api.Kindred({
        key: process.env.KEY
      })

      expect(k).is.not.undefined
    })

    it('should init with key & debug (2 args)', () => {
      const api = require('../../dist/kindred-api')

      const debug = true

      const k = new api.Kindred({
        key: process.env.KEY, debug
      })

      expect(k).is.not.undefined
    })

    it('should not have any limits', () => {
      const api = require('../../dist/kindred-api')

      const debug = true

      const k = new api.Kindred({
        key: process.env.KEY, debug
      })

      expect(k.limits).is.undefined
    })

    it('should not init with spread rate limiter', () => {
      const api = require('../../dist/kindred-api')

      const debug = true
      const LIMITS = api.LIMITS

      const k = new api.Kindred({
        key: process.env.KEY,
        debug,
        limits: LIMITS.DEV
      })

      expect(k.limits).is.not.undefined
    })

    it('should init with spread rate limiter', () => {
      const api = require('../../dist/kindred-api')

      const debug = true
      const LIMITS = api.LIMITS

      const k = new api.Kindred({
        key: process.env.KEY,
        debug,
        limits: LIMITS.DEV,
        spread: true
      })

      assert(k.spread, true)
      expect(k.limits).is.not.undefined
    })
  })

  describe('QuickStart Initialization', () => {
    it('should init with key & region & debug (3 args)', () => {
      expect(init()).is.not.undefined
    })

    it('should init with key & region (2 args)', () => {
      const api = require('../../dist/kindred-api')
      const { REGIONS } = api

      const k = api.QuickStart(process.env.KEY, REGIONS.NORTH_AMERICA)

      expect(k).is.not.undefined
    })

    it('should init with key & debug (2 args)', () => {
      const api = require('../../dist/kindred-api')
      const { REGIONS } = api

      const k = api.QuickStart(process.env.KEY, true)

      expect(k).is.not.undefined
    })
  })

  describe('Requests', () => {
    it('should return a promise', () => {
      assert.instanceOf(init().Summoner.get({ id: 32932398 }), Promise, 'this is a promise')
    })
  })

})