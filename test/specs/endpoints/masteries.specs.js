require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('Masteries', function () {
  describe('get', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Masteries.get(), Error)
      })
    })

    describe('standard params', function () {
      describe('by', function () {
        describe('id', function () {
          it('should throw on empty', function () {
            assert.throws(() => init().Masteries.by.id(), Error)
          })
        })

        describe('name', function () {
          it('should throw on empty', function () {
            assert.throws(() => init().Masteries.by.name(), Error)
          })
        })

        describe('account', function () {
          it('should throw on empty', function () {
            assert.throws(() => init().Masteries.by.account(), Error)
          })
        })
      })
    })
  })
})