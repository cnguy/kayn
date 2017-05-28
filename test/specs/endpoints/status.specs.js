/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

var k = init()

describe('Status', function () {
  this.timeout(0)

  describe('get', function () {
    describe('object param', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => k.Status.get(), Error)
      })

      it('should throw on invalid region', function () {
        assert.throw(() => k.Status.get({ region: 'garbage' }), Error)
      })

      describe('through callback', function () {
        it('should be a successful call', function (done) {
          k.Status.get(function testCB(err, data) {
            expect(err).to.be.null
            expect(data).to.not.be.undefined
            done()
          })
        })
      })

      describe('through promise', function () {
        it('should be a successful call', function (done) {
          k.Status.get()
            .then(data => {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })
    })
  })
})