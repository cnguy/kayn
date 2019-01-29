// Prints out the highest number of wins in RANKED_SOLO_5x5 challenger league.

const sortByIncWins = (a, b) => b.wins - a.wins

const main = async kayn => {
    const challengerLeague = await kayn.Challenger.list('RANKED_SOLO_5x5')
    const players = challengerLeague.entries.sort(sortByIncWins)
    console.log(players)
    console.log(players[0].wins)
}

module.exports = main
