/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../../utils/init')

const config = {
  options: {
    tags: 'all'
  },
  region: 'kr'
}

describe.skip('Static Rune List', function () {
  this.timeout(0)

  describe('get static Rune list', function () {
    describe('object param', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Static.runes(), Error)
      })

      describe('by options and region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static.runes(config, function testCB(err, data) {
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
              .runes(config)
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
            .Static.runes(function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
        })
      })
    })

    describe('standard params', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Static.Rune.list(), Error)
      })

      describe('by callback', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Rune
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
            .Rune
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
            .Rune
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
              .Rune
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
              .Rune
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