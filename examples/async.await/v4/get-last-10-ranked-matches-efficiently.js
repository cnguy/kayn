const main = async kayn => {
    const { accountId } = await kayn.SummonerV4.by.name('Jeongsik Oh')
    const { matches } = await kayn.MatchlistV4.by
        .accountID(accountId)
        .query({ queue: 420 })
    const gameIds = matches.slice(0, 10).map(({ gameId }) => gameId)
    const requests = gameIds.map(kayn.Match.get)
    const results = await Promise.all(requests)
    console.log(results)
}

module.exports = main
