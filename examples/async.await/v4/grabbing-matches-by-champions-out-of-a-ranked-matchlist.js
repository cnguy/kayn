// Out of a player's ranked matchlist, grabs every match where they played a certain champion.

const main = async kayn => {
    const summoner = await kayn.Summoner.by.name('Contractz')
    // No constants in library as of now. Will be added soon.
    const config = {
        query: 420,
        champion: 67,
        season: 7,
    }

    // Note that the grabbing of a matchlist is currently limited by pagination.
    // This API request only returns the first list. An enhanced version of this method
    // will probably be included in the enhancer (which will be part of this library) called Rhaast.
    const matchlistDTO = await kayn.Matchlist.by
        .accountID(summoner.accountId)
        .region('na')
        .query(config)

    console.log(matchlistDTO.totalGames, matchlistDTO.matches.length)
}

module.exports = main
