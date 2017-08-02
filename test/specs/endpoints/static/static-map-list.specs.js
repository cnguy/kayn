/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../../utils/init')

const config = {
  region: 'kr'
}

describe.skip('Static Map', function () {
  this.timeout(0)

  describe('get static map list', function () {
    describe('object param', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Static.mapData(), Error)
      })

      describe('by region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static.mapData(config, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .mapData(config)
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
            .Static.mapData(function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
        })
      })
    })

    describe('standard params', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Static.Map.list(), Error)
      })

      describe('by callback', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Map
            .list(function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      describe('by promise', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Map
            .list()
            .then(data => {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      describe('by region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .Map
              .list('na', function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .Map
              .list('na')
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