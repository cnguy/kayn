// Grabs the champion mastery DTOs out of a set of champion ids from a specific player.

// Let's pretend that these IDs are the IDs of all the supports in the game.
const championIDs = [40, 67, 3, 4, 5, 6]

const main = async kayn => {
    const { id } = await kayn.Summoner.by.name('Contractz')
    const getChampionMasteryFromCtz = kayn.ChampionMastery.get(id)
    const requests = championIDs.map(getChampionMasteryFromCtz)
    const result = await Promise.all(requests)
    const scores = result.map(cm => cm.championPoints)
    console.log(scores)
}

module.exports = main
