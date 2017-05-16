/* eslint-disable max-nested-callbacks */
require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

const name = 'Chaser Cat'
const id = 32932398
const accId = 32932398

describe('Summoner', function () {
  this.timeout(0)

  describe('get', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Summoner.get(), Error)
      })

      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Summoner.get({ name }), Error)
      })

      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Summoner.get({ id }), Error)
      })

      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Summoner.get({ accId }), Error)
      })

      it('should be a successful call through name', function (done) {
        init().Summoner.get({ name })
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })

      it('should be a successful call through id', function (done) {
        init().Summoner.get({ id })
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })

      it('should be a successful call through accId', function (done) {
        init().Summoner.get({ accId })
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
            assert.throws(() => init().Summoner.by.id(), Error)
          })

          it('should be a successful call', function (done) {
            init().Summoner.by.id(id)
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('name', function () {
          it('should throw on empty', function () {
            assert.throws(() => init().Summoner.by.name(), Error)
          })

          it('should be a successful call', function (done) {
            init().Summoner.by.name(name)
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('account', function () {
          it('should throw on empty', function () {
            assert.throws(() => init().Summoner.by.account(), Error)
          })

          it('should be a successful call', function (done) {
            init().Summoner.by.account(accId)
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