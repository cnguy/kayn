/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

var has = require('lodash.has')

require('dotenv').config()

var init = require('../../../../utils/init')
var KindredAPI = require('../../../../dist/kindred-api')
const STATIC_CHAMPION_TAGS = KindredAPI.TAGS.STATIC_CHAMPION_TAGS

var id = 497 // Rakan

const config = {
  id,
  options: {
    tags: 'all'
  },
  region: 'kr'
}

describe('Static Champion', function () {
  this.timeout(0)

  describe('get static champion', function () {
    describe('object param', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Static.champion(), Error)
      })

      describe('by id and options and region', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static.champion(config, function testCB(err, data) {
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
              .champion(config)
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
              .Static.champion(function testCB(err, data) {
                expect(err).to.be.null
                expect(data).to.not.be.undefined
                done()
              }), Error)
        })
      })

      describe('query params', function () {
        it('should get allytips with tags=allytips set', function (done) {
          init()
            .Static
            .champion({
              id,
              options: {
                tags: 'allytips'
              }
            })
            .then(data => {
              expect(has(data, 'allytips')).to.be.true
              done()
            })
            .catch(err => {
              throw new Error('wrong path', err)
            })
        })

        it('should get blurb with tags=blurb set', function (done) {
          init()
            .Static
            .champion({
              id,
              options: {
                tags: 'blurb'
              }
            })
            .then(data => {
              expect(has(data, 'blurb')).to.be.true
              done()
            })
            .catch(err => {
              throw new Error('wrong path', err)
            })
        })

        it('should get blurb with tags=array of blurb', function (done) {
          init()
            .Static
            .champion({
              id,
              options: {
                tags: ['blurb']
              }
            })
            .then(data => {
              expect(has(data, 'blurb')).to.be.true
              done()
            })
            .catch(err => {
              throw new Error('wrong path', err)
            })
        })

        it('should get blurb with tags=array of allytips & blurb', function (done) {
          init()
            .Static
            .champion({
              id,
              options: {
                tags: ['allytips', 'blurb']
              }
            })
            .then(data => {
              expect(has(data, 'allytips')).to.be.true
              expect(has(data, 'blurb')).to.be.true
              done()
            })
            .catch(err => {
              throw new Error('wrong path', err)
            })
        })

        it('should get all tags with all', function (done) {
          init()
            .Static
            .champion({
              id,
              options: {
                tags: 'all'
              }
            })
            .then(data => {
              STATIC_CHAMPION_TAGS.map(tag => {
                expect(has(data, tag)).to.be.true
              })
              done()
            })
            .catch(err => {
              throw new Error('wrong path', err)
            })
        })

        it('should return 400 bad request with typo in tags set', function (done) {
          init()
            .Static
            .champion({
              id,
              options: {
                tags: 'blurbie'
              }
            })
            .then(data => {
              throw new Error('wrong path', data)
            })
            .catch(err => {
              expect(err).to.equal(400)
              done()
            })
        })
      })
    })

    describe('standard params', function () {
      it('should throw on empty', function () {
        assert.throws(() => init().Static.Champion.by.id(), Error)
      })

      describe('by id', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .Champion.by.id(id, function testCB(err, data) {
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
              .Champion.by.id(id)
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
            .Champion.by.id(id, config.options, function testCB(err, data) {
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
              .Champion.by.id(id, 'na', function testCB(err, data) {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .Champion.by.id(id, 'na')
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })
        })
      })

      describe('query params', function () {
        it('should get allytips with tags=allytips set', function (done) {
          init()
            .Static
            .Champion.by.id(id, { tags: 'allytips' })
            .then(data => {
              expect(has(data, 'allytips')).to.be.true
              done()
            })
            .catch(err => {
              throw new Error('wrong path', err)
            })
        })

        it('should get blurb with tags=blurb set', function (done) {
          init()
            .Static
            .Champion.by.id(id, { tags: 'blurb' })
            .then(data => {
              expect(has(data, 'blurb')).to.be.true
              done()
            })
            .catch(err => {
              throw new Error('wrong path', err)
            })
        })

        it('should get blurb with tags=array of blurb', function (done) {
          init()
            .Static
            .Champion.by.id(id, { tags: ['blurb'] })
            .then(data => {
              expect(has(data, 'blurb')).to.be.true
              done()
            })
            .catch(err => {
              throw new Error('wrong path', err)
            })
        })

        it('should get blurb with tags=array of allytips & blurb', function (done) {
          init()
            .Static
            .Champion.by.id(id, { tags: ['allytips', 'blurb'] })
            .then(data => {
              expect(has(data, 'allytips')).to.be.true
              expect(has(data, 'blurb')).to.be.true
              done()
            })
            .catch(err => {
              throw new Error('wrong path', err)
            })
        })

        it('should get all tags with all', function (done) {
          init()
            .Static
            .Champion.by.id(id, { tags: 'all' })
            .then(data => {
              STATIC_CHAMPION_TAGS.map(tag => {
                expect(has(data, tag)).to.be.true
              })
              done()
            })
            .catch(err => {
              throw new Error('wrong path', err)
            })
        })

        it('should return 400 bad request with typo in tags set', function (done) {
          init()
            .Static
            .Champion.by.id(id, { tags: 'blurbie' })
            .then(data => {
              throw new Error('wrong path')
            })
            .catch(err => {
              expect(err).to.equal(400)
              done()
            })
        })
      })
    })
  })
})