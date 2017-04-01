# Kindred

Kindred is a thin Node.js wrapper (with an optional rate limiter) on top of [Riot Games API for League of Legends](http://www.developer.riotgames.com).

## Table of Contents
* [Core Features](#core-features)
* [Philosophy](#philosophy)
* [Installation](#installation)
* [Endpoints Covered](#endpoints-covered)
* [Usage](#usage)
* [Contributing and Issues](#contributing-and-issues)

## Core Features
* All endpoints covered but one (get summoner by accountIDs).
* Basic rate-limiting that is enforced per region.
    * Retries on 429 and >= 500 (should it just be 500?).
        * Promise-based requests retry up to three times.
        * Callback-based requests are infinite at the moment.
* Tells you what parameters you can pass in when you make a parameter-related error.

Hopefully there aren't *too* many bugs! ***I'm a noob after all, so use this library at your own risk.*** I'm currently focusing on refactoring the code now. The docs are not fully updated yet.

## Philosophy
My goal is to make a wrapper that is simple, sensible, and consistent. This project is heavily inspired by [psuedonym117's Python wrapper](https://github.com/pseudonym117/Riot-Watcher). Look at the [Usage Section](#usage) to see what I mean.

This is my first try at making an API wrapper. I am open to any advice and help!

***March 28, 2017***

**I'm pretty proud of the end result. The rate limiting isn't the best, but it does work and is enforced per region! Also, the method names are kinda iffy (minor inconsistencies), but it works really well for my other project and for when I need a quick script. I'll try to improve this library over the next few weeks.**

## Installation
```
yarn add kindred-api
// or npm install kindred-api
```

## Endpoints Covered
Make sure to check the [official Riot Documentation](https://developer.riotgames.com/api-methods/) to see what query parameters you can pass in to each endpoint (through the options parameter)!

Note: All ```region``` parameters are **OPTIONAL**. All ```options``` parameters are **OPTIONAL** unless stated otherwise.

* [CHAMPION-V1.2](#champion)
* [CHAMPIONMASTERY](#champion-mastery)
* [CURRENT-GAME-V1.0](#current-game)
* [FEATURED-GAMES-V1.0](#featured-games)
* [GAME-V1.3](#game)
* [LEAGUE-V2.5](#league)
* [LOL-STATIC-DATA-V1.2](#lol-static-data)
* [LOL-STATUS-V1.0](#lol-status)
* [MATCH-V.2.2](#match)
* [MATCHLIST-V2.2](#matchlist)
* [RUNES-MASTERIES-V1.4](#runes-masteries)
* [STATS-V1.3](#stats)
* [SUMMONER-V1.4](#summoner)

### Champion
[docs](https://developer.riotgames.com/api-methods/#champion-v1.2)

1. **/api/lol/{region}/v1.2/champion**
    * Retrieve all champions. (REST)
    * getChamps({ region, id (int), options (object) }, cb)
    * Namespaced Functions: *Champion.getChampions, Champion.getAll, Champion.all*
    * Example 1: ```k.Champion.getAll({ region: REGIONS.KOREA }, rprint)```
2. **/api/lol/{region}/v1.2/champion/{id}**
    * Retrieve champion by ID. (REST)
    * getChamp({ region, id/championID (int) }, cb)
    * Namespaced Functions: *Champion.getChampion, Champion.get*
    * Example 1: ```k.Champion.get({ championID: 67 }, rprint)```
    * Example 2: ```k.Champion.get({ championID: 67 }).then(data => console.log(data))```
    * Example 3: ```k.Champion.get({ championID: 67, region: 'kr' }, rprint)```

### Champion Mastery
[docs](https://developer.riotgames.com/api-methods/#championmastery)

1. **/championmastery/location/{location}/player/{playerId}/champion/{championId}**
    * Get a champion mastery by player id and champion id. Response code 204 means there were no masteries found for given player id or player id and champion id combination. (RPC)
    * getChampMastery({ region = this.defaultRegion, playerID (int), championID (int), options (object) }, cb)
    * Namespaced Functions: *ChampionMastery.getChampionMastery, ChampionMastery.get*
    * Example 1: ```k.ChampionMastery.get({ playerID: 20026563, championID: 203 }, rprint)```
    * Example 2: ```k.ChampionMastery.get({ playerID: 20026563, championID: 203 }).then(data => console.log(data))```
2. **/championmastery/location/{location}/player/{playerId}/champions**
    * Get all champion mastery entries sorted by number of champion points descending. (RPC)
    * getChampMasteries({ region = this.defaultRegion, id/summonerID/playerID (int), name (string), options (object) }, cb)
    * Namespaced Functions: *ChampionMastery.getChampionMasteries, ChampionMastery.getAll, ChampionMastery.all*
    * Example 1: ```k.ChampionMastery.getChampionMasteries({ id: 20026563 }, rprint)```
    * Example 2: ```k.ChampionMastery.getAll({ id: 20026563 }).then(data => console.log(data))```
3. **/championmastery/location/{location}/player/{playerId}/score**
    * Get a player's total champion mastery score, which is sum of individual champion mastery levels. (RPC)
    * getTotalChampMasteryScore({ region = this.defaultRegion, id/summonerID/playerID (int), name (string), options (object) }, cb)
    * Namespaced Functions: *ChampionMastery.getTotalChampMasteryScore, ChampionMastery.getTotalScore, ChampionMastery.totalScore, ChampionMastery.total*
    * Example 1: ```k.ChampionMastery.totalScore({ id: 20026563 }, rprint)```
4. **/championmastery/location/{location}/player/{playerId}/topchampions**
    * Get specified number of top champion mastery entries sorted by number of champion points descending. (RPC) 
    * getTopChamps({ region = this.defaultRegion, id/summonerID/playerID (int), name (string), options (object) }, cb)
    * Namespaced Functions: *ChampionMastery.getTopChampions, ChampionMastery.top, ChampionMastery.best*
    * Example 1: ```k.ChampionMastery.best({ id: 20026563 }, rprint)```

### Current Game
[docs](https://developer.riotgames.com/api-methods/#current-game-v1.0)

1. **/observer-mode/rest/consumer/getSpectatorGameInfo/{platformId}/{summonerId}**
    * Get current game information for the given summoner ID. (REST)
    * getCurrentGame({ region = this.defaultRegion, id/summonerID/playerID (int), name (str) }, cb)
    * Namespaced Functions: *CurrentGame.getCurrentGame, CurrentGame.get*
    * Example 1: ```k.CurrentGame.get({ name: 'Contractz' }, rprint)```

### Featured Games
[docs](https://developer.riotgames.com/api-methods/#featured-games-v1.0)

1. **/observer-mode/rest/featured**
    * Get list of featured games. (REST)
    * getFeaturedGames({ region }, cb)
    * Namespaced Functions: *FeaturedGames.getFeaturedGames, FeaturedGames.get*
    * Example 1: ```k.FeaturedGames.getFeaturedGames(rprint)```
    * Example 2: ```k.FeaturedGames.get().then(data => console.log(data))```
    * Example 3: ```k.FeaturedGames.get({ region: 'na' }, rprint)```
    
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
    * getLeagues({ region, ids/summonerIDs/playerIDs ([int]/int), id/summonerID/player/ID (int), names ([str]/str), name (str) }, cb)
    * Namespaced Functions: *League.getLeagues, League.get*
    * Example 1: ```k.League.getLeagues({ summonerID: 20026563 }, rprint)```
    * Example 2: ```k.League.get({ summonerID: 20026563 }, rprint)```
2. **/api/lol/{region}/v2.5/league/by-summoner/{summonerIds}/entry**
    * Get league entries mapped by summoner ID for a given list of summoner IDs. (REST)
    * getLeagueEntries({ region, ids/summonerIDs/playerIDs ([int]/int), id/summonerID/playerID (int), names ([str]/str), name (str) }, cb)
    * Namespaced Functions: *League.getLeagueEntries, League.getEntries, League.entries*
    * Example 1: ```k.League.getEntries({ summonerID: 20026563 }, rprint)```
3. **/api/lol/{region}/v2.5/league/challenger**
    * Get challenger tier leagues. (REST)
    * getChallengers({ region, options = { type: 'RANKED_SOLO_5x5' } }, cb)
    * Namespaced Functions: *League.getChallengers, League.challengers*
    * Example 1: ```k.League.challengers(rprint)```
    * Example 2: ```k.League.challengers({ region: 'na' }, rprint)```
4. **/api/lol/{region}/v2.5/league/master**
    * Get master tier leagues. (REST)
    * getMasters({ region, options = { type: 'RANKED_SOLO_5x5' } }, cb)
    * Namespaced Functions: *League.getMasters, League.masters*
    * Example 1: ```k.League.masters().then(data => console.log(data))```

### LoL Static Data
[docs](https://developer.riotgames.com/api-methods/#lol-static-data-v1.2)

1. **/api/lol/static-data/{region}/v1.2/champion**
    * Retrieves champion list. (REST)
    * getChampionList({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getChampions, Static.champions*
2. **/api/lol/static-data/{region}/v1.2/champion/{id}**
    * Retrieves a champion by its id. (REST)
    * getChampion({ region, id/championID (int), options (object) }, cb)
    * Namespaced Functions: *Static.getChampion, Static.champion*
3. **/api/lol/static-data/{region}/v1.2/item**
    * Retrieves item list. (REST)
    * getItems({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getItems, Static.items*
4. **/api/lol/static-data/{region}/v1.2/item/{id}**
    * Get master tier leagues. (REST)
    * getItem({ region, id/itemID (int), options (object) }, cb)
    * Namespaced Functions: *Static.getItem, Static.item*
5. **/api/lol/static-data/{region}/v1.2/language-strings**
    * Retrieve language strings data. (REST)
    * getLanguageStrings({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getLanguageStrings, Static.languageStrings*
6. **/api/lol/static-data/{region}/v1.2/languages**
    * Retrieve supported languages data. (REST)
    * getLanguages({ region }, cb)
    * Namespaced Functions: *Static.getLanguages, Static.languages*
7. **/api/lol/static-data/{region}/v1.2/map**
    * Retrieve map data. (REST)
    * getMap({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getMap, Static.map*
8. **/api/lol/static-data/{region}/v1.2/mastery**
    * Retrieve mastery list. (REST)
    * getMasteryList({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getMasteries, Static.masteries*
9. **/api/lol/static-data/{region}/v1.2/mastery/{id}**
    * Retrieves mastery item by its unique id. (REST)
    * getMastery({ region, id/masteryID (int), options (object) }, cb)
    * Namespaced Functions: *Static.getMastery, Static.mastery*
10. **/api/lol/static-data/{region}/v1.2/realm**
    * Retrieve realm data. (REST)
    * getRealmData({ region }, cb)
    * Namespaced Functions: *Static.getRealmData, Static.realmData, Static.realm, Static.realms*
11. **/api/lol/static-data/{region}/v1.2/rune**
    * Retrieves rune list. (REST)
    * getRuneList({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getRunes, Static.runes*
12. **/api/lol/static-data/{region}/v1.2/rune/{id}**
    * Retrieves rune by its unique id. (REST)
    * getRune({ region, id/runeID (int), options (object) }, cb)
    * Namespaced Functions: *Static.getRune, Static.rune*
13. **/api/lol/static-data/{region}/v1.2/summoner-spell**
    * Retrieves summoner spell list. (REST)
    * getSummonerSpells({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getSummonerSpells, Static.summonerSpells, Static.spells*
14. **/api/lol/static-data/{region}/v1.2/summoner-spell/{id}**
    * Retrieves summoner spell by its unique id. (REST)
    * getSummonerSpell({ region, id/spellID/summonerSpellID (int), options (object) }, cb)
    * Namespaced Functions: *Static.getSummonerSpell, Static.summonerSpell, Static.spell*
15. **/api/lol/static-data/{region}/v1.2/versions**
    * Retrieve version data. (REST)
    * getVersionData({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getVersionData, Static.versionData, Static.version, Static.versions*

### LoL Status
[docs](https://developer.riotgames.com/api-methods/#lol-status-v1.0)

1. **/lol/status/v1/shard**
    * Get shard status. Returns the data available on the status.leagueoflegends.com website for the given region. (REST)
    * getShardStatus({ region }, cb)
    * Namespaced Functions: *Status.getShardStatus, Status.getStatus, Status.get*
    * Example 1: ```k.Status.get().then(data => console.log(data))```
2. **/lol/status/v1/shards**
    * Get shard list. (REST)
    * getShardList({ region }, cb)
    * Namepsaced Functions: *Status.getShardList, Status.getShards, Status.getAll, Status.all*
    * Example 1: ```k.Status.all().then(data => console.log(data))```

### Match
[docs](https://developer.riotgames.com/api-methods/#match-v2.2)

1. **/api/lol/{region}/v2.2/match/{matchId}**
    * Retrieve match by match ID. (REST)
    * getMatch({ region, id/matchID (int), options = { includeTimeline: true } }, cb) 
    * Namespaced Functions: *Match.getMatch, Match.get*
    * Example 1: ```k.Match.get({ id: 1912829920 }, rprint)```

### MatchList
[docs](https://developer.riotgames.com/api-methods/#matchlist-v2.2)

1. **/api/lol/{region}/v2.2/matchlist/by-summoner/{summonerId}**
    * Retrieve match list by match ID. (REST)
    * getMatchList({ region, id/summonerID/playerID (int), name (str), options = { rankedQueues: 'RANKED_SOLO_5x5' } }, cb)
    * Namespaced Functions: *MatchList.getMatchList, MatchList.get*
    * Example 1: ```k.MatchList.get({ id: 20026563 }, rprint)```

### Runes Masteries
[docs](https://developer.riotgames.com/api-methods/#runes-masteries-v1.4)

1. **/api/lol/{region}/v1.4/summoner/{summonerIds}/masteries**
    * Get mastery pages mapped by summoner ID for a given list of summoner IDs. (REST)
    * getMasteries({ region, ids/summonerIDs/playerIDs ([int]/int), id/summonerID/playerID (int), names ([str]/str), name (str)}, cb)
    * Namespaced Functions: *RunesMasteries.getRunes, RunesMasteries.runes*
    * Example 1: ```k.RunesMasteries.runes({ id: 20026563 }, rprint)```
2. **/api/lol/{region}/v1.4/summoner/{summonerIds}/runes**
    * Retrieve match list by match ID. (REST)
    * getRunes({ region, ids/summonerIDs/playerIDs ([int]/int), id/summonerID/playerID (int), names ([str]/str), name (str) }, cb)
    * Namespaced Functions: *RunesMasteries.getMasteries, RunesMasteries.masteriesi*
    * Example 1: ```k.RunesMasteries.masteries({ id: 20026563 }, rprint)```

### Stats
[docs](https://developer.riotgames.com/api-methods/#stats-v1.3)

1. **/api/lol/{region}/v1.3/stats/by-summoner/{summonerId}/ranked**
    * Get ranked stats by summoner ID. (REST)
    * getRankedStats({ region, id/summonerID/playerID (int), name (str), options (object) }, cb)
    * Namespaced Functions: *Stats.getRankedStats, Stats.ranked*
    * Example 1: ```k.Stats.ranked({ id: 20026563 }, rprint)```
2. **/api/lol/{region}/v1.3/stats/by-summoner/{summonerId}/summary**
    * Get player stats summaries by summoner ID. (REST)
    * getStatsSummary({ region, id/summonerID/playerID (int), name (str), options (object) }, cb)
    * Namespaced Functions: *Stats.getStatsSummary, Stats.summary*
    * Example 1: ```k.Stats.summary({ id: 20026563 }, rprint)```

### Summoner
[docs](https://developer.riotgames.com/api-methods/#summoner-v1.4)

1. **/api/lol/{region}/v1.4/summoner/by-account/{accountIds}**
    * Get a list of summoners by account ids (RPC).
    * N/A
2. **/api/lol/{region}/v1.4/summoner/by-name/{summonerNames}**
    * Get a list of summoners by summoner names. (RPC)
    * getSummoners({ region, ids/summonerIDs/playerIDs ([int]/int), id (int), names ([str]/ str), name (str) }, cb)
    * getSummoner({ region, id (int), name (str) }, cb)
    * Namespaced Functions: *Summoner.getSummoners, Summoner.getAll, Summoner.all, Summoner.getSummoner, Summoner.get*
    * Example 1: ```k.Summoner.get({ name: 'caaaaaaaaarIa' }, rprint)```
    * Example 2: ```k.Summoner.all({ names: ['caaaaaaaaarIa', 'Contractz'] }, rprint)```
3. **/api/lol/{region}/v1.4/summoner/{summonerIds}**
    * Get challenger tier leagues. (REST)
    * getSummoners({ region, ids/summonerIDs/playerIDs ([int]/int), id (int), names ([str]/ str), name (str) }, cb)
    * getSummoner({ region, id (int), name (str) }, cb)
    * Namespaced Functions: *Summoner.getSummoners, Summoner.getAll, Summoner.all, Summoner.getSummoner, Summoner.get*
    * Example 1: ```k.Summoner.get({ id: 20026563 }, rprint)```
    * Example 2: ```k.Summoner.getAll({ ids: [20026563, 32932398] }, rprint)```
4. **/api/lol/{region}/v1.4/summoner/{summonerIds}/name**
    * Get master tier leagues. (REST)
    * getSummonerNames({ region, ids/summonerIDs/playerIDs ([int]/int), id/summonerID/playerID (int) }, cb)
    * getSummonerName({ region, id/summonerID/playerID (int) }, cb)
    * Namespaced Functions: *Summoner.getSummonerNames, Summoner.getNames, Summoner.names, Summoner.getSummonerName, Summoner.getName, Summoner.name*
    * Example 1: ```k.Summoner.names({ ids: [20026563, 32932398] }, rprint)```

## Usage

```javascript
var KindredAPI = require('kindred-api')

// var RIOT_API_KEY = require('whatever')
// or if you're using something like dotenv..
require('dotenv').config()
var RIOT_API_KEY = process.env.RIOT_API_KEY
var REGIONS = KindredAPI.REGIONS

/*
  Default region for every method call is NA,
  but you can set it during initialization as shown below.
  You can also change it with 'setRegion(region)' as well.
  To NOT use the built-in rate limiter, do NOT pass in anything
  into limits.
*/
var k = new KindredAPI.Kindred({
  key: RIOT_API_KEY,
  defaultRegion: REGIONS.NORTH_AMERICA,
  debug: true, // shows status code, urls, and relevant headers
  limits: [ [10, 10], [500, 600] ] // user key
  // 10 requests per 10 seconds, 500 requests per 10 minutes

  // You can just pass in 'dev' or 'prod' instead though.
})

function rprint(err, data) { console.log(data) }

/*
  NOTE: Making any form of parameter error will inform you
  what parameters you can pass in!
*/
k.getSummoner(rprint)
// getSummoners request FAILED; required params `ids` (array of ints), `id` (int), `names` (array of strings), or `name` (string) not passed in

k.getSummoner(rprint)
// getSummoner request FAILED; required params `id` (int) or `name` (string) not passed in

k.getTopChamps(rprint)
// getTopChamps request FAILED; required params `id` (int) or `playerID` (int) not passed in

k.getChampMastery(rprint)
// getChampMastery request FAILED; required params `playerID` (int) AND `championID` (int) not passed in

/*
  Notice the OR and the AND!!
  Note: getChampMastery is the only method that can't take in an 'id' parameter,
  because it requires both a 'playerID' and a 'championID'!
*/

/*
  The first parameter of all endpoint methods will ALWAYS be an object.
  However, when the parameters are satisfied by default parameters and/or
  only have optional parameters, you can simply pass your callback in.
*/
k.getChallengers(rprint) // default region, default solo queue mode, valid
k.getRuneList(rprint) // only optional arguments & not passing in any optional arguments, valid

/*
    I have recently added namespacing to the methods.
    You can check out all the namespaces and the aliases in the code
    since I didn't mention them in the endpoints-covered
    section yet.

    All the namespaces are named after the official names Riot have given them.
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
k.Summoner.get({ id: 354959 }, rprint)
k.Summoner.get({ id: 354959 })
          .then(data => console.log(data))
          .catch(err => console.error(err))

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
var options = { name: 'sktt1peanut', region: REGIONS.KOREA }
k.getSummoner(options, rprint) // peanut's data

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

/*
  But what if you want to quickly get the rune pages given
  that you have a list of names?

  You'd chain it like in many other clients:
  Get the ids from the names, get the runes from the ids.
*/
var names2 = ['Richelle', 'Grigne']
k.getSummoners({ names: names2 }, function (err, data) {
  var args = []

  for (var name of names2)
    args.push(data[name.replace(/\s/g, '').toLowerCase()].id)
  
  k.getRunes({ ids: args }, rprint)
})

/* I find that inconvenient, and so I just chain it for you in my code. */
// all methods that target endpoints that only accept ids
k.getRunes({ names: ['Richelle', 'Grigne'] }, rprint)
k.getRunes({ name: 'Richelle' }, rprint)
k.getRecentGames({ name: 'Richelle' }, rprint)
k.getLeagues({ names: ['Richelle', 'Grigne'] }, rprint)
/* Note: I handle that platform id stuffs. */
k.getCurrentGame({ name: 'Fràe', region: REGIONS.OCEANIA }, rprint)

/*
    WARNING: Currently promises are bugged for these type of chained requests
    since I don't fully understand them yet. You'll have to chain for promises
    still.
*/
var ctzName = 'contractz'
k.getSummoner({ name: ctzName })
 .then(json => k.getMasteries({ id: json[ctzName].id }))
 .then(json => console.log(json))

/*
  Functions will have an options parameter that you can pass in query
  strings when applicable. Values of options should match the
  endpoint's 'Query Parameters'. Check the methods to see which methods
  you can pass in options to.

  Some are required, and some are not. I often take care of the ones
  that are required by using the most sensible defaults.

  For example, the required parameter for many methods is 'type' (of queue).
  I made it so that the default is 'RANKED_SOLO_5x5' if 'type' is not passed
  in.
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
        must be a comma separated list (or a single value), which is why I do the above 'join'.

        You can also simply do 'RANKED_SOLO_5x5, RANKED_FLEX_SR'.
      */
      rankedQueues: ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'].join(),
      championIds: '67' // '267,67' or ['267', '67'].join(',')
    } }, rprint)
  }
})

var furyMasteryId = 6111
k.getMastery({ id: furyMasteryId }, rprint)
k.Static.getMastery({ id: furyMasteryId }, rprint)

var msRuneId = 10002
k.Static.getRune({ id: msRuneId }, rprint)
```

## Contributing and Issues

**Feel free to make a PR regarding anything (even the smallest typo or inconsistency).**

There are a few inconsistencies and weird things within this libary that I don't know how to address since this is my first API wrapper and I'm still quite a big newbie.

~~For example, the two methods getChamp() and getChampion() are actually different.~~

~~getChamp() targets the champ endpoint~~

~~getChampion() targets the static endpoint~~

~~I didn't want to attach getChampion() with 'static' in any way or form since I thought it looked kind of annoying because then I would want to attach static to the other static methods as well (maybe that's better?).~~

March 31: I decided to combat the above by just namespacing the functions
(k.Static.getChampion vs k.Champion.getChampion/get).

**Right now, the code is also quite messy and there is a lot of repeated code.** Function definitions are quite long because I include many aliases as well. I haven't thought of an elegant way to make a magic function that manages to work for every single endpoint request yet.

Any help and/or advice is appreciated!