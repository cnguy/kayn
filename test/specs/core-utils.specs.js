require('./core.specs.js')

var chai = require('chai')

var expect = chai.expect,
    should = chai.should,
    assert = chai.assert

require('dotenv').config()

var init = require('../../utils/init')

describe('Core Utils', function() {
  describe('setRegion ', () => {
    describe('through init', () => {
      it('should throw on invalid region', () => {
        const api = require('../../dist/kindred-api')
        const debug = true
        const garbageRegion = 'foo'

        assert.throws(() => api.QuickStart(process.env.KEY, garbageRegion, true), Error)
      })

      it('should not throw on valid region', () => {
        assert.doesNotThrow(() => init(), Error)
      })
    })

    describe('through manual set', () => {
      it('should throw on invalid region', () => {
        const garbageRegion = 'north_amurica' // jokez!
        assert.throws(() => init().setRegion(garbageRegion), Error)
      })

      it('should not throw on valid region', () => {
        const k = init()
        const nonGarbageRegion = require('../../dist/kindred-api').REGIONS.KOREA

        assert.doesNotThrow(() => k.setRegion(nonGarbageRegion), Error)
      })
    })
  })

  describe('validName', () => {
    it('should return false', () => {
      const valid = init()._validName('foo%')
      assert.equal(valid, false)
    })

    it('should throw on invalid name', () => {
      // name parameters -> valid name -> sanitize name -> throw
      const garbageName = 'foo%'
      assert.throws(() => init().Summoner.get(garbageName), Error)
    })

    it('should not throw on valid name 1', () => {
      // name parameters -> valid name -> sanitize name -> no throw
      assert.throws(() => init().Summoner.get('chauisthebest'), Error)
    })

    it('should not throw on valid name 2', () => {
      // name parameters -> valid name -> sanitize name -> no throw
      assert.throws(() => init().Summoner.get('chau.isthebest'), Error)
    })
  })

  describe('sanitizeName', () => {
    it('should sanitize with valid name', () => {
      const name = init()._sanitizeName('foo Bar')
      assert.equal(name, 'foobar')
    })

    it('should throw with invalid name', () => {
      assert.throws(() => init()._sanitizeName('foo%'), Error)
    })
  })
})