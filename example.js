const recipes = require('./recipes');
const {
    Kayn,
    Rhaast,
    REGIONS,
    METHOD_NAMES,
    BasicJSCache,
    RedisCache,
} = require('./');

const kayn = Kayn(/* optional key */)({
    region: 'na',
    debugOptions: {
        isEnabled: true,
        showKey: true,
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

const Summoner = Rhaast(kayn).Summoner;

const main = async () => {
    // A shell that simply has a name property and helper functions.
    const summoner = Summoner({ name: 'Contractz' });

    // The actual summoner object by Riot API.
    const fullSummoner = await summoner.get();

    // Getting the matchlist with the same summoner helper above. :)
    // Notice how you're able to call this without any mention of the account ID.
    const matchlist = await summoner.matchlist();
};

main();
