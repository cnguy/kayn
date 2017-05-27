/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../../utils/init')

const name = 'Contractz'
const id = 32932398
const accId = 47776491
const region = 'na'

describe('Game', function () {
  this.timeout(0)

  describe('get', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Game.get(), Error)
      })

      describe('by id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().Game.get({ id }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Game.get({ id, region }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Game.get({ id })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Game.get({ id, region })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('by name', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().Game.get({ name }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Game.get({ name, region })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Game.get({ name })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Game.get({ name, region })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('by account id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init().Game.get({ accId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })

          it('should be a successful call with region', function (done) {
            init().Game.get({ accId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Game.get({ accId })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region', function (done) {
            init()
              .Game.get({ accId, region })
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