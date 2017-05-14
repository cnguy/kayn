require('./core.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../utils/init')

describe('Core Utils', function () {
  describe('makeUrl', function () {
    it('should make the correct url for v3', function () {
      const endUrl = 'summoner/v3/summoners/by-name/contractz'
      const testUrl = 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/contractz'
      const url = init()._makeUrl(endUrl, 'na')
      assert.equal(url, testUrl)
    })

    it('should make the correct url for v1-2', function () {
      const endUrl = 'v1.3/game/by-summoner/32932398/recent'
      const testUrl = 'https://na.api.riotgames.com/api/lol/na/v1.3/game/by-summoner/32932398/recent'
      const url = init()._makeUrl(endUrl, 'na')
      assert.equal(url, testUrl)
    })
  })

  describe('setRegion', function () {
    describe('through init', function () {
      it('should throw on invalid region', function () {
        const api = require('../../dist/kindred-api')
        const debug = true
        const garbageRegion = 'foo'

        assert.throws(() => api.QuickStart(process.env.KEY, garbageRegion, true), Error)
      })

      it('should not throw on valid region', function () {
        assert.doesNotThrow(() => init(), Error)
      })
    })

    describe('through manual set', function () {
      it('should throw on invalid region', function () {
        const garbageRegion = 'north_amurica' // jokez!
        assert.throws(() => init().setRegion(garbageRegion), Error)
      })

      it('should not throw on valid region', function () {
        const k = init()
        const nonGarbageRegion = require('../../dist/kindred-api').REGIONS.KOREA

        assert.doesNotThrow(() => k.setRegion(nonGarbageRegion), Error)
      })
    })
  })

  describe('validName', function () {
    it('should return false', function () {
      const valid = init()._validName('foo%')
      assert.equal(valid, false)
    })

    it('should return true', function () {
      const valid = init()._validName('foo')
      assert.equal(valid, true)
    })

    describe('usage', function () {
      it('should throw on invalid name', function () {
        // name parameters -> valid name -> sanitize name -> throw
        const garbageName = 'foo%'
        assert.throws(() => init().Summoner.get(garbageName), Error)
      })

      it('should not throw on valid name 1', function () {
        // name parameters -> valid name -> sanitize name -> no throw
        assert.throws(() => init().Summoner.get('chauisthebest'), Error)
      })

      it('should not throw on valid name 2', function () {
        // name parameters -> valid name -> sanitize name -> no throw
        assert.throws(() => init().Summoner.get('chau.isthebest'), Error)
      })
    })
  })

  describe('sanitizeName', function () {
    it('should sanitize with valid name', function () {
      const name = init()._sanitizeName('foo Bar')
      assert.equal(name, 'foobar')
    })

    it('should throw with invalid name', function () {
      assert.throws(() => init()._sanitizeName('foo%'), Error)
    })
  })
})