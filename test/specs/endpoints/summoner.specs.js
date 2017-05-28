/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

const name = 'Chaser Cat'
const id = 32932398
const accId = 32932398

const k = init()

describe('Summoner', function () {
  this.timeout(0)

  describe('get', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => k.Summoner.get(), Error)
      })

      it('should not throw on empty', function () {
        assert.doesNotThrow(() => k.Summoner.get({ name }), Error)
      })

      it('should not throw on empty', function () {
        assert.doesNotThrow(() => k.Summoner.get({ id }), Error)
      })

      it('should not throw on empty', function () {
        assert.doesNotThrow(() => k.Summoner.get({ accId }), Error)
      })

      it('should be a successful call through name', function (done) {
        k.Summoner.get({ name })
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })

      it('should be a successful call through id', function (done) {
        k.Summoner.get({ id })
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })

      it('should be a successful call through accId', function (done) {
        k.Summoner.get({ accId })
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })
    })

    describe('standard params', function () {
      describe('by', function () {
        describe('id', function () {
          it('should throw on empty', function () {
            assert.throws(() => k.Summoner.by.id(), Error)
          })

          describe('through callback', function () {
            it('should be a successful call', function (done) {
              k.Summoner.by.id(id, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
            })

            it('should be a successful call with region', function (done) {
              k.Summoner.by.id(id, 'na', function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              k.Summoner.by.id(id)
                .then(data => {
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })
        })

        describe('name', function () {
          it('should throw on empty', function () {
            assert.throws(() => k.Summoner.by.name(), Error)
          })

          it('should be a successful call', function (done) {
            k.Summoner.by.name(name)
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('account', function () {
          it('should throw on empty', function () {
            assert.throws(() => k.Summoner.by.account(), Error)
          })

          describe('through callback', function () {
            it('should be a successful call', function (done) {
              k.Summoner.by.account(accId, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
            })

            it('should be a successful call with region', function (done) {
              k.Summoner.by.account(accId, 'na', function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              k.Summoner.by.account(accId)
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