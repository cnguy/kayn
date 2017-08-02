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

describe.skip('Static Language', function () {
  this.timeout(0)

  describe('get static language list', function () {
    describe('object param', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Static.languages(), Error)
      })

      describe('by region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static.languages(config, function testCB(err, data) {
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
              .languages(config)
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
            .Static.languages(function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
        })
      })
    })

    describe('standard params', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Static.Language.list(), Error)
      })

      describe('by callback', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Language
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
            .Language
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
              .Language
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
              .Language
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