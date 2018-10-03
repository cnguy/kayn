import {
    Kayn,
    REGIONS,
    METHOD_NAMES,
    BasicJSCache,
    LRUCache,
    RedisCache,
} from './'

/*
const redisCache = new RedisCache({
    host: 'localhost',
    port: 5000,
    keyPrefix: 'kayn',
});
*/

const myCache = new LRUCache({ max: 5 })

const kayn = Kayn()({
    region: 'na',
    debugOptions: {
        isEnabled: true,
        showKey: false,
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 1000,
    },
    cacheOptions: {
        cache: myCache,
        ttls: {},
        timeToLives: {
            useDefault: true,
            byGroup: {
                DDRAGON: 10000,
            },
            byMethod: {
                [METHOD_NAMES.DDRAGON.RUNES_REFORGED_LIST]: 5000,
                [METHOD_NAMES.CHAMPION.GET_CHAMPION_ROTATIONS]: 5000,
            },
        },
    },
})

import test from './examples/async.await/getting-banned-champions-of-a-game'

const main = async () => {
    test(kayn)
}

main()
