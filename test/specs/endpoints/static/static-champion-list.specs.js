/* eslint-disable max-nested-callbacks */
var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

var has = require('lodash.has')

require('dotenv').config()

var init = require('../../../../utils/init')
var KindredAPI = require('../../../../dist/kindred-api')
const STATIC_CHAMPION_LIST_TAGS = KindredAPI.TAGS.STATIC_CHAMPION_LIST_TAGS

const config = {
  options: {
    tags: 'all'
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

      describe('query params', function () {
        it('should get allytips with tags=allytips set', function (done) {
          init()
            .Static
            .champions({
              options: {
                tags: 'allytips'
              }
            })
            .then(data => {
              expect(has(data.data.Kindred, 'allytips')).to.be.true
              done()
            })
            .catch(err => {
              throw new Error(err)
            })
        })

        it('should get blurb with tags=blurb set', function (done) {
          init()
            .Static
            .champions({
              options: {
                tags: 'blurb'
              }
            })
            .then(data => {
              expect(has(data.data.Kindred, 'blurb')).to.be.true
              done()
            })
            .catch(err => {
              throw new Error(err)
            })
        })

        it('should get blurb with tags=array of blurb', function (done) {
          init()
            .Static
            .champions({
              options: {
                tags: ['blurb']
              }
            })
            .then(data => {
              expect(has(data.data.Kindred, 'blurb')).to.be.true
              done()
            })
            .catch(err => {
              throw new Error(err)
            })
        })

        it('should get blurb with tags=array of allytips & blurb', function (done) {
          init()
            .Static
            .champions({
              options: {
                tags: ['allytips', 'blurb']
              }
            })
            .then(data => {
              expect(has(data.data.Kindred, 'allytips')).to.be.true
              expect(has(data.data.Kindred, 'blurb')).to.be.true
              done()
            })
            .catch(err => {
              throw new Error(err)
            })
        })

        it('should get all tags with all', function (done) {
          init()
            .Static
            .champions({
              options: {
                tags: 'all'
              }
            })
            .then(data => {
              STATIC_CHAMPION_LIST_TAGS.map(tag => {
                if (tag === 'format') {
                  expect(has(data, tag)).to.be.true
                } else if (tag === 'keys') {
                  expect(has(data, tag)).to.be.true
                } else {
                  expect(has(data.data.Kindred, tag)).to.be.true
                }
              })
              done()
            })
            .catch(err => {
              throw new Error(err)
            })
        })

        it('should return 400 bad request with typo in tags set', function (done) {
          init()
            .Static
            .champions({
              options: {
                tags: 'blurbie'
              }
            })
            .then(data => {
              throw new Error(data)
            })
            .catch(err => {
              expect(err).to.equal(400)
              done()
            })
        })
      })
    })

    describe('standard params', function () {
      it('should not throw on empty', function () {
        assert.doesNotThrow(() => init().Static.Champion.list(), Error)
      })

      describe('by callback', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Champion
            .list(function testCB(err, data) {
              expect(err).to.be.bull
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      describe('by region', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Champion
            .list('na')
            .then(data => {
              expect(data).to.not.be.undefined
              done()
            })
        })
      })

      describe('by options and region', function () {
        it('should be a successful call', function (done) {
          init()
            .Static
            .Champion
            .list(config.options, config.region, function testCB(err, data) {
              expect(err).to.be.bull
              expect(data).to.not.be.undefined
              done()
            })
        })

        describe('query params', function () {
          it('should get allytips with tags=allytips set', function (done) {
            init()
              .Static
              .Champion
              .list({ tags: 'allytips' }, 'kr')
              .then(data => {
                expect(has(data.data.Kindred, 'allytips')).to.be.true
                done()
              })
              .catch(err => {
                throw new Error(err)
              })
          })

          it('should get blurb with tags=blurb set', function (done) {
            init()
              .Static
              .Champion
              .list({ tags: 'blurb' }, 'kr')
              .then(data => {
                expect(has(data.data.Kindred, 'blurb')).to.be.true
                done()
              })
              .catch(err => {
                throw new Error(err)
              })
          })

          it('should get blurb with tags=array of blurb', function (done) {
            init()
              .Static
              .Champion
              .list({ tags: ['blurb'] }, 'kr')
              .then(data => {
                expect(has(data.data.Kindred, 'blurb')).to.be.true
                done()
              })
              .catch(err => {
                throw new Error(err)
              })
          })

          it('should get blurb with tags=array of allytips & blurb', function (done) {
            init()
              .Static
              .Champion
              .list({ tags: ['allytips', 'blurb'] }, 'kr')
              .then(data => {
                expect(has(data.data.Kindred, 'allytips')).to.be.true
                expect(has(data.data.Kindred, 'blurb')).to.be.true
                done()
              })
              .catch(err => {
                throw new Error(err)
              })
          })

          it('should get all tags with all', function (done) {
            init()
              .Static
              .Champion
              .list({ tags: 'all' }, 'kr')
              .then(data => {
                STATIC_CHAMPION_LIST_TAGS.map(tag => {
                  if (tag === 'format') {
                    expect(has(data, tag)).to.be.true
                  } else if (tag === 'keys') {
                    expect(has(data, tag)).to.be.true
                  } else {
                    expect(has(data.data.Kindred, tag)).to.be.true
                  }
                })
                done()
              })
              .catch(err => {
                throw new Error(err)
              })
          })

          it('should return 400 bad request with typo in tags set', function (done) {
            init()
              .Static
              .Champion
              .list({ tags: 'blurbie' }, 'kr')
              .then(data => {
                throw new Error(data)
              })
              .catch(err => {
                expect(err).to.equal(400)
                done()
              })
          })
        })
      })

      describe('by options', function () {
        describe('through callback', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .Champion
              .list(config.options, function testCB(err, data) {
                expect(err).to.be.bull
                expect(data).to.not.be.undefined
                done()
              })
          })

          describe('query params', function () {
            it('should get allytips with tags=allytips set', function (done) {
              init()
                .Static
                .Champion
                .list({ tags: 'allytips' }, function (err, data) {
                  if (err) {
                    throw new Error(err)
                  } else {
                    expect(has(data.data.Kindred, 'allytips')).to.be.true
                    done()
                  }
                })
            })

            it('should get blurb with tags=blurb set', function (done) {
              init()
                .Static
                .Champion
                .list({ tags: 'blurb' }, function (err, data) {
                  if (err) {
                    throw new Error(err)
                  } else {
                    expect(has(data.data.Kindred, 'blurb')).to.be.true
                    done()
                  }
                })
            })

            it('should get blurb with tags=array of blurb', function (done) {
              init()
                .Static
                .Champion
                .list({ tags: ['blurb'] }, function (err, data) {
                  if (err) {
                    throw new Error(err)
                  } else {
                    expect(has(data.data.Kindred, 'blurb')).to.be.true
                    done()
                  }
                })
            })

            it('should get blurb with tags=array of allytips & blurb', function (done) {
              init()
                .Static
                .Champion
                .list({ tags: ['allytips', 'blurb'] }, function (err, data) {
                  if (err) {
                    throw new Error(err)
                  } else {
                    expect(has(data.data.Kindred, 'allytips')).to.be.true
                    expect(has(data.data.Kindred, 'blurb')).to.be.true
                    done()
                  }
                })
            })

            it('should get all tags with all', function (done) {
              init()
                .Static
                .Champion
                .list({ tags: 'all' }, function (err, data) {
                  if (err) {
                    throw new Error(err)
                  } else {
                    STATIC_CHAMPION_LIST_TAGS.map(tag => {
                      if (tag === 'format') {
                        expect(has(data, tag)).to.be.true
                      } else if (tag === 'keys') {
                        expect(has(data, tag)).to.be.true
                      } else {
                        expect(has(data.data.Kindred, tag)).to.be.true
                      }
                    })
                    done()
                  }
                })
            })

            it('should return 400 bad request with typo in tags set', function (done) {
              init()
                .Static
                .Champion
                .list({ tags: 'blurbie' }, function (err, data) {
                  if (err) {
                    expect(err).to.equal(400)
                    done()
                  } else {
                    throw new Error(data)
                  }
                })
            })
          })
        })

        describe('through promise', function () {
          it('should be a successful call', function (done) {
            init()
              .Static
              .Champion
              .list(config.options, config.region)
              .then(data => {
                expect(data).to.not.be.undefined
                done()
              })
          })

          describe('query params', function () {
            it('should get allytips with tags=allytips set', function (done) {
              init()
                .Static
                .Champion
                .list({ tags: 'allytips' })
                .then(data => {
                  expect(has(data.data.Kindred, 'allytips')).to.be.true
                  done()
                })
                .catch(err => {
                  throw new Error(err)
                })
            })

            it('should get blurb with tags=blurb set', function (done) {
              init()
                .Static
                .Champion
                .list({ tags: 'blurb' })
                .then(data => {
                  expect(has(data.data.Kindred, 'blurb')).to.be.true
                  done()
                })
                .catch(err => {
                  throw new Error(err)
                })
            })

            it('should get blurb with tags=array of blurb', function (done) {
              init()
                .Static
                .Champion
                .list({ tags: ['blurb'] })
                .then(data => {
                  expect(has(data.data.Kindred, 'blurb')).to.be.true
                  done()
                })
                .catch(err => {
                  throw new Error(err)
                })
            })

            it('should get blurb with tags=array of allytips & blurb', function (done) {
              init()
                .Static
                .Champion
                .list({ tags: ['allytips', 'blurb'] })
                .then(data => {
                  expect(has(data.data.Kindred, 'allytips')).to.be.true
                  expect(has(data.data.Kindred, 'blurb')).to.be.true
                  done()
                })
                .catch(err => {
                  throw new Error(err)
                })
            })

            it('should get all tags with all', function (done) {
              init()
                .Static
                .Champion
                .list({ tags: 'all' })
                .then(data => {
                  STATIC_CHAMPION_LIST_TAGS.map(tag => {
                    if (tag === 'format') {
                      expect(has(data, tag)).to.be.true
                    } else if (tag === 'keys') {
                      expect(has(data, tag)).to.be.true
                    } else {
                      expect(has(data.data.Kindred, tag)).to.be.true
                    }
                  })
                  done()
                })
                .catch(err => {
                  throw new Error(err)
                })
            })

            it('should return 400 bad request with typo in tags set', function (done) {
              init()
                .Static
                .Champion
                .list({ tags: 'blurbie' })
                .then(data => {
                  throw new Error(data)
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
  })
})