// Simple way to grab all the matches of a player.

// Destructures matchlist object to matches.
const matchlistToMatches = ({ matches }) => matches
// Destructures match object.
const matchToGameId = ({ gameId }) => gameId

// getFN is required because of this file structure where `kayn` isn't included.
// mutationsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
const getAllMatchIDs = async (matchlistDTO, accountID, getFn) => {
    const { totalGames } = matchlistDTO
    console.log(`Total number of games to process: ${totalGames}`)

    // Batch up calls together.
    const apiCalls = []
    if (totalGames > 100) {
        for (let beginIndex = 100; beginIndex < totalGames; beginIndex += 100) {
            const endIndex = beginIndex + 100
            const indexQuery = { beginIndex, endIndex }
            apiCalls.push(getFn(accountID, indexQuery))
        }
    }

    return [matchlistDTO]
        .concat(await Promise.all(apiCalls))
        .map(matchlistToMatches)
        .reduce((total, curr) => total.concat(curr), [])
        .map(matchToGameId)
}

const main = async kayn => {
    const getRankedMatchesForSummoner = async (accountID, indexQuery) =>
        kayn.Matchlist.by
            .accountID(accountID)
            .region('na')
            .query({ queue: 420, season: 9 })
            .query(indexQuery || {})

    const { accountId: accountID } = await kayn.Summoner.by.name('Contractz')

    // First DTO to get the total number of games.
    const firstMatchlistDTO = await getRankedMatchesForSummoner(accountID)
    const matchIDs = await getAllMatchIDs(
        firstMatchlistDTO,
        accountID,
        getRankedMatchesForSummoner,
    )

    // Now we have all the match ids!
    // Can batch process them now.
    const matches = await Promise.all(matchIDs.map(kayn.Match.get))
    console.log(matches)
    console.log(`${matches.length} matches processed.`)
}

module.exports = main
