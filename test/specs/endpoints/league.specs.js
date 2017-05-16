/* eslint-disable max-nested-callbacks */
require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('League', function () {
  this.timeout(0)

  describe('getting master leagues', function () {
    describe('standard params', function () {
      it('should not throw with no args', function () {
        assert.doesNotThrow(() => init().Master.list(), Error)
      })

      it('should throw with invalid queue type', function () {
        assert.throws(() => init().Master.list(420), Error)
      })

      it('should not throw with queue', function () {
        assert.doesNotThrow(() => init().Master.list('RANKED_SOLO_5x5'), Error)
      })

      it('should not throw with queue & region (2 args)', function () {
        assert.doesNotThrow(() => init().Master.list('RANKED_SOLO_5x5', 'na'), Error)
      })

      it('should not throw with region & cb (2 args)', function () {
        assert.doesNotThrow(() => init().Master.list('na', function () {}), Error)
      })

      it('should not throw with queue & cb (2 args)', function () {
        assert.doesNotThrow(() => init().Master.list('RANKED_SOLO_5x5', function () {}), Error)
      })

      it('should not throw with queue & region & cb (3 args)', function () {
        assert.doesNotThrow(() => init().Master.list('RANKED_SOLO_5x5', 'na', function () { }), Error)
      })

      it('should not throw with cb (1 args)', function () {
        assert.doesNotThrow(() => init().Master.list(function () { }), Error)
      })

      it('should be a successful call with no args', function (done) {
        init().Master.list()
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })
    })
  })

  describe('getting challenger leagues', function () {
    describe('standard params', function () {
      it('should not throw with no args', function () {
        assert.doesNotThrow(() => init().Challenger.list(), Error)
      })

      it('should throw with invalid queue type', function () {
        assert.throws(() => init().Challenger.list(420), Error)
      })

      it('should not throw with queue', function () {
        assert.doesNotThrow(() => init().Challenger.list('RANKED_SOLO_5x5'), Error)
      })

      it('should not throw with queue & region (2 args)', function () {
        assert.doesNotThrow(() => init().Challenger.list('RANKED_SOLO_5x5', 'na'), Error)
      })

      it('should not throw with region & cb (2 args)', function () {
        assert.doesNotThrow(() => init().Challenger.list('na', function () {}), Error)
      })

      it('should not throw with queue & cb (2 args)', function () {
        assert.doesNotThrow(() => init().Challenger.list('RANKED_SOLO_5x5', function () {}), Error)
      })

      it('should not throw with queue & region & cb (3 args)', function () {
        assert.doesNotThrow(() => init().Challenger.list('RANKED_SOLO_5x5', 'na', function () { }), Error)
      })

      it('should not throw with cb (1 args)', function () {
        assert.doesNotThrow(() => init().Challenger.list(function () { }), Error)
      })

      it('should be a successful call with no args', function (done) {
        init().Challenger.list()
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })
    })
  })
})