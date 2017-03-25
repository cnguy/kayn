### Kindred

Kindred is a thin Node.js wrapper on top of [Riot Games API for League of Legends](developer.riotgames.com).

### Philosophy

My goal is to make a wrapper that is convenient and sensisible. This project is heavily inspired by [psuedonym117's Python wrapper](https://github.com/pseudonym117/Riot-Watcher). My goal is to make the rate-limiting as robust as possible.

For function methods, ```get``` implies a request.
### Installation

```
yarn add kindred-api
```

### Quick Usage Examples

```javascript
var k = require('kindred-api')

// var RIOT_API_KEY = require('whatever')
// or if you're using something like dotenv..
require('dotenv').config()
var RIOT_API_KEY = process.env.RIOT_API_KEY
var REGIONS = require('regions')

/*
    Default region is NA, but you can set it
    during initialization as shown below.
*/

k = kindred(RIOT_API_KEY, regions.NORTH_AMERICA)

/*
  All methods naturally have a callback parameter.
*/

function printDataFn(err, data) {
  console.log(data)
}

/* The names parameter can take a singular string. */
me = k.getSummoners({ names: 'caaaaaaaaaria' }, printDataFn)

/*
    {
        "caaaaaaaaaria": {
            "summonerLevel": 30,
            "profileIconId": 7,
            "revisionDate": 1490256623000,
            "id": 20026563,
            "name": "caaaaaaaaarIa"
        }
    }
*/

/* Or even an array of strings. */
var names = ['beautifulkorean', 'c9gun', 'caaaaaaaaarIa']
var players = k.getSummoners({ names: names }, printDataFn)

/*
  This is to simply make a more convenient API. I don't want
  to think about whether I need an 's' at the end or not,
  and whether I need an array or a string.
*/

/* Targeting a specific region instead of the default region. */
var options = {
  names: 'sktt1peanut',
  region: REGIONS.KOREA
}

var p1 = k.getSummoners(options, printDataFn) // peanut's data

k.setRegion(REGIONS.KOREA) // Change default region

/* Note that you can use spaces in the name. */
var fakerIgn = { names: 'hide no bush' }
var p2 = k.getSummoners(fakerIgn, printDataFn) // faker's data

var fakerOptions = {
  players: p2[fakerIgn.names]['id'],
  region: REGIONS.NORTH_AMERICA
}
/*
    Default ranked mode is 'RANKED_SOLO_5x5' for all
    methods naturally. This is all configurable though,
    and this pattern will stay constant
    throughout all my methods.
*/
var fakerStats = k.getRankedStats(fakerOptions, printDataFn)

/*
  Functions will have an options parameter that you can pass in query
  strings when applicable. Values of options should match the
  endpoint's 'Query Parameters'. Check the methods to see which methods
  you can pass in options to.

  Some are required, and some are not. I often take care of the ones
  that are required.

  For example, the required parameter is type.
  I made it so that the default is 'RANKED_SOLO_5x5' if a type is not passed
  in.

  The client will give off warnings if there are required parameters that you did
  not pass in though (that I haven't taken care of).
*/
k.getChallengers({ region: 'na' }, rprint) // get solo queue games
k.getChallengers({ region: 'na', options: {
  type: 'RANKED_FLEX_SR'
}}, rprint) // get flex games

/*
  However, for getMatchList, the endpoint uses an optional
  'rankedQueues' instead of 'type' to allow multiple options.
  I still set the default to RANKED_SOLO_5x5 though.
*/
var name = 'caaaaaaaaaria'
k.getSummoners({ region: 'na', names: name }, function (err, data) {
  k.getMatchList({ region: 'na', id: data[name].id, options: {
    rankedQueues: 'RANKED_SOLO_5x5, RANKED_FLEX_SR',
    championIds: '67'
  } }, rprint)
})
```

### Full Documentation