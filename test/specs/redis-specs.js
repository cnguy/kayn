/* eslint-disable max-nested-callbacks */
require('./core-utils.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

const KindredAPI = require('../../dist/kindred-api')
const k = new KindredAPI.Kindred({
  key: 'fakeKey',
  cache: new KindredAPI.RedisCache()
})

describe('Redis Cache', function () {
  describe('set/get', function () {
    it('should yield cached data', function () {
      k.cache.set({ key: 'http://abc.com', ttl: 3 }, { foo: 'bar' })

      k.cache.get({ key: 'http://abc.com' }, function (err, data) {
        expect(err).is.null // errors return as null with my cbs
        expect(data).is.not.null
      })
    })

    it('should not yield data with nonexistent cache key', function () {
      k.cache.get({ key: 'http://nonexistent.com' }, function (err, data) {
        expect(err).is.not.undefined
        expect(data).is.null
      })
    })

    it('should not yield data with expired cache key', function () {
      // this is the same as being nonexistent, but I want
      // to simulate expired keys!
      const ttl = 1

      k.cache.set({ key: 'http://abc.com', ttl }, { foo: 'bar' })


      setTimeout(() => {
        k.cache.get({ key: 'http://abc.com' }, (err, data) => {
          expect(err).is.not.undefined
          expect(data).is.null
        })
      }, ttl + 1)
    })
  })
})