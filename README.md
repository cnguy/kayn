# Kindred
Kindred is a Node.js wrapper with built-in rate-limiting (enforced per region), caching (in-memory and Redis), and parameter checking on top of [Riot's League of Legends API](http://www.developer.riotgames.com).

To get started, run one of the following!
```
1) yarn add kindred-api
2) npm install --save kindred-api
```

# Refer to [Wiki](https://github.com/ChauTNguyen/kindred-api/wiki) for Documentation!

# Core Features
* All standard endpoints covered but tournament endpoints.
* Supports both **callbacks** and **promises**.
* Rate limiter that is **enforced per region** and **follows retry headers**.
    * Retries on 429 and >= 500.
* Built-in **parameter checks** so you can hopefully refer to documentation less! :)
* Built-in **caching** (in-memory and Redis).
    * **Customized expiration timers**. You can set a timer for each endpoint type. Refer to [Caching](#caching) for more info.
* Designed to be simple but convenient. For example, you can call an exclusively by-id endpoint (such as grabbing the runes of a player) **with just the summoner name**.

# How the Methods Work
All `list` and `by.xxx` functions will have standard parameters.

**Any other method** will always take in an object as the first parameter, and an optional callback as the second.

These methods can work with different type of parameters (id (summoner!!!), name, accountId) when applicable.

# Quickstart
* Debug on
* Dev key rate limiting per region
* In-memory (JS) cache with default settings on for quick scripts

```javascript
var KindredAPI = require('kindred-api')
var REGIONS = KindredAPI.REGIONS
var QUEUES = KindredAPI.QUEUE_TYPES
var debug = true
var k = KindredAPI.QuickStart('YOUR_KEY', REGIONS.NORTH_AMERICA, debug)

/* Summoners! */
k.Summoner.get({ id: 32932398 }, KindredAPI.print)
k.Summoner.get({ name: 'Contractz' }, KindredAPI.print)
k.Summoner.by.id(32932398, KindredAPI.print)
k.Summoner.by.name('Contractz', REGIONS.NORTH_AMERICA, KindredAPI.print)

/* How to pass in options 101. */
var name = 'caaaaaaaaaria'
var region = REGIONS.NORTH_AMERICA
var options = {
  // no need for joins or messy strings
  queue: [QUEUES.TEAM_BUILDER_RANKED_SOLO, QUEUES.RANKED_FLEX_SR],
  // array values will always be joined into a string
  champion: 79
  // option params should be spelled and capitalized the same as it is in Riot's docs!
  // ex: Matchlist params in Riot's docs include `champion`, `beginIndex`, `beginTime`, `season`
}

k.Summoner
 .get({ name, region })
 .then(data => k.Matchlist.get(
   { accId: data.accountId, options }
   )
 )
 .then(data => console.log(data))
 .catch(err => console.error(err))

/*
    Instead of chaining requests like in the above, you can simply call
    k.Matchlist.get with the `name` param or the `id` (summonerId) param.
    Any function that targets just Ids or accountIds can use all three
    different type of params (summonerId, accountId, name).
*/
k.Matchlist
 .get({ name, region, options })
 .then(data => console.log(data))
 .catch(err => console.error(err))

var accId = 47776491
var id = 32932398 // summonerId
k.Matchlist.get({ name }, KindredAPI.print)
k.Matchlist.get({ accId }, KindredAPI.print)
k.Matchlist.get({ id }, KindredAPI.print)

/* Up to preference. */
k.Runes.get({ name }, KindredAPI.print)
k.Summoner.runes({ name }, KindredAPI.print)

k.Matchlist.get({ name }, KindredAPI.print) // full matchlist
k.Summoner.matchlist({ name }, KindredAPI.print)

k.Matchlist.recent({ name }, KindredAPI.print)
k.Summoner.matchHistory({ name }, KindredAPI.print) // recent matches (20)

const config = {
  options: {
    champListData: 'all'
  },
  region: REGIONS.KOREA
}

k.Static.champions(config)
        .then(data => console.log(data))

k.Static.champion({
    id: 497,
    config.options
}).then(data => console.log(data))

k.Static.Champion
        .list({ champListData: 'all' }, REGIONS.KOREA)
        .then(data => console.log(data))

k.Static.Champion
        .by.id(497, { champData: 'all' })
        .then(data => console.log(data))
        .catch(error => console.error(err))
```