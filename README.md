# Kindred

Kindred is a not-so-thin Node.js wrapper on top of [Riot Games API for League of Legends](http://www.developer.riotgames.com)

## Table of Contents
* [Philosophy](#philosophy)
* [Installation](#installation)
* [Quick Usage Examples](#quick-usage-examples)
* [Endpoints Covered](#endpoints-covered)
* [Full Documentation](#full-documentation)

## Philosophy
My goal is to make a wrapper that is convenient and sensible. This project is heavily inspired by [psuedonym117's Python wrapper](https://github.com/pseudonym117/Riot-Watcher). I want to make the API as consistent as possible and also make the rate-limiting as robust as possible. However, I also wish to provide users flexibility and a detailed errors system to make the wrapper as unobtrusive as possible. Look at the [Quick Usage Examples](#quick-usage-examples) to see what I mean.

For function methods, ```get``` implies a request.

## Installation

```
yarn add kindred-api
```

## Quick Usage Examples

```javascript
var Kindred = require('kindred-api')

// var RIOT_API_KEY = require('whatever')
// or if you're using something like dotenv..
require('dotenv').config()
var RIOT_API_KEY = process.env.RIOT_API_KEY
var REGIONS = require('regions')

/*
    Default region for every method call is NA,
    but you can set it during initialization as shown below.
*/
var k = Kindred(RIOT_API_KEY, regions.NORTH_AMERICA)

/*
  The first parameter of most methods will be an object.

  Note that getSummoners() can target a specific summoner.
  You can also use getSummoner(), though.
*/
function rprint(err, data) { console.log(data) }
k.getSummoners({ name: 'caaaaaaaaaria' }, rprint)
k.getSummoner({ name: 'caaaaaaaaaria' }, rprint)

/*
  getSummoners & getSummoner target many endpoints. In the case
  of the summoner endpoints, it made a lot more sense for the two
  functions to target both the by-name and by-id summoner endpoints.

  The example above targets the by-name endpoint, while
  the example below targets the by-id endpoint.
*/
k.getSummoner({ id: 32823699 }, rprint)

/*
  Note, I don't name the id parameter per endpoint.
  The 'id', 'ids', 'name', and 'names' parameters
  stay consistent throughout the API.
  (matchId, summonerId, runeId, etc).
*/
k.getMatch({ id: 2459973154 }, rprint)

/*
  When 'names' and/or 'ids' parameters are available, you
  can pass in an array.
*/
var names = ['beautifulkorean', 'c9gun', 'caaaaaaaaarIa']
k.getSummoners({ names: names }, rprint)

/*
  But I won't stop you from passing in a single string
  to the plural version of the parameter.
*/
k.getSummoners({ names: 'caaaaaaaaaria' }, rprint)

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
  What if an endpoint only accepts ids?

  ex: the player runes endpoint only accepts a comma-separated
      list of integers
*/

k.setRegion(REGIONS.NORTH_AMERICA)
// all valid
k.getRunes({ ids: [354959, 21542029] }, rprint)
k.getRunes({ id: 354959 }, rprint)
k.getRunes({ ids: 354959 }, rprint)
// but what if you're given a list of names instead of ids?
// You'd chain it like in many other clients.
var names2 = ['Richelle', 'Grigne']
k.getSummoners({ names: names2 }, function (err, data) {
  var args = []

  for (var name of names2)
    args.push(data[name.replace(/\s/g, '').toLowerCase()].id)
  
  k.getRunes({ ids: args }, rprint)
})

/*
  I find that inconvenient, and so I just chain it for you in my code.
  It will naturally send additional requests though.
  So now you can just do this:
*/
k.getRunes({ names: ['Richelle', 'Grigne'] }, rprint)
k.getRune({ name: ['Richelle'] }, rprint)
k.getRecentGames({ name: 'Richelle' }, rprint)
k.getLeagues({ names: ['Richelle', 'Grigne'] }, rprint)

/*
    Default ranked mode is 'RANKED_SOLO_5x5' for all
    methods naturally. This is all configurable though,
    and this pattern will stay constant
    throughout all my methods.
*/
k.setRegion(REGIONS.KOREA)
k.getRankedStats(fakerId, rprint)
k.setRegion(REGIONS.NORTH_AMERICA)
/*
  Functions will have an options parameter that you can pass in query
  strings when applicable. Values of options should match the
  endpoint's 'Query Parameters'. Check the methods to see which methods
  you can pass in options to.

  Some are required, and some are not. I often take care of the ones
  that are required by using the most sensible defaults.

  For example, the required parameter is 'type'.
  I made it so that the default is 'RANKED_SOLO_5x5' if 'type' is not passed
  in.

  The client will give off warnings if there are required parameters that you did
  not pass in though (that I can't take care of).
*/
k.getChallengers({ region: 'na' }, rprint) // get challengers from ranked solo queue ladder
k.getChallengers({ region: 'na', options: {
  type: 'RANKED_FLEX_SR'
}}, rprint) // get challengers from ranked flex ladder
k.getSummoner()
// getSummoner request FAILED; required parameters `name` (string) or `id` (int) not passed in
k.getMatch({ id: 2459973154 }, rprint) // includes timeline by default
k.getMatch({ id: 2459973154, options: { includeTimeline: false } }, rprint)
/*
  Note that the first parameter of most methods must always be an object.
  But for specific methods that only have optional parameters or arguments
  satisfied by defaults, we can skip that.
*/
k.getChallengers(rprint) // default region, default solo queue mode, valid
k.getRuneList(rprint) // not passing in any optional arguments, valid

/*
  However, for getMatchList, the endpoint uses an optional
  'rankedQueues' instead of 'type' to allow multiple options.
  I still set the default to RANKED_SOLO_5x5 though.
*/
var name = 'caaaaaaaaaria'
k.getSummoners({ region: 'na', names: name }, function (err, data) {
  k.getMatchList({ region: 'na', id: data[name].id, options: {
    /*
      According to Riot API, query parameters that can accept multiple values
      must be a comma separated list (or a single value), which is why I do the above 'join'.

      You can also simply do 'RANKED_SOLO_5x5, RANKED_FLEX_SR'.
    */
    rankedQueues: ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'].join(),
    championIds: '67' // '267,67' or ['267', '67'].join(',')
  } }, rprint)
})

var furyMasteryId = 6111
k.getMastery({ id: furyMasteryId }, rprint)

var msRuneId = 10002
k.getRune({ id: msRuneId }, rprint)
```

## Endpoints Covered
Make sure to check the [official Riot Documentation](https://developer.riotgames.com/api-methods/) to see what query parameters you can pass in
to each endpoint!

### CHAMPION-V1.2
[docs](https://developer.riotgames.com/api-methods/#champion-v1.2)

| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /api/lol/{region}/v1.2/champion | Retrieve all champions. (REST) | no |
| GET | /api/lol/{region}/v1.2/champion/{id} | Retrieve champion by ID. (REST) | no |

### CHAMPIONMASTERY
[docs](https://developer.riotgames.com/api-methods/#championmastery)

### CURRENT-GAME-V1.0
[docs](https://developer.riotgames.com/api-methods/#current-game-v1.0)

| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /observer-mode/rest/consumer/getSpectatorGameInfo/{platformId}/{summonerId} | Get current game information for the given summoner ID. (REST) | yes |

### FEATURED-GAMES-V1.0
[docs](https://developer.riotgames.com/api-methods/#featured-games-v1.0)

| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /observer-mode/rest/featured | Get list of featured games. (REST) | yes |

### GAME-V1.3
[docs](https://developer.riotgames.com/api-methods/#game-v1.3)

| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /api/lol/{region}/v1.3/game/by-summoner/{summonerId}/recent | Get recent games by summoner ID. (REST) | yes |

### LEAGUE-V2.5
[docs](https://developer.riotgames.com/api-methods/#league-v2.5)

| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /api/lol/{region}/v2.5/league/by-summoner/{summonerIds} | Get leagues mapped by summoner ID for a given list of summoner IDs. (REST) | yes |
| GET | /api/lol/{region}/v2.5/league/by-summoner/{summonerIds}/entry | Get league entries mapped by summoner ID for a given list of summoner IDs. (REST) | yes |
| GET | /api/lol/{region}/v2.5/league/challenger | Get challenger tier leagues. (REST) | yes |
| GET | /api/lol/{region}/v2.5/league/master | Get master tier leagues. (REST) | yes |

### LOL-STATIC-DATA-V1.2
[docs](https://developer.riotgames.com/api-methods/#lol-static-data-v1.2)

| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /api/lol/static-data/{region}/v1.2/champion | Retrieves champion list. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/champion/{id} | Retrieves a champion by its id. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/item | Retrieves item list. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/item/{id} | Retrieves item by its unique id. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/language-strings | Retrieve language strings data. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/languages | Retrieve supported languages data. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/map | Retrieve map data. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/mastery | Retrieve mastery list. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/mastery/{id} | Retrieves mastery item by its unique id. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/realm | Retrieve realm data. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/rune | Retrieves rune list. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/rune/{id} | Retrieves rune by its unique id. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/summoner-spell | Retrieves summoner spell list. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/summoner-spell/{id} | Retrieves summoner spell by its unique id. (REST) | yes |
| GET | /api/lol/static-data/{region}/v1.2/versions | Retrieve version data. (REST) | yes |

### LOL-STATUS-V1.0
[docs](https://developer.riotgames.com/api-methods/#lol-status-v1.0)

| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /lol/status/v1/shard | Get shard status. Returns the data available on the status.leagueoflegends.com website for the given region. (REST) | yes |
| GET | /lol/status/v1/shards | Get shard list. (REST) | yes |

### MATCH-V.2.2
[docs](https://developer.riotgames.com/api-methods/#match-v2.2)

| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /api/lol/{region}/v2.2/match/{matchId} | Retrieve match by match ID. (REST) | yes |

### MATCHLIST-V2.2
[docs](https://developer.riotgames.com/api-methods/#matchlist-v2.2)

| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /api/lol/{region}/v2.2/matchlist/by-summoner/{summonerId} | Retrieve match list by match ID. (REST) | yes |

### RUNES-MASTERIES-V1.4
[docs](https://developer.riotgames.com/api-methods/#runes-masteries-v1.4)

| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /api/lol/{region}/v1.4/summoner/{summonerIds}/masteries | Get mastery pages mapped by summoner ID for a given list of summoner IDs. (REST) | no |
| GET | /api/lol/{region}/v1.4/summoner/{summonerIds}/runes | Get rune pages mapped by summoner ID for a given list of summoner IDs. (REST) | no |

### STATS-V1.3
[docs](https://developer.riotgames.com/api-methods/#stats-v1.3)

| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /api/lol/{region}/v1.3/stats/by-summoner/{summonerId}/ranked | Get ranked stats by summoner ID. (REST) | yes |
| GET | /api/lol/{region}/v1.3/stats/by-summoner/{summonerId}/summary | Get player stats summaries by summoner ID. (REST) | no |

### SUMMONER-V1.4
[docs](https://developer.riotgames.com/api-methods/#summoner-v1.4)

| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /api/lol/{region}/v1.4/summoner/by-account/{accountIds} | Get a list of summoners by account ids (RPC). | no |
| GET | /api/lol/{region}/v1.4/summoner/by-name/{summonerNames} | Get a list of summoners by summoner names. (RPC) | yes |
| GET | /api/lol/{region}/v1.4/summoner/{summonerIds} | Get a list of summoners by summoner IDs. (RPC) | yes |
| GET | /api/lol/{region}/v1.4/summoner/{summonerIds}/name | Get summoner names mapped by summoner ID for a given list of summoner IDs. (REST) | yes |

## Full Documentation