// Grabs the champion mastery DTOs out of a set of champion ids from a specific player.

// Let's pretend that these IDs are the IDs of all the supports in the game.
const championIDs = [1, 2, 3, 4, 5, 6]

const main = async kayn => {
    const { id } = await kayn.Summoner.by.name('Contractz')
    const getChampionFromCtz = kayn.ChampionMastery.get(id)
    const promises = Promise.all(championIDs.map(getChampionFromCtz))
    const supportChampionMasteries = await promises
    console.log(supportChampionMasteries)
}

module.exports = main
