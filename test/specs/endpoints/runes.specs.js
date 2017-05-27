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

describe('Runes', function () {
  this.timeout(0)

  describe('get', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Runes.get(), Error)
      })

      describe('by id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().Runes.get({ id }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Runes.get({ id })
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
            init().Runes.get({ name }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Runes.get({ name })
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
            init().Runes.get({ accId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Runes.get({ accId })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })
    })

    describe('standard params', function () {
      describe('by', function () {
        describe('id', function () {
          it('should throw on empty', function () {
            assert.throws(() => init().Runes.by.id(), Error)
            assert.throws(() => init().Runes.by.name(), Error)
            assert.throws(() => init().Runes.by.account(), Error)
          })

          describe('through callback', function () {
            it('should be a successful call', function (done) {
              init()
                .Runes.by.id(id, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              init()
                .Runes.by.id(id)
                .then(data => {
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })
        })

        describe('name', function () {
          it('should throw on empty', function () {
            assert.throws(() => init().Runes.by.name(), Error)
          })

          describe('through callback', function () {
            it('should be a successful call', function (done) {
              init()
                .Runes.by.name(name, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              init()
                .Runes.by.name(name)
                .then(data => {
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })
        })

        describe('account', function () {
          it('should throw on empty', function () {
            assert.throws(() => init().Runes.by.account(), Error)
          })

          describe('through callback', function () {
            it('should be a successful call', function (done) {
              init()
                .Runes.by.account(accId, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              init()
                .Runes.by.account(accId)
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