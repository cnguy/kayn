import { Kayn, REGIONS, METHOD_NAMES, BasicJSCache, RedisCache } from './';

const redisCache = new RedisCache({
    host: 'localhost',
    port: 5000,
    keyPrefix: 'kayn',
});

const basicCache = new BasicJSCache();

const myCache = redisCache; // or basicCache

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

kayn.Summoner.by
    .name('Contractz')
    .then(() => kayn.Summoner.by.name('Contractz'));

/*
200 @ https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/Contractz
CACHE HIT @ https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/Contractz
*/
