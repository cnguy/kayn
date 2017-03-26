# Kindred

Kindred is a thin Node.js wrapper on top of [Riot Games API for League of Legends](http://www.developer.riotgames.com)

## Table of Contents
* [Philosophy](#philosophy)
* [Endpoints Covered](#endpoints-covered)
* [Installation](#installation)
* [Quick Usage Examples](#quick-usage-examples)
* [Full Documentation](#full-documentation)

## Philosophy
My goal is to make a wrapper that is convenient and sensisible. This project is heavily inspired by [psuedonym117's Python wrapper](https://github.com/pseudonym117/Riot-Watcher). My goal is to make the API as consistent as possible and also make the rate-limiting as robust as possible.

For function methods, ```get``` implies a request.

## Endpoints Covered
### LOL-STATIC-DATA-V1.2
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

### STATS-V1.3
| Type | Endpoint | Description | Covered |
| -------- | -------- | ----------- | ------- |
| GET | /api/lol/{region}/v1.3/stats/by-summoner/{summonerId}/ranked | Get ranked stats by summoner ID. (REST) | yes |
| GET | /api/lol/{region}/v1.3/stats/by-summoner/{summonerId}/summary | Get player stats summaries by summoner ID. (REST) | no |

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
function printDataFn(err, data) { console.log(data) }
var me = k.getSummoners({ name: 'caaaaaaaaaria' }, printDataFn)
var otherMe = k.getSummoner({ name: 'caaaaaaaaaria' }, printDataFn)

/*
  When 'names' and/or 'ids' parameters are available, you
  can pass in an array.
*/
var names = ['beautifulkorean', 'c9gun', 'caaaaaaaaarIa']
var players = k.getSummoners({ names: names }, printDataFn)

/*
  But I won't stop you from passing in a single string
  to the plural version of the parameter.
*/
var me2 = k.getSummoners({ names: 'caaaaaaaaaria' }, printDataFn)

/* Every method has an optional region parameter. */
var options = { name: 'sktt1peanut', region: REGIONS.KOREA }
var p1 = k.getSummoner(options, printDataFn) // peanut's data

/* Changing the default region! */
k.setRegion(REGIONS.KOREA)

/* Note that you can use spaces in the name. */
var fakerIgn = { name: 'hide on bush' }
var p2 = k.getSummoner(fakerIgn, printDataFn) // faker's data
var fakerId = { id: p2[fakerIgn.name]['id'] }

/*
    Default ranked mode is 'RANKED_SOLO_5x5' for all
    methods naturally. This is all configurable though,
    and this pattern will stay constant
    throughout all my methods.
*/
var fakerStats = k.getRankedStats(fakerId, printDataFn)

/*
  Functions will have an options parameter that you can pass in query
  strings when applicable. Values of options should match the
  endpoint's 'Query Parameters'. Check the methods to see which methods
  you can pass in options to.

  Some are required, and some are not. I often take care of the ones
  that are required.

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
k.getSummoner() // getSummoner request FAILED; required parameters name or id not passed in

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
    rankedQueues: ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'].join(), // multiples must be in an array that is joined
    championIds: '67' // '267,67' or ['267', '67'].join(',')
  } }, rprint)
})

/*
  According to Riot API, any query parameter must be a comma separated list (or a single value),
  which is why I do the above 'join'.

  You can also simply do 'RANKED_SOLO_5x5, RANKED_FLEX_SR'.
*/

var furyMasteryId = 6111
k.getMastery({ id: furyMasteryId }, rprint)

var msRuneId = 10002
k.getRune({ id: msRuneId }, rprint)
```

## Full Documentation