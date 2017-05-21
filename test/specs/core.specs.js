/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  assert = chai.assert

require('dotenv').config()

var init = require('../../utils/init')

describe('Core', function () {
  this.timeout(0)

  it('Kindred exists', function () {
    expect(
      require('../../dist/kindred-api')
    ).is.not.undefined
  })

  it('should have error if request is made with invalid key', function (done) {
    const api = require('../../dist/kindred-api')

    const k = new api.Kindred({
      key: 'hi'
    })

    k.Summoner.get({ name: 'Contractz' }, function (err, data) {
      expect(err).to.not.be.undefined
      assert.equal(err, 403)
      expect(data).to.be.undefined
      done()
    })
  })

  describe('Standard Initialization', function () {
    it('should not init w/o api key', function () {
      const api = require('../../dist/kindred-api')

      const { REGIONS } = api
      const debug = true

      assert.throws(() => new api.Kindred(), Error)
      assert.throws(() => new api.Kindred({ region: REGIONS.NORTH_AMERICA }), Error)
      assert.throws(() => new api.Kindred({ debug }), Error)
      assert.throws(() => new api.Kindred({ region: REGIONS.NORTH_AMERICA, debug }), Error)
    })

    it('should init with key & region & debug (3 args)', function () {
      const api = require('../../dist/kindred-api')

      const region = api.REGIONS.NORTH_AMERICA
      const debug = true

      const k = new api.Kindred({
        key: process.env.KEY, region, debug
      })

      expect(k).is.not.undefined
    })

    it('should init with key (1 arg)', function () {
      const api = require('../../dist/kindred-api')

      const k = new api.Kindred({
        key: process.env.KEY
      })

      expect(k).is.not.undefined
    })

    it('should init with key & debug (2 args)', function () {
      const api = require('../../dist/kindred-api')

      const debug = true

      const k = new api.Kindred({
        key: process.env.KEY, debug
      })

      expect(k).is.not.undefined
    })

    it('should not have any limits', function () {
      const api = require('../../dist/kindred-api')

      const debug = true

      const k = new api.Kindred({
        key: process.env.KEY, debug
      })

      expect(k.limits).is.undefined
    })

    it('should not init with spread rate limiter', function () {
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

    it('should init with spread rate limiter', function () {
      const api = require('../../dist/kindred-api')

      const debug = true
      const LIMITS = api.LIMITS

      const k = new api.Kindred({
        key: process.env.KEY,
        debug,
        limits: LIMITS.DEV,
        spread: true
      })

      assert.equal(k.spread, true)
      expect(k.limits).is.not.undefined
    })
  })

  describe('QuickStart Initialization', function () {
    it('should init with key & region & debug (3 args)', function () {
      expect(init()).is.not.undefined
    })

    it('should init with key & region (2 args)', function () {
      const api = require('../../dist/kindred-api')
      const { REGIONS } = api

      const k = api.QuickStart(process.env.KEY, REGIONS.NORTH_AMERICA)

      expect(k).is.not.undefined
    })

    it('should init with key & debug (2 args)', function () {
      const api = require('../../dist/kindred-api')
      const { REGIONS } = api

      const k = api.QuickStart(process.env.KEY, true)

      expect(k).is.not.undefined
    })
  })

  describe('Requests', function () {
    it('should return a promise', function () {
      assert.instanceOf(init().Summoner.get({ id: 32932398 }), Promise, 'this is a promise')
    })

    describe('returning callbacks', function () {
      it('should not retry on 404s', function (done) {
        const k = init()

        k.Summoner
          .by.name('abcdefghichau', function (err, data) {
            if (err) {
              if (err === 404) {
                expect(err).is.not.undefined
                done()
              }
            }
          })
      })

      it('returning should retry on 429s until all calls are successful and returned', function (done) {
        // Mock call to rate limit
        // Make sure to use dev key
        init().Summoner.by.name('Contractz')

        // Begin
        const k = init()

        function count(err, data) {
          if (data) --num
          if (num == 0) done()
        }

        let num = 10

        for (var i = 0; i < 10; ++i) {
          k.Champion.list('na', count)
        }
      })
    })

    describe('returning promises', function () {
      it('should not retry on 404s', function (done) {
        const k = init()

        k.Summoner
          .by.name('abcdefghichau')
          .then(function (data) { return data })
          .catch(function (err) {
            if (err === 404) {
              expect(err).is.not.undefined
              done()
            }
          })
      })

      it('should retry on 429s until all calls are successful and returned', function (done) {
        // Mock call to rate limit
        // Make sure to use dev key
        init().Summoner.by.name('Contractz')

        const k = init()

        let num = 10

        for (var i = 0; i < 10; ++i) {
          k.Champion.list('na')
            .then(data => {
              --num
              if (num == 0) done()
            })
            .catch(err => console.error(err))
        }
      })
    })
  })
})