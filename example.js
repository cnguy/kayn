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
        cache: new BasicJSCache(),
        ttls: { [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME]: 1000 },
    },
});

const print = val => console.log(val);
const printBoth = (err, data) => console.log(err, data);

const main = async () => {
    /*
    try {
        const summoner = await kayn.Summoner.by.name('pyang');
    } catch (ex) {
        console.log(ex);
    }
    const summoner = await kayn.Summoner.by.name('pyang');*/
    await Promise.all([
        kayn.Summoner.by.name('pyang'),
        kayn.Summoner.by.name('Contractz'),
        kayn.Summoner.by.name('KidKaito'),
        kayn.Summoner.by.name('hide in bush').region(REGIONS.KOREA),
    ]);
    /*
    try {
        return await kayn.Match.get(63506234);
    } catch (ex) {
        console.log('oopsie');
    }*/
    /*
    kayn.Summoner.by
        .name('Richelle')
        .then(({ accountId }) =>
            kayn.Matchlist.by.accountID(accountId).query({
                endTime: 1501072595895,
            }),
        )
        .then(({ matches }) => console.log(matches.length))
        .catch(console.log);*/
    /*
  recipes.grabSpecificChampionScores(kayn);
  recipes.sortChallengerLeagueByNumberOfWins(kayn);
  recipes.grabMatchesByChampionsFromRankedMatchlist(kayn);
  recipes.grabCurrentGameInfoOfFeaturedGamesList(kayn);
  recipes.grabRunesAndMasteriesOfChallengerPlayers(kayn);
  */
};

main();
