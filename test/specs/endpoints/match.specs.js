/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

const matchId = 2478544123
const krMatchId = 2711264368

const k = init()

describe('Match', function () {
  this.timeout(0)

  describe('get', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => k.Match.get(), Error)
      })

      it('should not throw on non-empty', function () {
        assert.doesNotThrow(() => k.Match.get({ matchId }), Error)
      })

      it('should be a successful call with no args', function (done) {
        k.Match.get({ matchId })
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
            assert.throws(() => k.Match.by.id(), Error)
          })

          it('should not throw on non-empty', function () {
            assert.doesNotThrow(() => k.Match.by.id(matchId), Error)
          })

          describe('through callback', function () {
            it('should be a successful call with matchId', function (done) {
              k.Match.by.id(matchId, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
            })

            describe('with region', function () {
              it('should be a successful call with matchId', function (done) {
                k.Match.by.id(matchId, 'na', function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
              })
            })
          })

          describe('through promise', function () {
            it('should be a successful call with matchId', function (done) {
              k.Match.by.id(matchId)
                .then(data => {
                  expect(data).to.not.be.undefined
                  done()
                })
            })

            it('should be a successful call with matchId and region', function (done) {
              k.Match.by.id(matchId, 'na')
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

  describe('timeline', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => k.Match.timeline(), Error)
      })

      it('should not throw on non-empty', function () {
        assert.doesNotThrow(() => k.Match.timeline({ matchId }), Error)
      })

      describe('through callback', function () {
        it('should be a successful call', function (done) {
          k
            .Match
            .timeline({ id: matchId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      describe('through promise', function () {
        it('should be a successful call', function (done) {
          k
            .Match
            .timeline({ id: matchId })
            .then(data => {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })
    })

    describe('standard params', function () {
      it('should throw on empty', function () {
        assert.throws(() => k.Match.Timeline.by.id(), Error)
      })

      it('should not throw on non-empty', function () {
        assert.doesNotThrow(() => k.Match.Timeline.by.id(matchId), Error)
      })

      describe('by id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            k
              .Match
              .Timeline.by.id(matchId, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .Match
              .Timeline.by.id(matchId)
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('by id and region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            k
              .Match
              .Timeline.by.id(krMatchId, 'kr', function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .Match
              .Timeline.by.id(krMatchId, 'kr')
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