/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../../utils/init')

const name = 'Contractz'
const id = 32932398
const accId = 47776491
const region = 'na'

const options = {
  season: 'SEASON2015'
}

describe('Stats', function () {
  this.timeout(0)

  describe('ranked', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Stats.ranked(), Error)
      })

      describe('by id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().Stats.ranked({ id }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Stats.ranked({ id, region }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region and options', function (done) {
            init()
              .Stats.ranked({ id, region, options }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with options', function (done) {
            init()
              .Stats.ranked({ id, options }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Stats.ranked({ id })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Stats.ranked({ id, region })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region and options', function (done) {
            init()
              .Stats.ranked({ id, region, options })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with options', function (done) {
            init()
              .Stats.ranked({ id, options })
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
            init().Stats.ranked({ name }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Stats.ranked({ name, region })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Stats.ranked({ name })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Stats.ranked({ name, region })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('by account id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().Stats.ranked({ accId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })

          it('should be a successful call with region', function (done) {
            init().Stats.ranked({ accId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Stats.ranked({ accId })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Stats.ranked({ accId, region })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })
    })
  })

  describe('summary', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Stats.summary(), Error)
      })

      describe('by id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().Stats.summary({ id }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Stats.summary({ id, region }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region and options', function (done) {
            init()
              .Stats.summary({ id, region, options }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with options', function (done) {
            init()
              .Stats.summary({ id, options }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Stats.summary({ id })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Stats.summary({ id, region })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region and options', function (done) {
            init()
              .Stats.summary({ id, region, options })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with options', function (done) {
            init()
              .Stats.summary({ id, options })
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
            init().Stats.summary({ name }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Stats.summary({ name, region })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Stats.summary({ name })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Stats.summary({ name, region })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('by account id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().Stats.summary({ accId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })

          it('should be a successful call with region', function (done) {
            init().Stats.summary({ accId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Stats.summary({ accId })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Stats.summary({ accId, region })
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