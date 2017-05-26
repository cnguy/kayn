/* eslint-disable max-nested-callbacks */
require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

const name = 'Chaser Cat'
const id = 32932398
const accId = 47776491

const config = {
  playerId: id,
  championId: 50,
  region: 'na'
}

describe('Champion Mastery', function () {
  this.timeout(0)

  describe('get all champion masteries', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().ChampionMastery.all(), Error)
      })

      describe('through id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().ChampionMastery.all({ id }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .ChampionMastery.all({ id })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('through name', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().ChampionMastery.all({ name }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .ChampionMastery.all({ name })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('through account ID', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().ChampionMastery.all({ accId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .ChampionMastery.all({ accId })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })
    })
  })

  describe('get champion mastery by player ID and champion ID', function () {
    describe('object param', function () {
      describe('through playerID and championID', function () {
        it('through callback', function (done) {
          init()
            .ChampionMastery.get(config, function (err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
        })

        it('through promise', function (done) {
          init()
            .ChampionMastery.get(config)
            .then(data => {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      it('should throw with just playerID', function () {
        assert.throws(() => init()
          .ChampionMastery
          .get({ playerID: config.playerId }, Error))
      })

      it('should throw with just championID', function () {
        assert.throws(() => init()
          .ChampionMastery
          .get({ championId: config.championId }, Error))
      })
    })
  })

  describe('get total champion mastery score', function () {
    describe('object param', function () {

    })
  })
})