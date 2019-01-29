const processMatch = (championIdMap, summonerId, match) => {
    const { participantId } = match.participantIdentities.find(
        pi => pi.player.summonerId === summonerId,
    )
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
    const { id, accountId } = await kayn.Summoner.by.name('Jeongsik Oh')
    const { matches } = await kayn.Matchlist.by
        .accountID(accountId)
        .query({ queue: 420 })
    const gameIds = matches.slice(0, 10).map(({ gameId }) => gameId)
    const matchDtos = await Promise.all(gameIds.map(kayn.Match.get))
    // `processor` is a helper function to make the subsequent `map` cleaner.
    const processor = match => processMatch(championIdMap, id, match)
    const results = await Promise.all(matchDtos.map(processor))
    console.log(results)
    /* may look like this =>
[ { gameCreation: 1544249052770,
    seasonId: 11,
    didWin: true,
    championName: 'Talon' },
  { gameCreation: 1544245697414,
    seasonId: 11,
    didWin: false,
    championName: 'Zed' },
  { gameCreation: 1544244002044,
    seasonId: 11,
    didWin: false,
    championName: 'Talon' },
  { gameCreation: 1544241775356,
    seasonId: 11,
    didWin: true,
    championName: 'Talon' },
  { gameCreation: 1542980219253,
    seasonId: 11,
    didWin: true,
    championName: 'Talon' },
  { gameCreation: 1542978026353,
    seasonId: 11,
    didWin: false,
    championName: 'Zed' },
  { gameCreation: 1542976177203,
    seasonId: 11,
    didWin: true,
    championName: 'Talon' },
  { gameCreation: 1542889504566,
    seasonId: 11,
    didWin: true,
    championName: 'Talon' },
  { gameCreation: 1542887191822,
    seasonId: 11,
    didWin: false,
    championName: 'Zed' },
  { gameCreation: 1542885211670,
    seasonId: 11,
    didWin: false,
    championName: 'Malzahar' } ]
    */
}

module.exports = main
