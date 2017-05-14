require('../in-memory-cache.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('Status', function () {
  describe('get', () => {
    describe('object param', () => {
      it('should not throw on empty', () => {
        assert.doesNotThrow(() => init().Status.get(), Error)
      })

      it('should throw on invalid region', () => {
        assert.throw(() => init().Status.get('garbage'), Error)
      })
    })

    describe('standard params', () => {
      it('should not throw on empty', () => {
        assert.doesNotThrow(() => init().Status.get(), Error)
      })
    })
  })
})