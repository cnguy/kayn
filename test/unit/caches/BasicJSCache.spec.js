import { expect, should, assert } from 'chai'

import BasicJSCache from '../../../lib/Caches/BasicJSCache'

describe('BasicJSCache', function() {
    it('should initialize', function() {
        expect(new BasicJSCache().cache).to.not.be.null
    })

    it('set & get should work', function() {
        const cache = new BasicJSCache()
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
        const cache = new BasicJSCache()
        const key = 'hey-guys'
        cache.get({ key }, (err, cached) => {
            expect(err).to.not.be.null
            expect(cached).to.be.null
        })
    })

    it('set & get should fail after expired timer', function(done) {
        const cache = new BasicJSCache()
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
        const cache = new BasicJSCache()
        const key = 'kayn-key-etc'
        const ttl = 3000
        const data = { cached: 'value' }
        cache.set({ key, ttl }, data)
        cache.get({ key }, (err, cached) => {
            expect(err).to.be.null
            expect(cached).to.not.be.null
            cache.flushCache()
            expect(cache.cache).to.deep.equal({})
            expect(Object.keys(cache.cache).length).to.equal(0)
        })
    })
})
