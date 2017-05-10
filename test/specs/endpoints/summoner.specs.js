require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
    should = chai.should,
    assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('Summoner', function() {
  describe('get', () => {
    describe('object param', () => {
      it('should fail on empty', () => {
        assert.throws(() => init().Summoner.get(), Error)
      })
    })

    describe('standard params', () => {
      describe('by', () => {
        describe('id', () => {
          it('should fail on empty', () => {
            assert.throws(() => init().Summoner.by.id(), Error)
          })
        })

        describe('name', () => {
          it('should fail on empty', () => {
            assert.throws(() => init().Summoner.by.name(), Error)
          })
        })

        describe('account', () => {
          it('should fail on empty', () => {
            assert.throws(() => init().Summoner.by.account(), Error)
          })
        })
      })
    })
  })
})