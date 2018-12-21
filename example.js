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

const main = async () => {
    try {
        const contractz = await kayn.SummonerV4.by.name('Contractz')
        const contractz2 = await kayn.SummonerV4.by.puuid(contractz.puuid)
        const contractz3 = await kayn.SummonerV4.by.accountID(
            contractz2.accountId,
        )
        const contractz4 = await kayn.SummonerV4.by.id(contractz3.id)
        const challengers = await kayn.ChallengerV4.list('RANKED_SOLO_5x5')
        const grandmasters = await kayn.GrandmasterV4.list('RANKED_SOLO_5x5')
        // const inori = await kayn.SummonerV4.by.name('ìnori')
        console.log(kayn.TournamentV4.create('123', { test: 'boo' }))
        console.log(kayn.TournamentStubV4.create('123', { test: 'boo' }))
    } catch (ex) {
        console.log(ex)
    }
}

main()
