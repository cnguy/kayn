/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

const region = 'kr'
const k = init()

describe('Spectator', function () {
  this.timeout(0)

  describe('CurrentGame', function () {
    it('should throw on empty', function () {
      assert.throws(() => k.CurrentGame.get(), Error)
    })//data['gameList'][0]['participants'][0]['summonerName']

    describe('by id', function () {
      describe('through promise', function () {
        it('should be a successful call', function (done) {
          k
            .FeaturedGames
            .list()
            .then(data => {
              const name = data['gameList'][0]['participants'][0]['summonerName']
              return k.Summoner.by.name(name)
            })
            .then(data => {
              return k.CurrentGame.get({ id: data.id })
            })
            .then(data => {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })
    })

    describe('by name', function () {
      describe('through promise', function () {
        it('should be a successful call', function (done) {
          k
            .FeaturedGames
            .list()
            .then(data => {
              const name = data['gameList'][0]['participants'][0]['summonerName']
              return k.Summoner.by.name(name)
            })
            .then(data => {
              return k.CurrentGame.get({ name: data.name })
            })
            .then(data => {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })
    })

    describe('by account id', function () {
      describe('through promise', function () {
        it('should be a successful call', function (done) {
          k
            .FeaturedGames
            .list()
            .then(data => {
              const name = data['gameList'][0]['participants'][0]['summonerName']
              return k.Summoner.by.name(name)
            })
            .then(data => {
              return k.CurrentGame.get({ accountId: data.accountId })
            })
            .then(data => {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })
    })
  })

  describe('FeatureGames', function () {
    describe('get', function () {
      describe('object param', function () {
        it('should not throw on empty', function () {
          assert.doesNotThrow(() => k.FeaturedGames.get(), Error)
        })

        describe('through callback', function () {
          it('should be a successful call', function (done) {
            k.FeaturedGames
              .get(function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('by region', function () {
          describe('through callback', function () {
            it('should be a successful call', function (done) {
              k.FeaturedGames
                .get({ region }, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              k.FeaturedGames
                .get({ region })
                .then(data => {
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })
        })
      })

      describe('standard params', function () {
        it('should not throw on empty', function () {
          assert.doesNotThrow(() => k.FeaturedGames.list(), Error)
        })

        describe('through callback', function () {
          it('should be a successful call', function (done) {
            k.FeaturedGames
              .list(function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('by region', function () {
          describe('through callback', function () {
            it('should be a successful call', function (done) {
              k.FeaturedGames
                .list(region, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              k.FeaturedGames
                .list(region)
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
})