/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../../utils/init')

const config = {
  options: {
    masteryListData: 'all'
  },
  region: 'kr'
}

describe('Static Mastery List', function () {
  this.timeout(0)

  describe('get static mastery list', function () {
    describe('object param', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Static.masteries(), Error)
      })

      describe('by options and region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static.masteries(config, function testCB(err, data) {
                expect(err).to.be.bull
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .masteries(config)
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('through callback', function () {
        it('should be a successful call', function (done) {
          init()
            .Static.masteries(function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
        })
      })
    })

    describe('standard params', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Static.Mastery.list(), Error)
      })

      describe('by callback', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Mastery
            .list(function testCB(err, data) {
              expect(err).to.be.bull
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      describe('by region', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Mastery
            .list('na')
            .then(data => {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      describe('by options and region', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Mastery
            .list(config.options, config.region, function testCB(err, data) {
              expect(err).to.be.bull
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      describe('by options', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .Mastery
              .list(config.options, function testCB(err, data) {
                expect(err).to.be.bull
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .Mastery
              .list(config.options, config.region)
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