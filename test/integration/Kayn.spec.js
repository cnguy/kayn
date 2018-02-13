import { expect, should, assert } from 'chai'

import { BasicJSCache, RedisCache, Kayn } from '../../lib/Kayn'

import DEFAULT_TTLS from '../../lib/Enums/default-ttls'
import METHOD_NAMES from '../../lib/Enums/method-names'

describe('Kayn', function() {
    this.timeout(0)

    describe('Caching', function() {
        it('BasicJSCache', function() {
            const kayn = Kayn('1234')({
                cacheOptions: {
                    cache: new BasicJSCache(),
                },
            })
            kayn.config.cacheOptions.cache.set(
                { key: 'cache-test', ttl: 5 },
                { foo: 'bar' },
            )
            kayn.config.cacheOptions.cache.get({ key: 'cache-test' }, function(
                err,
                data,
            ) {
                expect(err).to.be.null
                expect(data).to.not.be.null
                expect(data).to.deep.equal({ foo: 'bar' })

                kayn.flushCache()
                expect(kayn.config.cacheOptions.cache.cache).to.deep.equal({})
                kayn.config.cacheOptions.cache.get(
                    { key: 'cache-test' },
                    function(err, data) {
                        expect(err).to.not.be.null
                        expect(data).to.be.null
                    },
                )
            })
        })

        it('RedisCache', function(done) {
            const kayn = Kayn('1234')({
                cacheOptions: {
                    cache: new RedisCache(),
                },
            })
            kayn.config.cacheOptions.cache.set(
                { key: 'cache-test', ttl: 5 },
                { foo: 'bar' },
            )
            kayn.config.cacheOptions.cache.get({ key: 'cache-test' }, function(
                err,
                data,
            ) {
                expect(err).to.be.null
                expect(data).to.not.be.null
                expect(data).to.deep.equal({ foo: 'bar' })

                kayn.flushCache(function(err, succeeded) {
                    expect(err).to.be.null
                    expect(succeeded).to.equal('OK')
                    done()
                })
            })
        })

        describe.only('TTLs', function() {
            it('should set defaults', function() {
                const kayn = Kayn('cacher')({
                    cacheOptions: {
                        cache: new BasicJSCache(),
                        timeToLives: {
                            useDefault: true,
                        },
                    },
                })

                expect(kayn.config.cacheOptions.ttls).to.deep.equal(
                    DEFAULT_TTLS,
                )
            })

            it('should override defaults with specifics', function() {})

            it('should override defaults with groups', function() {
                const kayn = Kayn('123')({
                    cacheOptions: {
                        cache: new BasicJSCache(),
                        timeToLives: {
                            useDefault: true,
                            byGroup: {
                                STATIC: 3000,
                            },
                        },
                    },
                })

                const finalObj = { ...DEFAULT_TTLS }
                Object.keys(METHOD_NAMES.STATIC).map(key => {
                    finalObj[key] =
                        kayn.config.cacheOptions.timeToLives.byGroup.STATIC
                })
                expect(kayn.config.cacheOptions.ttls).to.deep.equal({
                    ...DEFAULT_TTLS,
                    ...finalObj,
                })
            })

            it('should override defaults and groups with specifics', function() {})

            it('should have no ttls without useDefault=true', function() {
                const kayn = Kayn('123')({
                    cacheOptions: {
                        cache: new BasicJSCache(),
                        timeToLives: {},
                    },
                })
                expect(kayn.config.cacheOptions.ttls).to.deep.equal({})
            })

            describe('backwards-compatibility and to ensure `ttls` is the source of truth', function() {
                it('should override defaults with old ttls prop', function() {})

                it('should override defaults and groups with old ttls prop', function() {})

                it('should override defaults, groups, and specifics with old ttls prop', function() {})
            })
        })
    })
})
