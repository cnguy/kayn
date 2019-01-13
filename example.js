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
        cache: new BasicJSCache(),
    },
})

import run from './examples/async.await/v4/get-detailed-info-from-last-5-ranked-matches'

const main = async () => {
    try {
        await run(kayn)
        console.log('done')
    } catch (ex) {
        console.log(ex)
    }
}

main()
