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

const myCache = new LRUCache({ max: 1 })

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
                STATIC: 1000,
            },
            byMethod: {
                [METHOD_NAMES.STATIC.GET_REFORGED_RUNE_PATH_LIST]: 5000,
                [METHOD_NAMES.STATIC.GET_REFORGED_RUNE_PATH_BY_ID]: 5000,
                [METHOD_NAMES.STATIC.GET_TARBALL_LINK]: 5000,
            },
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
    const { accountId } = await kayn.Summoner.by.name('Contractz')
    console.log(await kayn.Matchlist.Recent.by.accountID(accountId))
}

main()
