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
})

const main = async () => {
    const provider = await kayn.TournamentStub.registerProviderData(
        REGIONS.NORTH_AMERICA,
        'https://localhost/cb',
    )
    const tournament = await kayn.TournamentStub.register(provider, 'kappa')
    const codes = await kayn.TournamentStub.create(tournament, {
        mapType: 'SUMMONERS_RIFT',
        metadata: 'Kappa',
        pickType: 'TOURNAMENT_DRAFT',
        spectatorType: 'NONE',
        teamSize: 5,
    }).query({ count: 5 })
}

main()
