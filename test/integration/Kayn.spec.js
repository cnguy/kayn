import { expect, should, assert } from 'chai'

import { BasicJSCache, LRUCache, RedisCache, Kayn } from '../../lib/Kayn'

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

        it('LRUCache', function() {
            const kayn = Kayn('1234')({
                cacheOptions: {
                    cache: new LRUCache(),
                },
            })
            kayn.config.cacheOptions.cache.set(
                {
                    key: 'cache-test',
                    ttl: 5,
                },
                { foo: 'bar' },
            )
            kayn.config.cacheOptions.cache.get(
                { key: 'cache-test' },
                async function(err, data) {
                    expect(err).to.be.null
                    expect(data).to.not.be.null
                    expect(data).to.deep.equal({ foo: 'bar' })
                    const ok = await kayn.flushCache()
                    expect(ok).to.equal('OK')
                },
            )
        })

        it.skip('RedisCache', function(done) {
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

        describe('TTLs', function() {
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

            it('should override defaults with specifics', function() {
                const kayn = Kayn('123')({
                    cacheOptions: {
                        cache: new BasicJSCache(),
                        timeToLives: {
                            useDefault: true,
                            byMethod: {
                                [METHOD_NAMES.SUMMONER
                                    .GET_BY_ACCOUNT_ID]: 109999999990, // ms
                            },
                        },
                    },
                })

                expect(kayn.config.cacheOptions.ttls).to.deep.equal({
                    ...DEFAULT_TTLS,
                    [METHOD_NAMES.SUMMONER.GET_BY_ACCOUNT_ID]: 109999999990,
                })
            })

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
                    finalObj[METHOD_NAMES.STATIC[key]] =
                        kayn.config.cacheOptions.timeToLives.byGroup.STATIC
                })
                expect(kayn.config.cacheOptions.ttls).to.deep.equal({
                    ...DEFAULT_TTLS,
                    ...finalObj,
                })
            })

            it('should override defaults and groups with specifics', function() {
                const kayn = Kayn('123')({
                    cacheOptions: {
                        cache: new BasicJSCache(),
                        timeToLives: {
                            useDefault: true,
                            byGroup: {
                                STATIC: 3000,
                            },
                            byMethod: {
                                [METHOD_NAMES.STATIC.GET_CHAMPION_BY_ID]: 100,
                                [METHOD_NAMES.SUMMONER.GET_BY_ACCOUNT_ID]: 100,
                            },
                        },
                    },
                })
                const finalObj = { ...DEFAULT_TTLS }
                Object.keys(METHOD_NAMES.STATIC).map(key => {
                    finalObj[METHOD_NAMES.STATIC[key]] =
                        kayn.config.cacheOptions.timeToLives.byGroup.STATIC
                })
                expect(kayn.config.cacheOptions.ttls).to.deep.equal({
                    ...DEFAULT_TTLS,
                    ...finalObj,
                    ...{ [METHOD_NAMES.STATIC.GET_CHAMPION_BY_ID]: 100 },
                    ...{ [METHOD_NAMES.SUMMONER.GET_BY_ACCOUNT_ID]: 100 },
                })
            })

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
                it('should override defaults with old ttls prop', function() {
                    const kayn = Kayn('123')({
                        cacheOptions: {
                            cache: new BasicJSCache(),
                            timeToLives: { useDefault: true },
                            ttls: {
                                [METHOD_NAMES.SUMMONER
                                    .GET_BY_SUMMONER_NAME]: 123456,
                            },
                        },
                    })
                    expect(kayn.config.cacheOptions.ttls).to.deep.equal({
                        ...DEFAULT_TTLS,
                        [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME]: 123456,
                    })
                })

                it('should override defaults and groups with old ttls prop', function() {
                    const kayn = Kayn('123')({
                        cacheOptions: {
                            cache: new BasicJSCache(),
                            timeToLives: {
                                useDefault: true,
                                byGroup: {
                                    STATIC: 9877665551,
                                },
                            },
                            ttls: {
                                [METHOD_NAMES.STATIC
                                    .GET_CHAMPION_BY_ID]: 123459,
                            },
                        },
                    })
                    expect(
                        kayn.config.cacheOptions.ttls[
                            METHOD_NAMES.STATIC.GET_CHAMPION_LIST
                        ],
                    ).to.equal(9877665551)
                    expect(
                        kayn.config.cacheOptions.ttls[
                            METHOD_NAMES.STATIC.GET_CHAMPION_BY_ID
                        ],
                    ).to.equal(123459)
                })

                it('should override defaults, groups, and specifics with old ttls prop', function() {
                    const kayn = Kayn('123')({
                        cacheOptions: {
                            cache: new BasicJSCache(),
                            timeToLives: {
                                useDefault: true,
                                byGroup: {
                                    STATIC: 1238213,
                                },
                                byMethod: {
                                    [METHOD_NAMES.STATIC
                                        .GET_CHAMPION_BY_ID]: 9871,
                                    [METHOD_NAMES.STATIC
                                        .GET_ITEM_BY_ID]: 9821372173,
                                },
                            },
                            ttls: {
                                [METHOD_NAMES.STATIC
                                    .GET_CHAMPION_BY_ID]: 99999999,
                            },
                        },
                    })
                    expect(
                        kayn.config.cacheOptions.ttls[
                            METHOD_NAMES.STATIC.GET_CHAMPION_BY_ID
                        ],
                    ).to.equal(99999999)
                    expect(
                        kayn.config.cacheOptions.ttls[
                            METHOD_NAMES.STATIC.GET_ITEM_BY_ID
                        ],
                    ).to.equal(9821372173)
                })
            })
        })
    })
})
