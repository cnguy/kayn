/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../../utils/init')

var id = 6323

const config = {
  id,
  options: {
    tags: 'all'
  },
  region: 'kr'
}

describe.skip('Static Mastery', function () {
  this.timeout(0)

  describe('get static mastery', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Static.mastery(), Error)
      })

      describe('by id and options and region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static.mastery(config, function testCB(err, data) {
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
              .mastery(config)
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('through callback', function () {
        it('should throw', function () {
          assert.throws(() =>
            init()
              .Static.mastery(function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              }), Error)
        })
      })
    })

    describe('standard params', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Static.Mastery.by.id(), Error)
      })

      describe('by id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .Mastery.by.id(id, function testCB(err, data) {
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
              .Mastery.by.id(id)
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('by id and options and callback', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Mastery.by.id(id, config.options, function testCB(err, data) {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      describe('by id and region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .Mastery.by.id(id, 'na', function testCB(err, data) {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .Mastery.by.id(id, 'na')
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