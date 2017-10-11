// Transforms a list of challenger players into their runes & masteries (lol).

const main = async kayn => {
  const challengerLeagueDTO = await kayn.Challenger.list('RANKED_SOLO_5x5');
  const { entries } = challengerLeagueDTO;
  const challengerRunes = await Promise.all(
    entries
      .slice()
      .map(
        async player => await kayn.Runes.by.summonerID(player.playerOrTeamId),
      ),
  );
  const challengerMasteries = await Promise.all(
    entries
      .slice()
      .map(
        async player =>
          await kayn.Masteries.by.summonerID(player.playerOrTeamId),
      ),
  );
  console.log(challengerRunes);
  console.log();
  console.log(challengerMasteries);
};

module.exports = main;
