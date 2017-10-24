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
    burst: true,
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
  kayn.Summoner.by.name('imaqtpie').then( data => {
    kayn.ChampionMastery.list(data.id).then( () => {});
    kayn.ChampionMastery.totalScore(data.id).then( () => {});
    kayn.LeaguePositions.by.summonerID(data.id).then( () => {});
    kayn.Matchlist.by.accountID(data.accountId).query({ queue: [420, 440, 470], season: 9, endIndex: 1 }).then( data => {
        data.matches.forEach( match => {
            kayn.Match.get(match.gameId).then( () => { });
        });
    });
    kayn.Matchlist.by.accountID(data.accountId).query({ endIndex: 5 }).then( data => {
        data.matches.forEach( match => {
            kayn.Match.get(match.gameId).then( () => {});
        });
    });
});
};

main();
