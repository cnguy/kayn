# Kindred
Kindred is a Node.js wrapper with built-in rate-limiting (enforced per region, burst/spread), caching (in-memory and Redis), and parameter checking on top of [Riot's League of Legends API](http://www.developer.riotgames.com).

To get started, run one of the following!
```
1) yarn add kindred-api
2) npm install --save kindred-api
```

### Treat my [versioning](https://github.com/ChauTNguyen/kindred-api/blob/master/CHANGELOG.md). as 0.x.y!

# Refer to [Wiki](https://github.com/ChauTNguyen/kindred-api/wiki) for Documentation and Working Examples!
Currently, I'm changing the format of how methods are presented so that it's much easier
to parse.

Check out [SUMMONER-V3](https://github.com/ChauTNguyen/kindred-api/wiki/SUMMONER-V3) or
[STATIC-DATA-V3](https://github.com/ChauTNguyen/kindred-api/wiki/STATIC-DATA-V3) to see what I mean.

**Note that all standard endpoints covered but tournament endpoints! The documentation is still in the works, but you should be able to find everything you need in every section (just scroll down a lot lol).**

# Table of Contents:
* [Core Features](#core-features)
* [How the Methods Work](#how-the-methods-work)
* [Quickstart](#quickstart)
* [Known Issues](#known-issues)
* [Changelog](https://github.com/ChauTNguyen/kindred-api/blob/master/CHANGELOG.md)

# Core Features
* All standard endpoints covered but tournament endpoints.
* Supports both **callbacks** and **promises**.
* Burst/Spread rate limiter that is **enforced per region** and **follows retry headers**.
    * Retries on 429 and >= 500. (Doesn't retry on 404)
* Built-in **parameter checks** so you can hopefully refer to documentation less! :)
* Built-in **caching** (in-memory and Redis).
    * **Customized expiration timers**. You can set a timer for each endpoint type. Refer to [Caching](https://github.com/ChauTNguyen/kindred-api/wiki/Caching) for more info.
* Designed to be simple but convenient. For example, you can call an exclusively by-id endpoint (such as grabbing the runes of a player) **with just the summoner name**.

# How the Methods Work
All `list` and `by.xxx` functions will have standard parameters.

**Any other method** will always take in an object as the first parameter, and an optional callback as the second.

These methods can work with different type of parameters (id (summoner!!!), name, accountId) when applicable.

What I specifically like about the functions that take object parameters is that you can declare config objects
and pass in things really cleanly instead of worrying about the order of parameters in standard function.

These functions take in an optional `region` and an optional `options` parameter (whenever possible) WITHIN the same first parameter. Most of the time, when they're called, they look like this:

## Object + Callback Functions
```javascript
const config = {
    id: 6323,
    region: REGIONS.NORTH_AMERICA,
    options: {
        masteryData: ['image', 'sanitizedDescription']
    }
}

k.Static.mastery(config, KindredAPI.print)

const matchlistConfig = {
    name: 'Contractz',
    options: {
        queue: QUEUES.TEAM_BUILDER_RANKED_SOLO, // 420
        champion: 67
    }
}

k.Matchlist.get(matchlistConfig, KindredAPI.print)

const runesConfig = {
  options: {
    locale: 'es_ES',
    runeListData: 'stats'
  },
  region: REGIONS.NORTH_AMERICA
}

k.Static.runes(runesConfig, KindredAPI.print)

const championsConfig = {
  options: {
    champListData: 'all',
    version: '7.9.1'
  }
}

k.Static.champions(championsConfig, KindredAPI.print)

const koreaChampListConfig = {
  options: {
    champListData: 'all'
  },
  region: REGIONS.KOREA
}

k.Static.champions(koreaChampListConfig)
        .then(data => console.log(data))
        .catch(error => console.error(error))

const rakanConfig = {
  id: 497,
  options: {
    champData: 'all'
  },
  region: REGIONS.BRAZIL
}

k.Static.champion(rakanConfig)
        .then(data => console.log(data))
        .catch(err => console.error(err))

const summonerConfig = {
  name: 'Contractz'
}

k.Summoner.get(summonerConfig, KindredAPI.print)

// As you can see in the above, all functions that aren't named `list` or `by-id`
// will take in an object parameter as the first parameter ALWAYS.
```

## Standard Functions
```javascript
// I included normal methods too though.
k.Summoner.by.name('Contractz', KindredAPI.print)

const opts = {
  queue: [QUEUES.TEAM_BUILDER_RANKED_SOLO, QUEUES.RANKED_FLEX_SR],
  champion: 81 // Ezreal
}

k.Matchlist.by.name('Contractz', opts, KindredAPI.print)
```

Make sure to check out the [Wiki](https://github.com/ChauTNguyen/kindred-api/wiki)
for working, copy-pastable examples.

# Quickstart
* Debug on
* Dev key rate limiting per region
* In-memory (JS) cache with default settings on for quick scripts

```javascript
var KindredAPI = require('kindred-api')
var REGIONS = KindredAPI.REGIONS
var QUEUES = KindredAPI.QUEUE_TYPES // numbers for match endpoints
var debug = true
var k = KindredAPI.QuickStart('YOUR_KEY', REGIONS.NORTH_AMERICA, debug)
var Q_STRINGS = KindredAPI.QUEUE_STRINGS // strings for editor convenience

// Make sure to read `How the methods work` to understand the difference between
// get/noun functions VS by.id/list.
k.Challenger.list(Q_STRINGS.RANKED_SOLO_5x5)

/* Summoners! */
k.Summoner.get({ id: 32932398 }, KindredAPI.print)
k.Summoner.get({ name: 'Contractz' }, KindredAPI.print)
k.Summoner.by.id(32932398, KindredAPI.print)
k.Summoner.by.name('Contractz', REGIONS.NORTH_AMERICA, KindredAPI.print)

/* How to pass in options 101. */
const runesConfig = {
  options: {
    locale: 'es_ES',
    runeListData: 'stats'
  },
  region: REGIONS.NORTH_AMERICA,
}

k.Static.runes(runesConfig, KindredAPI.print)

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

const koreaChampListConfig = {
  options: {
    champListData: 'all'
  },
  region: REGIONS.KOREA
}

k.Static.champions(koreaChampListConfig)
        .then(data => console.log(data))
        .catch(error => console.error(error))

const rakanConfig = {
  id: 497,
  options: {
    champData: 'all'
  },
  region: REGIONS.BRAZIL
}

k.Static.champion(rakanConfig)
        .then(data => console.log(data))
        .catch(err => console.error(err))

k.Static.Champion
        .list({ champListData: 'all' }, REGIONS.KOREA)
        .then(data => console.log(data))
        .catch(error => console.error(error))

k.Static.Champion
        .by.id(497, { champData: 'all' })
        .then(data => console.log(data))
        .catch(error => console.error(err))
```

# Known Issues

## Burst rate limiter would not work well for production.

Good explanation by Matviy##4429 in #RiotAPIDevCommunity

```
The issue with the "burst and stop" method is that the API queues all incoming requests and can only process them so fast. If the requests get stale in the queue (few seconds), then the API won't even try processing them and will just return an error 500 instead.
You'll see this if you burst more than a few hundred requests or so at once, a couple will go through, and then suddenly you'll get a few hundred 500 errors all at once
```

This is now in the [TODO](https://github.com/ChauTNguyen/kindred-api/blob/master/TODO.md).

## Both caches currently (JS in-memory, Redis) are primitive implementations, and can possibly exceed memory limitations.

I haven't had to deal with this in my smaller applications ([One Tricks](www.onetricks.net) for example) and scripts, but I'm guessing some people might use this library for bigger applications. I can add an LRU cache (and MongoDB) as well as a reset() function or something if people start asking.

`One Tricks` is simple, but does take a lot of requests currently (probably 25000~ if nothing's cached).

However, I simply use the cache to store all the summoner information and champion information, grind the stats information, and put the *algorithmically-processed* data in my database.

The difference between my site and other applications people seem to be working on is everyone seems to be doing some mini-op.gg type of thing which would probably demand a more concrete library with better tools, especially with the deprecation of the Stats endpoint.

## ~~Rate Limiter is not as optimized as it should be.~~ (FIXED 2.0.33)

## Promises retry on 404.

This is problematic because certain calls such as getCurrentGame, which will hit 404's often, will always retry up to 3 times.

This means it'll send a request, get a 404, and then send three more requests for a total of 3 unnecessary requests.

```javascript
k.CurrentGame.get({ name: 'Contractz' })

/*
200 https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/contractz?api_key=
{ 'x-app-rate-limit-count': '1:10,1:600',
  'x-method-rate-limit-count': '1:10,2:600',
  'x-rate-limit-count': '1:10,1:600',
  'retry-after': undefined }

404 Not Found https://na1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/32932398?api_key=
{ 'x-app-rate-limit-count': '2:10,2:600',
  'x-method-rate-limit-count': '1:10,5:600',
  'x-rate-limit-count': '2:10,2:600',
  'retry-after': undefined }

404 Not Found https://na1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/32932398?api_key=
{ 'x-app-rate-limit-count': '3:10,3:600',
  'x-method-rate-limit-count': '2:10,6:600',
  'x-rate-limit-count': '3:10,3:600',
  'retry-after': undefined }

404 Not Found https://na1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/32932398?api_key=
{ 'x-app-rate-limit-count': '4:10,4:600',
  'x-method-rate-limit-count': '3:10,7:600',
  'x-rate-limit-count': '4:10,4:600',
  'retry-after': undefined }

404 Not Found https://na1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/32932398?api_key=
{ 'x-app-rate-limit-count': '5:10,5:600',
  'x-method-rate-limit-count': '4:10,8:600',
  'x-rate-limit-count': '5:10,5:600',
  'retry-after': undefined }
*/
```