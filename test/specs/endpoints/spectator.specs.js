/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

const region = 'kr'

describe('FeatureGames', function () {
  this.timeout(0)

  describe('get', function () {
    describe('object param', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().FeaturedGames.get(), Error)
      })

      describe('by region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .FeaturedGames
              .get({ region }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .FeaturedGames
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
        assert.doesNotThrow(() => init().FeaturedGames.list(), Error)
      })

      describe('by region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .FeaturedGames
              .list(region, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .FeaturedGames
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