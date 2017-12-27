import { Kayn, REGIONS, METHOD_NAMES, BasicJSCache, RedisCache } from './';

/*
const redisCache = new RedisCache({
    host: 'localhost',
    port: 5000,
    keyPrefix: 'kayn',
});
*/

const basicCache = new BasicJSCache();

const myCache = basicCache; // or basicCache

const kayn = Kayn(/* optional key */)({
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
        ttls: {
            [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME]: 1000, // ms
        },
    },
});

const main = async () => {
    try {
        await kayn.Match.Tournament.listMatchIDs('12345');
        await kayn.Match.Tournament.get(12345, '21345');
    } catch (ex) {
        console.log(ex);
    }
};

main();
