const getChampionIdFromMatch = (match, accountId) => {
    for (let i in match.participantIdentities) {
        if (
            match.participantIdentities[i].player.currentAccountId === accountId
        ) {
            return match.participants[parseInt(i)].championId
        }
    }
}

const main = async kayn => {
    const { accountId } = await kayn.SummonerV4.by.name('Contractz')
    const rankGameIds = (await kayn.MatchlistV4.by
        .accountID(accountId)
        .query({ queue: 420 })).matches.map(el => el.gameId)
    const championIds = await Promise.all(
        rankGameIds.map(async gameId => {
            const matchDetail = await kayn.MatchV4.get(gameId).region('na')
            return getChampionIdFromMatch(matchDetail, accountId)
        }),
    )
    console.log(championIds.slice(0, 5), championIds.length)
}

module.exports = main
