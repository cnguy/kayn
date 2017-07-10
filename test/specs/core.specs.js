/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  assert = chai.assert,
  sinonChai = require('sinon-chai'),
  sinon = require('sinon')

chai.use(sinonChai)

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

    it('should init with na default region', function () {
      const api = require('../../dist/kindred-api')

      const k = new api.Kindred({
        key: process.env.KEY
      })

      expect(k).is.not.undefined
      assert.equal(k.defaultRegion, 'na')
    })

    it('should init with right region with region arg', function () {
      const api = require('../../dist/kindred-api')

      const k = new api.Kindred({
        key: process.env.KEY,
        defaultRegion: api.REGIONS.KOREA
      })

      expect(k).is.not.undefined
      assert.equal(k.defaultRegion, 'kr')
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
      const k = api.QuickStart(process.env.KEY, true)
      expect(k).is.not.undefined
    })

    it('should init with right region with key & region (2 args)', function () {
      const api = require('../../dist/kindred-api')
      const k = api.QuickStart(process.env.KEY, api.REGIONS.KOREA)
      assert.equal(k.defaultRegion, 'kr')
    })

    it('should init with right region with key & region & debug (3 args)', function () {
      const api = require('../../dist/kindred-api')
      const k = api.QuickStart(process.env.KEY, api.REGIONS.KOREA, true)
      assert.equal(k.defaultRegion, 'kr')
    })

    it('should init with default na region with key & debug (2 args)', function () {
      const api = require('../../dist/kindred-api')
      const k = api.QuickStart(process.env.KEY, true)
      assert.equal(k.defaultRegion, 'na')
    })

    it('should init with cache timers', function () {
      const api = require('../../dist/kindred-api')
      const k = api.QuickStart(process.env.KEY, true)

      // k.CACHE_TIMERS = {
      //   CHAMPION: 2592000,
      //   CHAMPION_MASTERY: 21600,
      //   CURRENT_GAME: null,
      //   FEATURED_GAMES: null,
      //   GAME: 3600,
      //   LEAGUE: 21600,
      //   STATIC: 2592000,
      //   STATUS: null,
      //   MATCH: 2592000,
      //   MATCHLIST: 3600,
      //   RUNES_MASTERIES: 604800,
      //   SPECTATOR: null,
      //   STATS: 3600,
      //   SUMMONER: 846400,
      //   TOURNAMENT_STUB: 3600,
      //   TOURNAMENT: 3600
      // }

      // while (k.CACHE_TIMERS) {
      //   if (k.CACHE_TIMERS)
      // }
    })

    it('should init with nulled cache timers', function () {
      const api = require('../../dist/kindred-api')
      const k = new api.Kindred({
        key: process.env.KEY
      })

      for (var i = 0; i < Object.keys(k.CACHE_TIMERS).length; ++i) {
        assert.equal(k.CACHE_TIMERS[Object.keys(k.CACHE_TIMERS)[i]], 0)
      }
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
            expect(err).is.not.null
            if (err) {
              if (err === 404) {
                done()
              }
            }
          })
      })

      it('should retry on 429s until all calls are successful and returned', function (done) {
        const api = require('../../dist/kindred-api')

        const debug = true
        const spread = true
        const LIMITS = api.LIMITS

        const z = new api.Kindred({
          key: process.env.KEY_TO_RATE_LIMIT,
          limits: LIMITS.DEV
        })

        z.Summoner.get({ name: 'Contractz' }) // mock 429 causer

        const k = new api.Kindred({
          key: process.env.KEY_TO_RATE_LIMIT,
          debug,
          spread,
          limits: LIMITS.DEV
        })

        function count(err, data) {
          if (data)--num
          if (num === 0) done()
        }

        let num = 10

        for (var i = 0; i < 10; ++i) {
          k.Champion.list('na', count)
        }
      })

      describe('returning promises', function () {
        it('should not retry on 404s', function (done) {
          const k = init()

          k.Summoner
            .by.name('abcdefghichau')
            .then(data => data)
            .catch(err => {
              expect(err).is.not.null
              if (err === 404) {
                done()
              }
            })
        })

        it('should retry on 429s until all calls are successful and returned', function (done) {
          const api = require('../../dist/kindred-api')

          const debug = true
          const spread = true
          const LIMITS = api.LIMITS

          const z = new api.Kindred({
            key: process.env.KEY_TO_RATE_LIMIT,
            limits: LIMITS.DEV
          })

          z.Summoner.get({ name: 'Contractz' }) // mock 429 causer

          const k = new api.Kindred({
            key: process.env.KEY_TO_RATE_LIMIT,
            debug,
            spread,
            limits: LIMITS.DEV
          })

          let num = 10

          for (var i = 0; i < 20; ++i) {
            k.Champion.list('na')
              .then(data => {
                --num
                if (num === 0) done()
              })
              .catch(err => console.error(err))
          }
        })
      })
    })
  })

  describe('cache', function () {
    it('should work with callbacks', function (done) {
      const k = init()

      k.CACHE_TIMERS = {
        SUMMONER: 5000
      }

      k.Summoner
        .get({ name: 'Contractz' }, function (err, data) {
          if (data) {
            k.Summoner.get({ name: 'Contractz' }, function (err, data) {
              done()
            })
          }
        })
    })

    it('should work with promises', function (done) {
      const k = init()

      k.CACHE_TIMERS = {
        SUMMONER: 5000
      }

      k.Summoner
        .get({ name: 'Contractz' })
        .then(data => k.Summoner.get({ name: 'Contractz' }))
        .then(data => done())
    })
  })

  describe('debug', function () {
    beforeEach(function () {
      sinon.spy(console, 'log')
    })

    afterEach(function () {
      console.log.restore()
    })

    describe('print response debug', function () {
      it('should print text on cache hit', function (done) {
        const api = require('../../dist/kindred-api')

        const debug = true
        const LIMITS = api.LIMITS

        const k = new api.Kindred({
          key: process.env.KEY,
          debug,
          limits: LIMITS.DEV,
          cache: new api.InMemoryCache()
        })

        k.CACHE_TIMERS = {
          SUMMONER: 5000
        }

        k.Summoner
          .get({ name: 'Contractz' })
          .then(data => k.Summoner.get({ name: 'Contractz' }))
          .then(data => {
            expect(console.log).to.have.been.called
            done()
          })
      })

      it('should work with limits', function (done) {
        const api = require('../../dist/kindred-api')

        const debug = true

        const k = new api.Kindred({
          key: process.env.KEY,
          debug,
          showKey: false,
          limits: [[1, 1], [1, 1]]
        })

        k.Static.Champion.list(function (err, data) {
          expect(console.log).to.have.been.called
          done()
        })
      })

      it('should work w/o limits', function (done) {
        const api = require('../../dist/kindred-api')

        const debug = true

        const k = new api.Kindred({
          key: process.env.KEY,
          debug,
          showKey: false
        })

        k.Static.Champion.list(function (err, data) {
          expect(console.log).to.have.been.called
          done()
        })
      })

      it('should print headers', function (done) {
        const api = require('../../dist/kindred-api')

        const debug = true
        const showHeaders = true

        const k = new api.Kindred({
          key: process.env.KEY,
          debug,
          showHeaders
        })

        k.Static.Champion.list(function (err, data) {
          sinon.assert.calledThrice(console.log)
          done()
        })
      })

      it('should not print headers', function (done) {
        const api = require('../../dist/kindred-api')

        const debug = true
        const showHeaders = false

        const k = new api.Kindred({
          key: process.env.KEY,
          debug,
          showHeaders
        })

        k.Static.Champion.list(function (err, data) {
          sinon.assert.calledOnce(console.log)
          done()
        })
      })
    })
  })

  describe('error messages', function () {
    beforeEach(function () {
      sinon.spy(console, 'log')
    })

    afterEach(function () {
      console.log.restore()
    })

    it('should not initialize with bad limits', function () {
      const api = require('../../dist/kindred-api')
      const debug = true

      assert.throws(() => new api.Kindred({
        key: process.env.KEY,
        debug,
        showKey: false,
        limits: []
      }), Error)

      expect(console.log).to.have.been.called
    })
  })
})