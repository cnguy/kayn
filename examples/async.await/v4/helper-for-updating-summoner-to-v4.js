// This code wlil show you how to update a single summoner from V3 data to V4 data and then
// show you how to update a batch of summoners. It's not proper production code
// and is moreso meant to just give a general idea of what you should do.
const main = async kayn => {
    const mockDatabase = [
        {
            id: 2298770,
            accountId: 200245990,
            name: 'Wanderíng',
            region: 'las',
        },
        {
            id: 813780,
            accountId: 200440942,
            name: 'Ionia',
            region: 'oce',
        },
        {
            id: 20411671,
            name: 'Heisendong',
            accountId: 33373091,
            region: 'na',
        },
    ]

    console.log(mockDatabase)

    // Mock IO functions
    const getSummoner = i => mockDatabase[i]
    const storeSummoner = (i, summoner, region) => {
        mockDatabase[i] = summoner
        mockDatabase[i].region = region
    }

    const getV4FromV3 = summonerV3 =>
        kayn.Summoner.by.name(summonerV3.name).region(summonerV3.region)

    // Single update
    const indexToUpdate = 0
    const oldSummoner = getSummoner(indexToUpdate)
    const newSummoner = await getV4FromV3(oldSummoner)
    storeSummoner(indexToUpdate, newSummoner, oldSummoner.region)

    console.log(mockDatabase)

    // Batch update
    const newSummoners = await Promise.all(mockDatabase.map(getV4FromV3))
    for (let i = 0; i < mockDatabase.length; ++i) {
        storeSummoner(i, newSummoners[i], mockDatabase[i].region)
    }
    console.log(mockDatabase)
    console.log('database is now updated!')
}

module.exports = main
