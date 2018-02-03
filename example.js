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
import championMasteryExample from './examples/grabbing-specific-champion-scores'
import sortChallengerExample from './examples/sort-challenger-league-by-number-of-wins'
import currentGameExample from './examples/grabbing-curr-game-info-of-first-featured-games'

const main = async () => {
    await matchlistExample(kayn)
}

main()
