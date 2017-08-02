/* eslint-disable max-nested-callbacks */
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
  describe('initialization', function () {
    it('should have default options', function () {
      const lol = new KindredAPI.Kindred({
        key: 'fakeKey',
        cache: new KindredAPI.RedisCache()
      })

      expect(lol.cache.client.connection_options.host).to.equal('127.0.0.1')
      expect(lol.cache.client.connection_options.port).to.equal(6379)
      expect(lol.cache.prefix).to.equal('kindredAPI-')
    })

    it('should be configurable', function () {
      const lol = new KindredAPI.Kindred({
        key: 'fakeKey',
        cache: new KindredAPI.RedisCache({
          host: '192.168.0.1',
          port: 5000,
          keyPrefix: 'testPrefix-'
        })
      })

      expect(lol.cache.client.connection_options.host).to.equal('192.168.0.1')
      expect(lol.cache.client.connection_options.port).to.equal(5000)
      expect(lol.cache.prefix).to.equal('testPrefix-')
    })
  })

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