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
  All methods naturally receive a callback
  denoted through the `cb` parameter.
*/

me = k.getSummoners({
  names: 'caaaaaaaaaria',
  cb: printDataFn
})

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

var p1 = k.getSummoners({
  name='sktt1peanut',
  region: REGIONS.KOREA,
  cb: printDataFn
})

k.setRegion(REGIONS.KOREA) // Change default region
function printDataFn(err, data) {
  if (err) console.log(err)
  console.log(data)
}

var p2 = k.getSummoners({
  names: 'hide on bush',
  cb: printDataFn
})

/* Note that you can use spaces in the name. */

var myStats = k.getRankedStats({ player: me['id'] })
/*
    Default ranked mode is 'RANKED_SOLO_5X5'
    naturally. This is all configurable though,
    and this pattern will stay constant
    throughout all my methods.
*/
```

### Full Documentation