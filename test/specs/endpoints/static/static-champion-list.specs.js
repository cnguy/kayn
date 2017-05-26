/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../../utils/init')

var id = 50

const config = {
  options: {
    champListData: 'all',
  },
  region: 'kr'
}

describe('Static Champions', function () {
  this.timeout(0)

  describe('get static champions list', function () {
    describe('object param', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Static.champions(), Error)
      })

      describe('by options and region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static.champions(config, function testCB(err, data) {
                expect(err).to.be.bull
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .champions(config)
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('through callback', function () {
        it('should be a successful call', function (done) {
          init()
            .Static.champions(function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      describe('standard params', function () {
        it('should not throw on empty', function () {
          assert.doesNotThrow(() => init().Static.Champion.list(), Error)
        })

        describe('by options', function () {
          describe('through callback', function () {
            it('should be a successful call', function (done) {
              init()
                .Static
                .Champion.list(config, function testCB(err, data) {
                  expect(err).to.be.bull
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              init()
                .Static
                .Champion.list(config)
                .then(data => {
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })
        })
      })
    })
  })
})