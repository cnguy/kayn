// Calls the featured games endpoint and then
// calls the current game endpoint on the first game's, first participant's id.

function main(kayn) {
    kayn.FeaturedGames.list().callback(function(error, list) {
        list = list.gameList
        if (!error && list.length > 0) {
            const participant = list[0].participants[0]
            kayn.Summoner.by
                .name(participant.summonerName)
                .callback(function(error, summoner) {
                    kayn.CurrentGame.by
                        .summonerID(summoner.id)
                        .callback(function(error, currentGame) {
                            console.log(currentGame)
                        })
                })
        }
    })
}

module.exports = main
