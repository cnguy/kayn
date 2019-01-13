const processMatch = (championIdMap, summonerId, match) => {
    const participantId = match.participantIdentities.find(
        pi => pi.player.summonerId === summonerId,
    ).participantId
    const participant = match.participants.find(
        p => p.participantId === participantId,
    )
    const champion = championIdMap.data[participant.championId]
    return {
        gameCreation: match.gameCreation,
        seasonId: match.seasonId,
        didWin:
            participant.teamId ===
            match.teams.find(({ win }) => win === 'Win').teamId,
        championName: champion.name,
    }
}

const main = async kayn => {
    const championIdMap = await kayn.DDragon.Champion.listDataByIdWithParentAsId()
    const { id, accountId } = await kayn.SummonerV4.by.name('Jeongsik Oh')
    const { matches } = await kayn.MatchlistV4.by
        .accountID(accountId)
        .query({ queue: 420 })
    const gameIds = matches.slice(0, 10).map(({ gameId }) => gameId)
    const matchDTOS = await Promise.all(gameIds.map(kayn.MatchV4.get))
    const processor = match => processMatch(championIdMap, id, match)
    const results = await Promise.all(matchDTOS.map(processor))
    console.log(results)
    /* may look like this =>
[ { id: 2927354323,
    gameCreation: 1544249052770,
    seasonId: 11,
    didWin: true,
    championName: 'Talon' },
  { id: 2927307437,
    gameCreation: 1544245697414,
    seasonId: 11,
    didWin: false,
    championName: 'Zed' },
  { id: 2927279380,
    gameCreation: 1544244002044,
    seasonId: 11,
    didWin: false,
    championName: 'Talon' },
  { id: 2927229107,
    gameCreation: 1544241775356,
    seasonId: 11,
    didWin: true,
    championName: 'Talon' },
  { id: 2916317387,
    gameCreation: 1542980219253,
    seasonId: 11,
    didWin: true,
    championName: 'Talon' },
  { id: 2916325989,
    gameCreation: 1542978026353,
    seasonId: 11,
    didWin: false,
    championName: 'Zed' },
  { id: 2916334457,
    gameCreation: 1542976177203,
    seasonId: 11,
    didWin: true,
    championName: 'Talon' },
  { id: 2915760392,
    gameCreation: 1542889504566,
    seasonId: 11,
    didWin: true,
    championName: 'Talon' },
  { id: 2915718895,
    gameCreation: 1542887191822,
    seasonId: 11,
    didWin: false,
    championName: 'Zed' },
  { id: 2915727550,
    gameCreation: 1542885211670,
    seasonId: 11,
    didWin: false,
    championName: 'Malzahar' } ]
    */
}

module.exports = main
