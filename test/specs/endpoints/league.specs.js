require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('League', function () {
  describe('getting master leagues', () => {
    describe('standard params', () => {
      it('should work with no args', () => {
        assert.doesNotThrow(() => init().Master.list(), Error)
      })

      it('should work with queue', () => {
        assert.doesNotThrow(() => init().Master.list('RANKED_SOLO_5x5'), Error)
      })

      it('should work with queue & region (2 args)', () => {
        assert.doesNotThrow(() => init().Master.list('RANKED_SOLO_5x5', 'na'), Error)
      })

      it('should work with queue & region & cb (3 args)', () => {
        assert.doesNotThrow(() => init().Master.list('RANKED_SOLO_5x5', 'na', function() {}), Error)
      })
    })
  })

  describe('getting challenger leagues', () => {
    describe('standard params', () => {
      it('should work with no args', () => {
        assert.doesNotThrow(() => init().Challenger.list(), Error)
      })

      it('should work with queue', () => {
        assert.doesNotThrow(() => init().Challenger.list('RANKED_SOLO_5x5'), Error)
      })

      it('should work with queue & region (2 args)', () => {
        assert.doesNotThrow(() => init().Challenger.list('RANKED_SOLO_5x5', 'na'), Error)
      })

      it('should work with queue & region & cb (3 args)', () => {
        assert.doesNotThrow(() => init().Challenger.list('RANKED_SOLO_5x5', 'na', function() {}), Error)
      })
    })
  })
})