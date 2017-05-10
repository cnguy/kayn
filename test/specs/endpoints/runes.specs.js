require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
    should = chai.should,
    assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('Runes', function() {
  describe('get', () => {
    describe('object param', () => {
      it('should fail on empty', () => {
        assert.throws(() => init().Runes.get(), Error)
      })
    })

    describe('standard params', () => {
      describe('by', () => {
        describe('id', () => {
          it('should fail on empty', () => {
            assert.throws(() => init().Runes.by.id(), Error)
          })
        })

        describe('name', () => {
          it('should fail on empty', () => {
            assert.throws(() => init().Runes.by.name(), Error)
          })
        })

        describe('account', () => {
          it('should fail on empty', () => {
            assert.throws(() => init().Runes.by.account(), Error)
          })
        })
      })
    })
  })
})