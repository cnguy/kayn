/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

describe('Champion', function () {
  this.timeout(0)

  describe('get all champions', function () {
    describe('object param', function () {
      it('should be a successful call with region', function (done) {
        init()
          .Champion.all('na')
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })

      it('should be a successful call with callback', function (done) {
        init()
          .Champion.all(function testCB(err, data) {
            expect(err).to.be.null
            expect(data).to.not.be.undefined
            done()
          })
      })
    })

    describe('standard params', function () {
      it('should be a successful call with no args', function (done) {
        init()
          .Champion.list()
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })

      it('should be a successful call with region', function (done) {
        init()
          .Champion.list('na')
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })

      it('should be a successful call with region and callback', function (done) {
        init()
          .Champion.list('na', function testCB(err, data) {
            expect(err).to.be.null
            expect(data).to.not.be.undefined
            done()
          })
      })

      it('should be a successful call with region', function (done) {
        init()
          .Champion.list('na')
          .then(data => {
            expect(data).to.not.be.undefined
            done()
          })
      })

      it('should be a successful call with region and callback', function (done) {
        init()
          .Champion.list('na', function testCB(err, data) {
            expect(err).to.be.null
            expect(data).to.not.be.undefined
            done()
          })
      })

      it('should work with just callback', function (done) {
        init()
          .Champion.list(function testCB(err, data) {
            expect(err).to.be.null
            expect(data).to.not.be.undefinde
            done()
          })
      })
    })
  })

  describe('get single champion', function () {
    describe('object param', function () {
      describe('get', function () {
        it('should throw with no args', function () {
          assert.throws(() => init().Champion.get(), Error)
        })

        it('should be a successful call', function (done) {
          init()
            .Champion.get({ id: 50, region: 'na' })
            .then(data => {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      describe('standard params', function () {
        describe('by', function () {
          describe('id', function () {
            it('should throw with no args', function () {
              assert.throws(() => init().Champion.get(), Error)
            })

            it('should be a successful call', function (done) {
              init()
                .Champion.by.id(50)
                .then(data => {
                  expect(data).to.not.be.undefined
                  done()
                })
            })

            it('should be a successful call with callback', function (done) {
              init()
                .Champion.by.id(50, function testCB(err, data) {
                  expect(err).to.be.null
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