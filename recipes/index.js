const grabSpecificChampionScores = require('./grabbing-specific-champion-scores');
const grabMatchesByChampionsFromRankedMatchlist = require('./grabbing-matches-by-champions-out-of-a-ranked-match-list');
const sortChallengerLeagueByNumberOfWins = require('./sort-challenger-league-by-number-of-wins');

module.exports = {
  grabMatchesByChampionsFromRankedMatchlist,
  grabSpecificChampionScores,
  sortChallengerLeagueByNumberOfWins,
};
