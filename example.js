import { Kayn, REGIONS, METHOD_NAMES, BasicJSCache, RedisCache } from './'

/*
const redisCache = new RedisCache({
    host: 'localhost',
    port: 5000,
    keyPrefix: 'kayn',
});
*/

const basicCache = new BasicJSCache()

const myCache = basicCache // or basicCache

const kayn = Kayn(/* optional key */)({
    region: 'na',
    debugOptions: {
        isEnabled: true,
        showKey: true,
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
})

import matchlistExample from './examples/grabbing-all-the-match-dtos-of-a-player'
import verifyExample from './examples/verifying-a-summoner'
import tournamentStubCreateExample from './examples/tournament-stub-create'

const main = async () => {
    //matchlistExample(kayn)
    //    tournamentStubCreateExample(kayn)
    try {
        await kayn.Summoner.by.name('dsafiuadsfgsaiodfhaofdsih')
    } catch ({ statusCode, url, ...rest }) {
        console.log('the status code:', typeof statusCode, statusCode)
        console.log('the url:', typeof url, url)
        console.log(rest)
    }
}

main()
