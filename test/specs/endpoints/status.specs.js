require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('Status', function () {
  describe('get', function () {
    describe('object param', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Status.get(), Error)
      })

      it('should throw on invalid region', function () {
        assert.throw(() => init().Status.get('garbage'), Error)
      })
    })

    describe('standard params', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Status.get(), Error)
      })
    })
  })
})