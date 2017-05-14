require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('League', function () {
  this.timeout(0)

  describe('getting master leagues', () => {
    describe('standard params', () => {
      it('should not throw with no args', () => {
        assert.doesNotThrow(() => init().Master.list(), Error)
      })

      it('should not throw with queue', () => {
        assert.doesNotThrow(() => init().Master.list('RANKED_SOLO_5x5'), Error)
      })

      it('should not throw with queue & region (2 args)', () => {
        assert.doesNotThrow(() => init().Master.list('RANKED_SOLO_5x5', 'na'), Error)
      })

      it('should not throw with queue & region & cb (3 args)', () => {
        assert.doesNotThrow(() => init().Master.list('RANKED_SOLO_5x5', 'na', function () { }), Error)
      })

      it('should be a successful call with no args', function (done) {
        init().Master.list()
          .then(data => done())
          .catch(error => done())
      })
    })
  })

  describe('getting challenger leagues', () => {
    describe('standard params', () => {
      it('should not throw with no args', () => {
        assert.doesNotThrow(() => init().Challenger.list(), Error)
      })

      it('should not throw with queue', () => {
        assert.doesNotThrow(() => init().Challenger.list('RANKED_SOLO_5x5'), Error)
      })

      it('should not throw with queue & region (2 args)', () => {
        assert.doesNotThrow(() => init().Challenger.list('RANKED_SOLO_5x5', 'na'), Error)
      })

      it('should not throw with queue & region & cb (3 args)', () => {
        assert.doesNotThrow(() => init().Challenger.list('RANKED_SOLO_5x5', 'na', function () { }), Error)
      })
    })
  })
})