const grabCurrentGameInfoOfFeaturedGamesList = require('./grabbing-curr-game-info-of-first-featured-games');
const grabMatchesByChampionsFromRankedMatchlist = require('./grabbing-matches-by-champions-out-of-a-ranked-match-list');
const grabRunesAndMasteriesOfChallengerPlayers = require('./grabbing-runes-and-masteries-of-all-challengers');
const grabSpecificChampionScores = require('./grabbing-specific-champion-scores');
const sortChallengerLeagueByNumberOfWins = require('./sort-challenger-league-by-number-of-wins');

module.exports = {
  grabCurrentGameInfoOfFeaturedGamesList,
  grabMatchesByChampionsFromRankedMatchlist,
  grabRunesAndMasteriesOfChallengerPlayers,
  grabSpecificChampionScores,
  sortChallengerLeagueByNumberOfWins,
};
