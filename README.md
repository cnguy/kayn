# Kindred
Kindred is a Node.js wrapper with built-in rate-limiting (enforced per region), caching (Redis), and parameter checking on top of [Riot's League of Legends API](http://www.developer.riotgames.com).

## Table of Contents
* [Core Features](#core-features)
* [Philosophy](#philosophy)
* [Installation](#installation)
* [Endpoints Covered](#endpoints-covered)
* [Quickstart](#quickstart)
* [Detailed Usage](#detailed-usage)
* [Caching](#caching)
* [Contributing and Issues](#contributing-and-issues)

## Core Features
* All standard endpoints covered but one (get summoner by accountIDs).
* Supports both callbacks and promises.
* Rate limiter that is enforced per region.
    * Retries on 429 and >= 500.
        * Promise-based requests retry up to three times.
* Built-in parameter checks so you can hopefully refer to documentation less! :)
* Built-in, flexible caching (in-memory and redis).
    * Customized expiration timers. You can set a timer for each endpoint type. Refer to [Caching](#caching) for more info.
* Designed to be simple but convenient. For example, you can call an exclusively by-id endpoint (such as grabbing the runes of a player) with just the name.

## Philosophy
My goal is to make a wrapper that is simple, sensible, and consistent. This project is heavily inspired by [psuedonym117's Python wrapper](https://github.com/pseudonym117/Riot-Watcher). Look at the [Quickstart Section](#quickstart) to see what I mean.

## Installation
```
yarn add kindred-api
// or npm install kindred-api
```

## Endpoints Covered
Make sure to check the [official Riot Documentation](https://developer.riotgames.com/api-methods/) to see what query parameters you can pass in to each endpoint (through the options parameter)!

Note: All ```region``` parameters are **OPTIONAL**. All ```options``` parameters are **OPTIONAL** unless stated otherwise.

* [CHAMPION-MASTERY-V3](#champion-mastery)
* [CHAMPION-V3](#champion)
* [GAME-V1.3](#game)
* [LEAGUE-V2.5](#league)
* [LOL-STATUS-V3](#lol-status)
* [MASTERIES-V3](#masteries)
* [MATCH-V.2.2](#match)
* [MATCHLIST-V2.2](#matchlist)
* [RUNES-V3](#runes)
* [SPECTATOR-V3](#spectator)
* [STATIC-DATA-V3](#static-data)
* [STATS-V1.3](#stats)
* [SUMMONER-V3](#summoner)

### Champion Mastery
[docs](https://developer.riotgames.com/api-methods/#champion-mastery-v3)

1. **/lol/champion-mastery/v3/champion-masteries/by-summoner/{summonerId}**
    * Get all champion mastery entries sorted by number of champion points descending. (RPC)
    * getChampMasteries({ region = this.defaultRegion, id/summonerID/playerID (int), name (string), options (object) }, cb)
    * Namespaced Functions: *ChampionMastery.getChampionMasteries, ChampionMastery.getAll, ChampionMastery.all*
    * Example 1: ```k.ChampionMastery.all({ id: 20026563 }, rprint)```
    * Example 2: ```k.ChampionMastery.all({ id: 20026563 }).then(data => console.log(data))```
2. **/lol/champion-mastery/v3/champion-masteries/by-summoner/{summonerId}/by-champion/{championId}**
    * Get a champion mastery by player id and champion id.(RPC)
    * getChampMastery({ region = this.defaultRegion, playerID (int), championID (int), options (object) }, cb)
    * Namespaced Functions: *ChampionMastery.getChampionMastery, ChampionMastery.get*
    * Example 1: ```k.ChampionMastery.get({ playerID: 20026563, championID: 203 }, rprint)```
    * Example 2: ```k.ChampionMastery.get({ playerID: 20026563, championID: 203 }).then(data => console.log(data))```
3. **/lol/champion-mastery/v3/scores/by-summoner/{summonerId}**
    * Get a player's total champion mastery score, which is sum of individual champion mastery levels (RPC)
    * getTotalChampMasteryScore({ region = this.defaultRegion, id/summonerID/playerID (int), name (string), options (object) }, cb)
    * Namespaced Functions: *ChampionMastery.getTotalChampMasteryScore, ChampionMastery.getTotalScore, ChampionMastery.totalScore, ChampionMastery.total, ChampionMastery.score*
    * Example 1: ```k.ChampionMastery.score({ id: 20026563 }, rprint)```

### Champion
[docs](https://developer.riotgames.com/api-methods/#champion-v3)

1. **/lol/platform/v3/champions**
    * Retrieve all champions.
    * getChamps({ region, id (int), options (object) }, cb)
    * Namespaced Functions: *Champion.getChampions, Champion.getAll, Champion.all*
    * Example 1: ```k.Champion.all({ region: REGIONS.KOREA }, rprint)```
2. **/lol/platform/v3/champions/{id}**
    * Retrieve champion by ID.
    * getChamp({ region, id/championID (int) }, cb)
    * Namespaced Functions: *Champion.getChampion, Champion.get*
    * Example 1: ```k.Champion.get({ championID: 67 }, rprint)```
    * Example 2: ```k.Champion.get({ championID: 67 }).then(data => console.log(data))```
    * Example 3: ```k.Champion.get({ championID: 67, region: 'kr' }, rprint)```

### Game
[docs](https://developer.riotgames.com/api-methods/#game-v1.3)

1. **/api/lol/{region}/v1.3/game/by-summoner/{summonerId}/recent**
    * Get recent games by summoner ID. (REST)
    * getRecentGames({ region, id (int), name (str) }, cb)
    * Namespaced Functions: *Game.getRecentGames, Game.getRecent, Game.get*
    * Example 1: ```k.Game.get({ summonerID: 20026563 }, rprint)```

### League
[docs](https://developer.riotgames.com/api-methods/#league-v2.5)

1. **/api/lol/{region}/v2.5/league/by-summoner/{summonerIds}**
    * Get leagues mapped by summoner ID for a given list of summoner IDs. (REST)
    * getLeagues({ region, id/summonerID/player/ID (int), name (str) }, cb)
    * Namespaced Functions: *League.getLeagues, League.get*
    * Example 1: ```k.League.getLeagues({ summonerID: 20026563 }, rprint)```
    * Example 2: ```k.League.get({ summonerID: 20026563 }, rprint)```
2. **/api/lol/{region}/v2.5/league/by-summoner/{summonerIds}/entry**
    * Get league entries mapped by summoner ID for a given list of summoner IDs. (REST)
    * getLeagueEntries({ region, id/summonerID/playerID (int), name (str) }, cb)
    * Namespaced Functions: *League.getLeagueEntries, League.getEntries, League.entries*
    * Example 1: ```k.League.entries({ summonerID: 20026563 }, rprint)```
3. **/api/lol/{region}/v2.5/league/challenger**
    * Get challenger tier leagues. (REST)
    * getChallengers({ region, options: { type: 'RANKED_SOLO_5x5' } }, cb)
    * Namespaced Functions: *League.getChallengers, League.challengers*
    * Example 1: ```k.League.challengers(rprint)```
    * Example 2: ```k.League.challengers({ region: 'na' }, rprint)```
    * Example 3: ```k.League.challengers({ options: { type: 'RANKED_FLEX_SR' } }, rprint)```
4. **/api/lol/{region}/v2.5/league/master**
    * Get master tier leagues. (REST)
    * getMasters({ region, options: { type: 'RANKED_SOLO_5x5' } }, cb)
    * Namespaced Functions: *League.getMasters, League.masters*
    * Example 1: ```k.League.masters().then(data => console.log(data))```

### LoL Status
[docs](https://developer.riotgames.com/api-methods/#lol-status-v3)

1. **/lol/status/v3/shard-data**
    * Get League of Legends status for the given shard.
    * getShardStatus({ region }, cb)
    * Namespaced Functions: *Status.getShardStatus, Status.getStatus, Status.get*
    * Example 1: ```k.Status.get().then(data => console.log(data))```

### Masteries
[docs](https://developer.riotgames.com/api-methods/#masteries-v3)
1. **/api/lol/{region}/v1.4/summoner/{summonerIds}/masteries**
    * Get mastery pages for a given summoner ID.
    * getMasteries({ region, id/summonerID/playerID (int), name (str)}, cb)
    * Namespaced Functions: *RunesMasteries.getMasteries, RunesMasteries.masteries, Masteries.get*
    * Example 1: ```k.Masteries.get({ id: 20026563 }, rprint)```

### Match
[docs](https://developer.riotgames.com/api-methods/#match-v2.2)

1. **/api/lol/{region}/v2.2/match/{matchId}**
    * Retrieve match by match ID. (REST)
    * getMatch({ region, id/matchID (int), options: { includeTimeline: true } }, cb) 
    * Namespaced Functions: *Match.getMatch, Match.get*
    * Example 1: ```k.Match.get({ id: 1912829920 }, rprint)```
    * Example 2: ```k.Match.get({ id: 1912829920, options: { includeTimeline: false } }, rprint)```

### MatchList
[docs](https://developer.riotgames.com/api-methods/#matchlist-v2.2)

1. **/api/lol/{region}/v2.2/matchlist/by-summoner/{summonerId}**
    * Retrieve match list by match ID. (REST)
    * getMatchList({ region, id/summonerID/playerID (int), name (str), options: { rankedQueues: 'RANKED_SOLO_5x5' } }, cb)
    * Namespaced Functions: *MatchList.getMatchList, MatchList.get*
    * Example 1: ```k.MatchList.get({ id: 20026563 }, rprint)```
    * Example 2: ```k.MatchList.get({ id: 20026563, options: { rankedQueues: 'RANKED_FLEX_SR' } }, rprint)```

### Runes
[docs](https://developer.riotgames.com/api-methods/#runes-v3)

1. **/api/lol/{region}/v1.4/summoner/{summonerIds}/runes**
    * Get rune pages for a given summoner ID.
    * getRunes({ region, id/summonerID/playerID (int), name (str) }, cb)
    * Namespaced Functions: *RunesMasteries.getRunes, RunesMasteries.runes, Runes.get*
    * Example 1: ```k.Runes.get({ id: 20026563 }, rprint)```

### Spectator
[docs](https://developer.riotgames.com/api-methods/#spectator-v3)

1. **/lol/spectator/v3/active-games/by-summoner/{summonerId}**
    * Get current game information for the given summoner ID. (REST)
    * getCurrentGame({ region = this.defaultRegion, id/summonerID/playerID (int), name (str) }, cb)
    * Namespaced Functions: *CurrentGame.getCurrentGame, CurrentGame.get*
    * Example 1: ```k.CurrentGame.get({ name: 'Contractz' }, rprint)```
2. **/lol/spectator/v3/featured-games**
    * Get list of featured games. (REST)
    * getFeaturedGames({ region }, cb)
    * Namespaced Functions: *FeaturedGames.getFeaturedGames, FeaturedGames.get*
    * Example 1: ```k.FeaturedGames.get().then(data => console.log(data))```
    * Example 2: ```k.FeaturedGames.get({ region: 'na' }, rprint)```

### Static Data
[docs](https://developer.riotgames.com/api-methods/#static-data-v3)

1. **/lol/static-data/v3/champions**
    * Retrieves champion list. (REST)
    * getChampionList({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getChampions, Static.champions*
2. **/lol/static-data/v3/champions/{id}**
    * Retrieves a champion by its id. (REST)
    * getChampion({ region, id/championID (int), options (object) }, cb)
    * Namespaced Functions: *Static.getChampion, Static.champion*
3. **/lol/static-data/v3/items**
    * Retrieves item list. (REST)
    * getItems({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getItems, Static.items*
4. **/lol/static-data/v3/items/{id}**
    * Get master tier leagues. (REST)
    * getItem({ region, id/itemID (int), options (object) }, cb)
    * Namespaced Functions: *Static.getItem, Static.item*
5. **/lol/static-data/v3/language-strings**
    * Retrieve language strings data. (REST)
    * getLanguageStrings({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getLanguageStrings, Static.languageStrings*
6. **/lol/static-data/v3/languages**
    * Retrieve supported languages data. (REST)
    * getLanguages({ region }, cb)
    * Namespaced Functions: *Static.getLanguages, Static.languages*
7. **/lol/static-data/v3/maps**
    * Retrieve map data. (REST)
    * getMapData({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getMapData, Static.mapData, Static.map, Static.maps*
8. **/lol/static-data/v3/masteries**
    * Retrieve mastery list. (REST)
    * getMasteryList({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getMasteries, Static.masteries*
9. **/lol/static-data/v3/masteries/{id}**
    * Retrieves mastery item by its unique id. (REST)
    * getMastery({ region, id/masteryID (int), options (object) }, cb)
    * Namespaced Functions: *Static.getMastery, Static.mastery*
10. **/lol/static-data/v3/profile-icons**
11. **/lol/static-data/v3/realms**
    * Retrieve realm data. (REST)
    * getRealmData({ region }, cb)
    * Namespaced Functions: *Static.getRealmData, Static.realmData, Static.realm, Static.realms*
12. **/lol/static-data/v3/runes**
    * Retrieves rune list. (REST)
    * getRuneList({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getRunes, Static.runes*
13. **/lol/static-data/v3/runes/{id}**
    * Retrieves rune by its unique id. (REST)
    * getRune({ region, id/runeID (int), options (object) }, cb)
    * Namespaced Functions: *Static.getRune, Static.rune*
14. **/lol/static-data/v3/summoner-spells**
    * Retrieves summoner spell list. (REST)
    * getSummonerSpells({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getSummonerSpells, Static.summonerSpells, Static.spells*
15. **/lol/static-data/v3/summoner-spells/{id}**
    * Retrieves summoner spell by its unique id. (REST)
    * getSummonerSpell({ region, id/spellID/summonerSpellID (int), options (object) }, cb)
    * Namespaced Functions: *Static.getSummonerSpell, Static.summonerSpell, Static.spell*
16. **/lol/static-data/v3/versions**
    * Retrieve version data. (REST)
    * getVersionData({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getVersionData, Static.versionData, Static.version, Static.versions*

### Stats
[docs](https://developer.riotgames.com/api-methods/#stats-v1.3)

1. **/api/lol/{region}/v1.3/stats/by-summoner/{summonerId}/ranked**
    * Get ranked stats by summoner ID. (REST)
    * getRankedStats({ region, id/summonerID/playerID (int), name (str), options (object) }, cb)
    * Namespaced Functions: *Stats.getRankedStats, Stats.ranked*
    * Example 1: ```k.Stats.ranked({ id: 20026563 }, rprint)```
    * Example 2: ```k.Stats.ranked({ id: 20026563, options: { season: 'SEASON2016' } }, function(err,data){})```
2. **/api/lol/{region}/v1.3/stats/by-summoner/{summonerId}/summary**
    * Get player stats summaries by summoner ID. (REST)
    * getStatsSummary({ region, id/summonerID/playerID (int), name (str), options (object) }, cb)
    * Namespaced Functions: *Stats.getStatsSummary, Stats.summary*
    * Example 1: ```k.Stats.summary({ id: 20026563 }, rprint)```

### Summoner
[docs](https://developer.riotgames.com/api-methods/#summoner-v3)

1. **/api/lol/{region}/v1.4/summoner/by-account/{accountIds}**
    * Get a list of summoners by account ids (RPC).
    * N/A
2. **/lol/summoner/v3/summoners/by-name/{summonerName}**, **/lol/summoner/v3/summoners/{summonerId}**
    * Get a summoner by summoner name, Get a summoner by summoner id
    * getSummoners({ region, name (str) }, cb)
    * getSummoner({ region, id (int), name (str) }, cb)
    * Namespaced Functions: *Summoner.getSummoners, Summoner.getAll, Summoner.all, Summoner.getSummoner, Summoner.get*
    * Example 1: ```k.Summoner.get({ name: 'caaaaaaaaarIa' }, rprint)```
    * Example 2: ```k.Summoner.get({ id: 20026563 }, rprint)```

## Quickstart
Debug on, dev key rate limiting per region, in-memory cache with default settings on for quick scripts

```javascript
var KindredAPI = require('kindred-api')

var debug = true
var k = KindredAPI.QuickStart('YOUR_KEY', debug)

/* Summoners! */
k.Summoner.get({ id: 32932398 }, KindredAPI.print)
k.Summoner.get({ name: 'Contractz' }, KindredAPI.print)

/* No need to wrap nested API calls for exclusively by-id endpoints, the client does it for you. */
k.Runes.get({ region: 'na', name: 'Contractz' }).then(data => console.log(data))

/* How to pass in options 101. */
var name = 'caaaaaaaaaria'
var opts = {
  region: KindredAPI.REGIONS.NORTH_AMERICA,
  options: {
    rankedQueues: ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'], // no need for joins or messy strings
    championIDs: '67' // single values can be integers as well
  } // option params should be spelled and capitalized the same as it is in Riot's docs!
}

k.Summoner.get({ name: name, region: opts.region })
  .then(data => k.MatchList.get(
    Object.assign({ id: data.id }, opts)
  ))
  .then(data => console.log(data))
  .catch(err => console.err(error))

/*
    Instead of chaining requests like in the above, you can simply call
    k.MatchList.get with the `name` param.
*/
k.MatchList.get({ name: name, options: opts.options })
           .then(data => console.log(data))
           .catch(err => console.error(err))
```

## Detailed Usage
```javascript
var KindredAPI = require('kindred-api')

// var RIOT_API_KEY = require('whatever')
// or if you're using something like dotenv..
require('dotenv').config()
var RIOT_API_KEY = process.env.RIOT_API_KEY
var REGIONS = KindredAPI.REGIONS
var LIMITS = KindredAPI.LIMITS
var CACHE_TYPES = KindredAPI.CACHE_TYPES

/*
  Default region for every method call is NA,
  but you can set it during initialization as shown below.
  You can also change it with 'setRegion(region)' as well.
  To NOT use the built-in rate limiter, do NOT pass in anything
  into limits. Same if you don't want to use the cache (cacheOptions).
*/
var k = new KindredAPI.Kindred({
  key: RIOT_API_KEY,
  defaultRegion: REGIONS.NORTH_AMERICA,
  debug: true, // shows status code, urls, and relevant headers
  limits: [ [10, 10], [500, 600] ], // user key
  // 10 requests per 10 seconds, 500 requests per 10 minutes
  // You can just pass in LIMITS.DEV, LIMITS.PROD, 'dev', or 'prod' instead though.
  cacheOptions: CACHE_TYPES[0] // in memory
})

console.log(CACHE_TYPES)

// ['in-memory-cache', 'redis']

function rprint(err, data) { console.log(data) }

/*
  The important thing about this wrapper is that it does not
  take in parameters the usual way. Instead, the only parameter,
  excluding the callback parameter, is an object of parameters.
*/
k.Summoner.get({ id: 354959 }, rprint)
k.Summoner.name({ id: 354959 }, rprint)
k.Summoner.get({ id: 354959 }).then(data => console.log(data))

k.Match.get({ id: 2459973154, options: {
    includeTimeline: false
}}, rprint)

k.League.challengers({ region: 'na', options: {
  type: 'RANKED_FLEX_SR'
}}, rprint)

/*
  All functions essentially have the following form:

  functionName({ arg1, arg2... argN, options: {} }, optionalCallback) -> promise

  If a method does not have the `options` parameter within my code, that simply means
  there are no possible query parameters that you can pass in to that method.
*/

/*
  Making any form of parameter error will inform you
  what parameters you can pass in so you hopefully
  don't have to refer to the documentation as much.
*/
k.getSummoner(rprint)
// getSummoners request FAILED; required params `ids` (array of ints), `id` (int), `names` (array of strings), or `name` (string) not passed in
k.Summoner.get(rprint)
// same as above

k.getSummoner(rprint)
// getSummoner request FAILED; required params `id` (int) or `name` (string) not passed in

k.getTopChamps(rprint)
// getTopChamps request FAILED; required params `id` (int) or `playerID` (int) not passed in

k.getChampMastery(rprint)
// getChampMastery request FAILED; required params `playerID` (int) AND `championID` (int) not passed in
k.ChampionMastery.get(rprint)
// same as above

/*
  Notice the OR and the AND!!
  Note: getChampMastery is the only method that can't take in an 'id' parameter,
  because it requires both a 'playerID' and a 'championID'!
*/

/*
  Let me reiterate: the first parameter of all endpoint methods will ALWAYS be an object.
  However, when the parameters are satisfied by default parameters and/or
  only have optional parameters, you can simply pass your callback in.
*/
k.getChallengers(rprint) // default region, default solo queue mode, valid
k.League.challengers(rprint) // same as above

k.getRuneList(rprint) // only optional arguments & not passing in any optional arguments, valid
k.Static.runes(rprint)

/*
    I have recently added namespacing to the methods.

    All the namespaces are named after the official endpoint names (there
    are shorthand ones too).
*/
k.League.getChallengers(rprint)
k.League.challengers(rprint)
k.League.challengers()
        .then(data => console.log(data))
        .catch(err => console.error(err))

/*
  getSummoners & getSummoner target both the by-name and by-id endpoints.
  In the case of the summoner endpoints, it made a lot more sense for the two
  functions to target both the by-name and by-id summoner endpoints.

  The example above targets the by-name endpoint, while
  the example below targets the by-id endpoint.
*/

k.getSummoner({ id: 354959 }, rprint)
k.Summoner.getSummoner({ id: 354959 }, rprint)

/*
  The 'id', 'ids', 'name', and 'names' parameters
  stay consistent throughout the API but for the one
  exception above. However, I do have aliases for them.
  
  For example, for summoners, you have summonerID, summonerIDs,
  playerID, and playerIDs.

  Plural parameters can take in both arrays and singular values.
  Single parameters, however, can only take singular values.
*/
k.getSummoner({ summonerID: 354959 }, rprint)

k.getSummoner({ summonerID: 354959 })
 .then(json => console.log(json))
 .catch(err => console.log(err))

k.getSummoners({ summonerIDs: [354959, 21542029] }, rprint)

k.getMatch({ id: 2459973154 }, rprint)
k.getMatch({ matchID: 2459973154 }, rprint)
k.Match.get({ id: 2459973154 }, rprint)
k.Match.get({ id: 2459973154 })
       .then(data => console.log(data))
       .catch(err => console.error(err))

var names = ['beautifulkorean', 'c9gun', 'caaaaaaaaarIa']
k.Summoner.getAll({ names }, rprint) // getSummoners

var ids = [22059766, 20026563, 44989337]
k.Summoner.names({ ids }, rprint)

k.getSummoners({ names: 'caaaaaaaaaria' }, rprint)
k.getSummoners({ name: 'caaaaaaaaaria' }, rprint)

/* Every method has an optional 'region' parameter. */
var params = { name: 'sktt1peanut', region: REGIONS.KOREA }
k.getSummoner(params, rprint) // peanut's data

/* Changing the default region! */
k.setRegion(REGIONS.KOREA)

/* Note that you can use spaces in the name. */
var fakerIgn = { name: 'hide on bush' }
var fakerId
k.getSummoner(fakerIgn, function (err, data) {
  /*
    But you should sanitize the name if you want to access the dictionary.

    { hideonbush:
      { id: 4460427,
        name: 'Hide on bush',
        profileIconId: 6,
        revisionDate: 1490355284000,
        summonerLevel: 30 } }
  */
  fakerId = data[fakerIgn.name.replace(/\s/g, '').toLowerCase()].id
  console.log('fakerId:', fakerId)
}) // faker's data

/*
  Note that the player runes endpoint only accepts
  a comma-separated list of integers.
*/

k.setRegion(REGIONS.NORTH_AMERICA)

k.getRunes({ ids: [354959, 21542029] }, rprint)
k.getRunes({ id: 354959 }, rprint)
k.getRunes({ ids: 354959 }, rprint)

k.getRunes({ id: 354959 })
 .then(json => console.log(json))
 .catch(err => console.error(err))
k.Runes.get({ id: 354959 })
       .then(json => console.log(json))
       .catch(err => console.log(err))

/*
  But what if you want to quickly get the rune pages given
  that you have a list of names?

  You'd chain it like in many other clients:
  Get the ids from the names, get the runes from the ids.
*/
names = ['Richelle', 'Grigne']
k.getSummoners({ names }, function (err, data) {
  var ids = []

  for (var name of names)
    ids.push(data[name.replace(/\s/g, '').toLowerCase()].id)
  
  k.getRunes({ ids }, rprint)
})

/* I find that inconvenient, and so I just chain it for you in my code. */
// all methods that target endpoints that only accept ids
k.getRunes({ names: ['Richelle', 'Grigne'] }, rprint)
k.getRunes({ name: 'Richelle' }, rprint)
k.getRecentGames({ name: 'Richelle' }, rprint)
k.getLeagues({ names: ['Richelle', 'Grigne'] }, rprint)

k.getCurrentGame({ name: 'Fràe', region: REGIONS.OCEANIA }, rprint)
k.getLeagues({ names: ['Richelle', 'Grigne'] })
 .then(data => console.log(data))

var name = 'Grigne'
k.RunesMasteries.runes({ name })
                .then(data => console.log(data))
k.Runes.get({ name })
       .then(data => console.log(data))
k.Masteries.get({ name })
       .then(data => console.log(data))
/*
  Functions will have an options parameter that you can pass in query
  strings when applicable. Values of options should match the
  endpoint's 'Query Parameters'. Check the methods to see which methods
  you can pass in options to.

  Some are required, and some are not. I often take care of the ones
  that are required by using the most sensible defaults.

  For example, the required parameter for many methods is 'type' (of queue).
  I made it so that the default is 'RANKED_SOLO_5x5' (or 'TEAM_BUILDER_RANKED_SOLO')
  if 'type' is not passed in.
*/
k.getChallengers({ region: 'na' }, rprint) // get challengers from ranked solo queue ladder
k.getChallengers({ region: 'na', options: {
  type: 'RANKED_FLEX_SR'
}}, rprint) // get challengers from ranked flex ladder
k.Match.get({ id: 2459973154 }, rprint) // includes timeline by default
k.Match.get({ id: 2459973154, options: { includeTimeline: false } }, rprint)

/*
  However, for getMatchList, the endpoint uses an optional
  'rankedQueues' instead of 'type' to allow multiple options.
  I still set the default to RANKED_SOLO_5x5 though.
*/
var name = 'caaaaaaaaaria'
k.getSummoners({ region: 'na', names: name }, function (err, data) {
  if (data) {
    k.getMatchList({ region: 'na', id: data[name].id, options: {
      /*
        According to Riot API, query parameters that can accept multiple values
        must be a comma separated list (or a single value), which is why one can do the below join.

        However, both these options are inconvenient, and so I check if you pass in array values
        for every option parameter, and manually join it for you. You can still pass in string values
        if you want though.

        Note, for arrays of values that are conceptually integers,
        both strings and integers work because they're joined together as a string anyways.
      */
      // rankedQueues: ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'].join(','), STILL VALID
      // championIds: '67' // '267,67' or ['267', '67'].join(',') STILL VALID
      rankedQueues: ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'], // valid
      championIDs: [67, 62, '61'] // valid
    } }, rprint)
  }
})

/* The above example with promises. */
var name = 'caaaaaaaaaria'
var opts = {
  region: 'na',
  options: {
    rankedQueues: ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'],
    championIDs: '67'
  }
}

k.getSummoner({ name, region: opts.region })
  .then(data => k.getMatchList(
    Object.assign({ id: data[name].id }, opts)
  ))
  .then(data => console.log(data))
  .catch(err => console.err(error))

var furyMasteryId = 6111
k.getMastery({ id: furyMasteryId }, rprint)
k.Static.mastery({ id: furyMasteryId }, rprint)

var msRuneId = 10002
k.Static.rune({ id: msRuneId }, rprint)
```

## Caching

*April 2*
I have added caching support. Right now, the library supports in-memory caching as well as
caching with redis. These are the default timers that made sense to me.

``` javascript
const endpointCacheTimers = {
  // defaults
  CHAMPION: cacheTimers.MONTH,
  CHAMPION_MASTERY: cacheTimers.SIX_HOURS,
  CURRENT_GAME: cacheTimers.NONE,
  FEATURED_GAMES: cacheTimers.NONE,
  GAME: cacheTimers.HOUR,
  LEAGUE: cacheTimers.SIX_HOURS,
  STATIC: cacheTimers.MONTH,
  STATUS: cacheTimers.NONE,
  MATCH: cacheTimers.MONTH,
  MATCH_LIST: cacheTimers.ONE_HOUR,
  RUNES_MASTERIES: cacheTimers.WEEK,
  STATS: cacheTimers.HOUR,
  SUMMONER: cacheTimers.DAY
}
```

If you pass in cacheOptions, but not how long you want each type of request
to be cached (cacheTTL object), then by default you'll use the above timers.

To pass in your own custom timers, initialize Kindred like this:

``` javascript
import TIME_CONSTANTS from KindredAPI.TIME_CONSTANTS // for convenience, has a bunch of set timers in seconds

var k = new KindredAPI.Kindred({
  key: RIOT_API_KEY,
  defaultRegion: REGIONS.NORTH_AMERICA,
  debug: true, // you can see if you're retrieving from cache with lack of requests showing
  limits: [ [10, 10], [500, 600] ],
  cacheOptions: CACHE_TYPES[0], // in-memory
  cacheTTL: {
    // All values in SECONDS.
    CHAMPION: whatever,
    CHAMPION_MASTERY: whatever,
    CURRENT_GAME: whatever,
    FEATURED_GAMES: whatever,
    GAME: whatever,
    LEAGUE: whatever,
    STATIC: TIME_CONSTANTS.MONTH,
    STATUS: whatever,
    MATCH: whatever,
    MATCH_LIST: whatever,
    RUNES_MASTERIES: whatever,
    STATS: whatever,
    SUMMONER: TIME_CONSTANTS.DAY
  }
})
```

## Contributing and Issues

**Feel free to make a PR regarding anything (even the smallest typo or inconsistency).**

There are a few inconsistencies and weird things within this libary that I don't know how to address since this is my first API wrapper and I'm still quite a big newbie.

~~For example, the two methods getChamp() and getChampion() are actually different.~~

~~getChamp() targets the champ endpoint~~

~~getChampion() targets the static endpoint~~

~~I didn't want to attach getChampion() with 'static' in any way or form since I thought it looked kind of annoying because then I would want to attach static to the other static methods as well (maybe that's better?).~~

March 31: I decided to combat the above by just namespacing the functions
(k.Static.getChampion vs k.Champion.getChampion/get). The original functions are still usable though.

**Right now, the code is also quite messy and there is a lot of repeated code.** Function definitions are quite long because I include many aliases as well. I haven't thought of an elegant way to make a magic function that manages to work for every single endpoint request yet.

Any help and/or advice is appreciated!