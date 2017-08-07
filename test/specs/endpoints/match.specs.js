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

      it('should not throw with right options', function () {
        assert.doesNotThrow(() =>
          k.Match.get({
            id: 2478544123,
            options: {
              forAccountId: 31643150,
              forPlatformId: 'NA1'
            }
          })
        , Error)
      })

      it('should be a successful call with options', function (done) {
        k.Match.get({
          id: 2478544123,
          options: {
            forAccountId: 31643150,
            forPlatformId: 'NA1'
          }
        }).then(data => {
          expect(data).to.not.be.undefined
          done()
        })
      })

      it('should throw with bad options', function () {
        assert.throws(() => {
          k.Match.get({
            id: 2478544123,
            options: {
              forAccountID: 31643150,
              forPlatformId: 'NA1'
            }
          })
        }, Error)
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

          it('should not throw with right options', function () {
            assert.doesNotThrow(() => k.Match.by.id(2392431795, { forAccountId: 123456 }), Error)
          })

          it('should be a successful call with options', function (done) {
            const opts = { forAccountId: 123456, forPlatformId: 'NA1' }
            k.Match.by.id(2392431795, opts, 'na')
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should throw with bad options', function () {
            const badOpts1 = { foraccountId: 123456, forPlatformId: 'NA1' }
            assert.throws(() => k.Match.by.id(2392431795, badOpts1, 'na', _kindredApi.print), Error)
            const badOpts2 = { forAccountId: 123456, forPPlatformId: 'NA1' }
            assert.throws(() => k.Match.by.id(2392431795, badOpts2, 'na', _kindredApi.print), Error)
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