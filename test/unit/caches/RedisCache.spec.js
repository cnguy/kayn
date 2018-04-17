import { expect, should, assert } from 'chai'

import RedisCache from '../../../lib/Caches/RedisCache'

const LOCALHOST_ADDR = '127.0.0.1'

describe('RedisCache', function() {
    this.timeout(0)

    it('should initialize with default options', function() {
        const redis = new RedisCache()
        expect(redis.client.connection_options.host).to.equal(LOCALHOST_ADDR)
        expect(redis.client.connection_options.port).to.equal(6379)
        expect(redis.prefix).to.equal('kayn-')
    })

    it('should initialize with configured options 1', function() {
        const options = {
            host: '192.168.0.1',
            port: 5000,
            keyPrefix: 'testPrefix-',
        }
        const redis = new RedisCache(options)
        expect(redis.client.connection_options.host).to.equal(options.host)
        expect(redis.client.connection_options.port).to.equal(options.port)
        expect(redis.prefix).to.equal(options.keyPrefix)
    })

    it('should initialize with configured options 2', function() {
        const options = {
            host: '192.168.0.1',
            port: 5000,
            keyPrefix: 'testPrefix-',
            password: 'abcdefghijklmnopqrstuvwxyz',
        }
        const redis = new RedisCache(options)
        expect(redis.client.connection_options.host).to.equal(options.host)
        expect(redis.client.connection_options.port).to.equal(options.port)
        expect(redis.client.options.password).to.equal(options.password)
    })

    it('set & get should work', function() {
        const redis = new RedisCache()
        const key = 'kayn-key-etc'
        const ttl = 3000
        const data = { cached: 'value' }
        redis.set(
            {
                key,
                ttl,
            },
            data,
        )
        redis.get({ key }, (err, cached) => {
            expect(err).to.be.null
            expect(cached).to.not.be.null
            expect(cached).to.deep.equal(data)
        })
    })

    it('get should fail if data does not exist', function() {
        const redis = new RedisCache()
        const key = 'hey-guys'
        redis.get({ key }, (err, cached) => {
            expect(err).to.not.be.null
            expect(cached).to.be.null
        })
    })

    it('set & get should fail after expired timer', function() {
        const redis = new RedisCache()
        const key = 'kayn-key-etc'
        const ttl = 100
        const data = { cached: 'value' }
        redis.set(
            {
                key,
                ttl,
            },
            data,
        )
        setTimeout(() => {
            redis.get({ key }, (err, cached) => {
                expect(err).to.not.be.null
                expect(cached).to.be.null
            })
        }, 1000)
    })

    it('flushCache() should reset cache', function(done) {
        const redis = new RedisCache()
        const key = 'kayn-key-etc'
        const ttl = 3000
        const data = { cached: 'value' }
        redis.set({ key, ttl }, data)
        redis.get({ key }, (err, cached) => {
            expect(err).to.be.null
            expect(cached).to.not.be.null
            redis.flushCache(function(err, succeeded) {
                expect(err).to.be.null
                expect(succeeded).to.equal('OK')
                done()
            })
        })
    })
})
