// Prints out the highest number of wins in RANKED_SOLO_5x5 challenger league.

const main = async kayn => {
  const challengerLeague = await kayn.Challenger.list('RANKED_SOLO_5x5');
  const smurfs = challengerLeague.entries.sort((a, b) => b.wins - a.wins);
  console.log(smurfs[0].wins);
};

module.exports = main;
