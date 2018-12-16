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
    const contractz = await kayn.SummonerV4.by.name('Contractz')
    const contractz2 = await kayn.SummonerV4.by.puuid(contractz.puuid)
    const contractz3 = await kayn.SummonerV4.by.accountID(contractz2.accountId)
    const contractz4 = await kayn.SummonerV4.by.id(contractz3.id)
    console.log(contractz4)
    const challengers = await kayn.ChallengerV4.list('RANKED_SOLO_5x5')
    console.log(challengers)
    const grandmasters = await kayn.GrandmasterV4.list('RANKED_SOLO_5x5')
    const inori = await kayn.SummonerV4.by.name('ìnori')
    console.log(inori)
    console.log(
        (await kayn.MatchlistV4.by
            .accountID(inori.accountId)
            .query({ season: 11 })).matches[0],
    )
    const featuredGames = await kayn.FeaturedGamesV4.list()
    const summoner = await kayn.SummonerV4.by.name(
        featuredGames.gameList[0].participants[0].summonerName,
    )
    const currentGame = await kayn.CurrentGameV4.by.summonerID(summoner.id)
    console.log(currentGame)
    const chau = await kayn.SummonerV4.by.name('9 5 mcdonalds')
    console.log(chau.id)
    // const code = await kayn.ThirdPartyCodeV4.by.summonerID(chau.id) // should be 404
}

main()
