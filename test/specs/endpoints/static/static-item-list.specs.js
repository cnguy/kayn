/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../../utils/init')

const config = {
  options: {
    itemListData: 'all'
  },
  region: 'na'
}

describe('Static Items', function () {
  this.timeout(0)

  describe('get static items list', function () {
    describe('object param', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Static.items(), Error)
      })

      describe('by options and region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static.items(config, function testCB(err, data) {
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
              .items(config)
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
            .Static.items(function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
        })
      })
    })

    describe('standard params', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Static.Item.list(), Error)
      })

      describe('by callback', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Item
            .list(function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      describe('by region', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Item
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
            .Item
            .list(config.options, config.region, function testCB(err, data) {
              expect(err).to.be.null
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
              .Item
              .list(config.options, function testCB(err, data) {
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
              .Item
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