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
        kayn.DDragon.Champion.list().callback(function(error, champions) {
            console.log(Object.keys(champions).length)
        })
    } catch (ex) {
        console.log(ex)
    }
}

main()
