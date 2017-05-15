require('./core-utils.specs.js')

var chai = require('chai')

var expect = chai.expect,
  should = chai.should,
  assert = chai.assert

require('dotenv').config()

var init = require('../../utils/init')

describe('In-memory (JS) Cache', function () {
  describe('set/get', function () {
    it('should yield cached data', function () {
      const k = init()

      k.cache.set({ key: 'http://abc.com', ttl: 3 }, { foo: 'bar' })

      k.cache.get({ key: 'http://abc.com' }, function (err, data) {
        expect(err).is.null // errors return as null with my cbs
        expect(data).is.not.undefined
      })
    })

    it('should not yield data with nonexistent cache key', function () {
      const k = init()

      k.cache.get({ key: 'http://nonexistent.com' }, function (err, data) {
        expect(err).is.not.undefined
        expect(data).is.undefined
      })
    })

    it('should not yield data with expired cache key', function () {
      // this is the same as being nonexistent, but I want
      // to simulate expired keys!
      const k = init()

      k.cache.set({ key: 'http://abc.com', ttl: 0 }, { foo: 'bar' })

      k.cache.get({ key: 'http://abc.com' }, (err, data) => {
        expect(err).is.not.undefined
        expect(data).is.undefined
      })
    })
  })

  describe('set expiration time', function () {
    it('should be accurate', function () {
      const k = init()

      const ttl = 10
      const convertToMilliseconds = 1000

      const d = Date.now()
      const exp = k.cache.setExp(d, ttl)

      assert(exp - d === ttl * convertToMilliseconds, 'date + 10*1000 = exp')
    })
  })
})