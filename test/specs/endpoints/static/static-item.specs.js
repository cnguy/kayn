/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../../utils/init')

var id = 3903

const config = {
  id,
  options: {
    itemData: 'all',
  },
  region: 'ru'
}

describe('Static Item', function () {
  this.timeout(0)

  describe('get static item', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Static.item(), Error)
      })

      describe('by id and options and region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static.item(config, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .item(config)
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('through callback', function () {
        it('should throw', function () {
          assert.throws(() =>
            init()
              .Static.item(function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              }), Error)
        })
      })

      describe('standard params', function () {
        it('should throw on empty', function () {
          assert.throws(() => init().Static.Item.by.id(), Error)
        })

        describe('by id', function () {
          describe('through callback', function () {
            it('should be a successful call', function (done) {
              init()
                .Static
                .Item.by.id(id, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              init()
                .Static
                .Item.by.id(id)
                .then(data => {
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })
        })

        describe('by id and options and callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .Item.by.id(id, config.options, function testCB(err, data) {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('by id and region', function () {
          describe('through callback', function () {
            it('should be a successful call', function (done) {
              init()
                .Static
                .Item.by.id(id, 'na', function testCB(err, data) {
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              init()
                .Static
                .Item.by.id(id, 'na')
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