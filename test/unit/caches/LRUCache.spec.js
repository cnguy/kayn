import { expect, should, assert } from 'chai'

import LRUCache from '../../../lib/Caches/LRUCache'

describe('LRUCache', function() {
    it('should initialize with default options', function() {
        const cache = new LRUCache()
        expect(cache.cache).to.not.be.null
        expect(cache.cache.max).to.equal(500)
    })

    it('should initialize with configured options', function() {
        const options = {
            max: 1,
        }
        const cache = new LRUCache(options)
        expect(cache.cache.max).to.equal(1)
    })

    it('set & get should work', function() {
        const cache = new LRUCache()
        const key = 'kayn-key-etc'
        const ttl = 3000
        const data = { cached: 'value' }
        cache.set(
            {
                key,
                ttl,
            },
            data,
        )
        cache.get({ key }, (err, cached) => {
            expect(err).to.be.null
            expect(cached).to.not.be.null
            expect(cached).to.deep.equal(data)
        })
    })

    it('get should fail if data does not exist', function() {
        const cache = new LRUCache()
        const key = 'hey-guys'
        cache.get({ key }, (err, cached) => {
            expect(err).to.not.be.null
            expect(cached).to.be.null
        })
    })

    it('set & get should fail after expired timer', function(done) {
        const cache = new LRUCache()
        const key = 'kayn-key-etc'
        const ttl = 100
        const data = { cached: 'value' }
        cache.set(
            {
                key,
                ttl,
            },
            data,
        )
        setTimeout(() => {
            cache.get({ key }, (err, cached) => {
                expect(err).to.not.be.null
                expect(cached).to.be.null
                done()
            })
        }, 1000)
    })

    it('flushCache() should reset cache', function() {
        const cache = new LRUCache()
        const key = 'kayn-key-etc'
        const ttl = 3000
        const data = { cached: 'value' }
        cache.set({ key, ttl }, data)
        cache.get({ key }, (err, cached) => {
            expect(err).to.be.null
            expect(cached).to.not.be.null
            cache.flushCache()
            cache.get({ key }, (err2, cached2) => {
                expect(err2).to.not.be.null
                expect(cached2).to.be.null
            })
        })
    })
})
