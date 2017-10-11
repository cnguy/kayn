require('babel-polyfill');
const kayn = require('./')();
const recipes = require('./recipes');

const print = val => console.log(val);
const printBoth = (err, data) => console.log(err, data);

const main = async () => {
  /*
  recipes.grabSpecificChampionScores(kayn);
  recipes.sortChallengerLeagueByNumberOfWins(kayn);
  recipes.grabMatchesByChampionsFromRankedMatchlist(kayn);
  recipes.grabRunesAndMasteriesOfChallengerPlayers(kayn);
  recipes.grabCurrentGameInfoOfFeaturedGamesList(kayn);
  */
};

main();
