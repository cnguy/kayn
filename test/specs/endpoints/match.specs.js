/* eslint-disable max-nested-callbacks */
require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

const matchId = 2450326677

describe('Match', function () {
  this.timeout(0)

  describe('get', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Match.get(), Error)
      })

      it('should not throw on non-empty', function () {
        assert.doesNotThrow(() => init().Match.get({ matchId }), Error)
      })

      it('should be a successful call with no args', function (done) {
        init().Match.get({ matchId })
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
            assert.throws(() => init().Match.by.id(), Error)
          })

          it('should not throw on non-empty', function () {
            assert.doesNotThrow(() => init().Match.by.id(matchId), Error)
          })

          it('should be a successful call with no args', function (done) {
            init().Match.by.id(matchId)
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('get', function () {
        it('should be a successful call', function (done) {
          init()
            .Match.get(matchId)
            .then(data => {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })
    })
  })

  describe('timeline', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Match.timeline(), Error)
      })

      it('should not throw on non-empty', function () {
        assert.doesNotThrow(() => init().Match.timeline({ matchId }), Error)
      })

      it('should be a successful call with no args', function (done) {
        init().Match.timeline({ matchId })
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })
    })

    describe('standard params', function () {
      describe('get', function () {
        it('should work with just id param', function (done) {
          init().Match
           .get(matchId)
           .then(data => {
             expect(data).to.not.be.undefined
             done()
           })
        })
      })
      describe('by', function () {
        describe('id', function () {
          it('should throw on empty', function () {
            assert.throws(() => init().Match.Timeline.by.id(), Error)
          })

          it('should not throw on non-empty', function () {
            assert.doesNotThrow(() => init().Match.Timeline.by.id(matchId), Error)
          })

          it('should be a successful call with no args', function (done) {
            init().Match.Timeline.by.id(matchId)
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