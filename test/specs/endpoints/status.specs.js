/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('Status', function () {
  this.timeout(0)

  describe('get', function () {
    describe('object param', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Status.get(), Error)
      })

      it('should throw on invalid region', function () {
        assert.throw(() => init().Status.get({ region: 'garbage' }), Error)
      })

      it('should be a successful call', function (done) {
        init().Status.get()
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })
    })
  })
})