require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('Masteries', function () {
  describe('get', () => {
    describe('object param', () => {
      it('should throw on empty', () => {
        assert.throws(() => init().Masteries.get(), Error)
      })
    })

    describe('standard params', () => {
      describe('by', () => {
        describe('id', () => {
          it('should throw on empty', () => {
            assert.throws(() => init().Masteries.by.id(), Error)
          })
        })

        describe('name', () => {
          it('should throw on empty', () => {
            assert.throws(() => init().Masteries.by.name(), Error)
          })
        })

        describe('account', () => {
          it('should throw on empty', () => {
            assert.throws(() => init().Masteries.by.account(), Error)
          })
        })
      })
    })
  })
})