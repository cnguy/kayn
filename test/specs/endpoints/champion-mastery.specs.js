/* eslint-disable max-nested-callbacks */
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

const k = init()

describe('Champion Mastery', function () {
  this.timeout(0)

  describe('get all champion masteries', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => k.ChampionMastery.all(), Error)
      })

      describe('by id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            k.ChampionMastery.all({ id }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .ChampionMastery.all({ id })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('by name', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            k.ChampionMastery.all({ name }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .ChampionMastery.all({ name })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('by account ID', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            k.ChampionMastery.all({ accId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
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
          k
            .ChampionMastery.get(config, function (err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
        })

        it('through promise', function (done) {
          k
            .ChampionMastery.get(config)
            .then(data => {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      it('should throw with just playerID', function () {
        assert.throws(() => k
          .ChampionMastery
          .get({ playerID: config.playerId }), Error)
      })

      it('should throw with just championID', function () {
        assert.throws(() => k
          .ChampionMastery
          .get({ championId: config.championId }), Error)
      })
    })
  })

  describe('get total champion mastery score', function () {
    describe('object param', function () {
      it('should throw on empty args', function () {
        assert.throws(() => k
          .ChampionMastery
          .score(), Error)
      })

      describe('through id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            k.ChampionMastery
              .score({ id }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .ChampionMastery
              .score({ id })
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
            k
              .ChampionMastery
              .score({ name }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .ChampionMastery
              .score({ name })
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
            k
              .ChampionMastery
              .score({ accId }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .ChampionMastery
              .score({ accId })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })
    })
  })
})