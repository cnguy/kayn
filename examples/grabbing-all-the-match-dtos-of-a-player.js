// Simple way to grab all the matches of a player. There might be a better way, but I can't remember
// if totalGames is reliable, which is why I go for a 404 check on top of the index check.

// Destructures match object.
const matchToGameId = ({ gameId }) => gameId
// getFN is required because of this file structure where `kayn` isn't included.
// mutationsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
const getAllMatchIDs = async (matchlistDTO, summoner, getFn) => {
    let restOfMatchIDs = []
    const { totalGames } = matchlistDTO
    console.log(`Total number of games to process: ${totalGames}`)
    if (totalGames > 100) {
        for (let beginIndex = 0; beginIndex < totalGames; beginIndex += 100) {
            const endIndex = beginIndex + 100
            const newIndexDTO = { beginIndex, endIndex }
            try {
                const newMatchlistDTO = await getFn(summoner, newIndexDTO)
                restOfMatchIDs = restOfMatchIDs.concat(
                    newMatchlistDTO.matches.map(matchToGameId),
                )
            } catch (statusCode) {
                if (statusCode === 404) break
            }
        }
    }
    return [...matchlistDTO.matches.map(matchToGameId), ...restOfMatchIDs]
}

const main = async kayn => {
    const getRankedMatchesForSummoner = async (summoner, indexObj) =>
        kayn.Matchlist.by
            .accountID(summoner.accountId)
            .region('na')
            .query({ queue: 420, season: 9 })
            .query(indexObj || {})

    const summoner = await kayn.Summoner.by.name('Contractz')

    // First DTO to get the total number of games.
    const firstMatchlistDTO = await getRankedMatchesForSummoner(summoner)
    const matchIDs = await getAllMatchIDs(
        firstMatchlistDTO,
        summoner,
        getRankedMatchesForSummoner,
    )

    // Now we have all the match ids!
    // Can batch process them now.
    const matches = await Promise.all(
        matchIDs.map(matchID => kayn.Match.get(matchID)),
    )
    console.log(matches)
    console.log(`${matches.length} matches processed.`)
}

module.exports = main
