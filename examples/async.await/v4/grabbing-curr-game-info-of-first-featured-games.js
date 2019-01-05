// Calls the featured games endpoint and then
// calls the current game endpoint on the first game's, first participant's id.

const main = async kayn => {
    const { gameList } = await kayn.FeaturedGamesV4.list()
    if (gameList.length > 0) {
        const { summonerName: firstPlayer } = gameList[0].participants[0]
        const { id } = await kayn.SummonerV4.by.name(firstPlayer)
        const currentGameInfo = await kayn.CurrentGameV4.by.summonerID(id)
        console.log(currentGameInfo)
    }
}

module.exports = main
