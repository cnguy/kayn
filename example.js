const recipes = require('./recipes');
const { Kayn, REGIONS, METHOD_NAMES, BasicJSCache, RedisCache } = require('./');

const kayn = Kayn(/* optional key */)({
  region: 'na',
  debugOptions: {
    isEnabled: true,
    showKey: false,
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1000,
  },
  cacheOptions: {
    cache: null,
    ttls: {},
  },
});

const print = val => console.log(val);
const printBoth = (err, data) => console.log(err, data);

const main = async () => {
  /*
  recipes.grabSpecificChampionScores(kayn);
  recipes.sortChallengerLeagueByNumberOfWins(kayn);
  recipes.grabMatchesByChampionsFromRankedMatchlist(kayn);
  recipes.grabCurrentGameInfoOfFeaturedGamesList(kayn);
  recipes.grabRunesAndMasteriesOfChallengerPlayers(kayn);
  */
  kayn.Summoner.by.name('Contractz').callback(console.log)
};

main();
