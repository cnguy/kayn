require('./core-utils.specs.js')

var chai = require('chai')

var expect = chai.expect,
    should = chai.should,
    assert = chai.assert

require('dotenv').config()

var init = require('../../utils/init')

describe('In-memory (JS) Cache', function() {
  it('set/get data exists', () => {
    const k = init()

    k.cache.set({ key: 'http://abc.com', ttl: 3 }, { foo: 'bar' })

    k.cache.get({ key: 'http://abc.com' }, (err, data) => {
      expect(data).is.not.undefined
    })
  })

  it('set/get data does not exist', () => {
    const k = init()

    k.cache.set({ key: 'http://abc.com', ttl: 0 }, { foo: 'bar' }) // 100 * 1000 ms

    k.cache.get({ key: 'http://abc.com' }, (err, data) => {
      expect(data).is.undefined
    })
  })
})