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

var fakerIgn = { names: 'hide no bush' }
var p2 = k.getSummoners(fakerIgn, printDataFn) // faker's data

/* Note that you can use spaces in the name. */

var myStats = k.getRankedStats({ players: me['id'] }, printDataFn)
var fakerOptions = { players: p2[fakerIgn.names]['id'], region: REGIONS.NORTH_AMERICA }
var fakerStats = k.getRankedStats(fakerOptions, printDataFn)
/*
    Default ranked mode is 'RANKED_SOLO_5X5'
    naturally. This is all configurable though,
    and this pattern will stay constant
    throughout all my methods.
*/
```

### Full Documentation