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

describe('Champion Mastery', function () {
  this.timeout(0)

  describe('get all champion masteries', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throw(() => init().ChampionMastery.all(), Error)
      })

      describe('through id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().ChampionMastery.all({ id }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .ChampionMastery.all({ id })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('through name', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().ChampionMastery.all({ name }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .ChampionMastery.all({ name })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('through account ID', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().ChampionMastery.all({ accId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .ChampionMastery.all({ accId })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })
    })
  })

  describe('get champion mastery by player ID and champion ID', function () {
    describe('object param', function () {

    })
  })

  describe('get total champion mastery score', function () {
    describe('object param', function () {

    })
  })
})