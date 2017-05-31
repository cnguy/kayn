/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../../utils/init')

const name = 'Contractz'
const id = 32932398
const accId = 47776491
const options = {
  queue: [420, 440],
  champion: 79
}
const region = 'na'

const badConfig = {
  options: {
    Queue: 420 // instead of queue
  }
}

const k = init()

describe('Matchlist', function () {
  this.timeout(0)

  describe('get', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => k.Matchlist.get(), Error)
      })

      it('should throw on falsy config', function () {
        assert.throws(() => k.Matchlist.get(badConfig), Error)
      })

      describe('by id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            k.Matchlist.get({ id }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })

          it('should be a successful call with region and options', function (done) {
            k
              .Matchlist.get({ id, options, region: 'na' }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region', function (done) {
            k
              .Matchlist.get({ id, region: 'na' }, function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .Matchlist.get({ id })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region and options', function (done) {
            k
              .Matchlist.get({ id, options, region: 'na' })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          it('should be a successful call with region', function (done) {
            k
              .Matchlist.get({ id, region: 'na' })
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
            k.Matchlist.get({ name }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .Matchlist.get({ name })
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
            k.Matchlist.get({ accId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .Matchlist.get({ accId })
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })
    })

    describe('standard params', function () {
      describe('by', function () {
        describe('id', function () {
          it('should throw on empty', function () {
            assert.throws(() => k.Matchlist.by.id(), Error)
            assert.throws(() => k.Matchlist.by.name(), Error)
            assert.throws(() => k.Matchlist.by.account(), Error)
          })

          describe('through callback', function () {
            it('should be a successful call', function (done) {
              k
                .Matchlist.by.id(id, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })

            it('should be a successful call with options', function (done) {
              k
                .Matchlist.by.id(id, options, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })

            it('should be a successful call with opts/reg', function (done) {
              k
                .Matchlist.by.id(id, options, region, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })

            it('should be a successful call with region', function (done) {
              k
                .Matchlist.by.id(id, region, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              k
                .Matchlist.by.id(id)
                .then(data => {
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })
        })

        describe('name', function () {
          it('should throw on empty', function () {
            assert.throws(() => k.Matchlist.by.name(), Error)
          })

          describe('through callback', function () {
            it('should be a successful call', function (done) {
              k
                .Matchlist.by.name(name, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })

            it('should be a successful call with options', function (done) {
              k
                .Matchlist.by.name(name, options, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })

            it('should be a successful call with opts/reg', function (done) {
              k
                .Matchlist.by.name(name, options, region, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })

            it('should be a successful call with region', function (done) {
              k
                .Matchlist.by.name(name, region, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              k
                .Matchlist.by.name(name)
                .then(data => {
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })
        })

        describe('account', function () {
          it('should throw on empty', function () {
            assert.throws(() => k.Matchlist.by.account(), Error)
          })

          describe('through callback', function () {
            it('should be a successful call', function (done) {
              k
                .Matchlist.by.account(accId, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })

            it('should be a successful call with options', function (done) {
              k
                .Matchlist.by.account(accId, options, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })

            it('should be a successful call with opts/reg', function (done) {
              k
                .Matchlist.by.account(accId, options, region, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })

            it('should be a successful call with region', function (done) {
              k
                .Matchlist.by.account(accId, region, function testCB(err, data) {
                  expect(err).to.be.null
                  expect(data).to.not.be.undefined
                  done()
                })
            })
          })

          describe('through promise', function () {
            it('should be a successful call', function (done) {
              k
                .Matchlist.by.account(accId)
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

  describe('recent', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => k.Matchlist.recent(), Error)
      })

      describe('by id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            k.Matchlist.recent({ id }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .Matchlist.recent({ id })
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
            k.Matchlist.recent({ name }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .Matchlist.recent({ name })
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
            k.Matchlist.recent({ accId }, function testCB(err, data) {
              expect(err).to.be.null
              expect(data).to.not.be.undefined
              done()
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            k
              .Matchlist.recent({ accId })
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