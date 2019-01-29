// Prints out the highest number of wins in RANKED_SOLO_5x5 challenger league.

function sortByWinsDescending(a, b) {
    return b.wins - a.wins
}

function main(kayn) {
    kayn.Challenger.list('RANKED_SOLO_5x5').callback(function(
        error,
        challengers,
    ) {
        const players = challengers.entries.sort(sortByWinsDescending)
        console.log(players)
        console.log(players[0].wins)
    })
}

module.exports = main
