# Kindred
[![NPM](https://nodei.co/npm/kindred-api.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/kindred-api/)

[![Build Status](https://travis-ci.org/ChauTNguyen/kindred-api.svg?branch=master)](https://travis-ci.org/ChauTNguyen/kindred-api)
[![codecov](https://codecov.io/gh/ChauTNguyen/kindred-api/branch/master/graph/badge.svg)](https://codecov.io/gh/ChauTNguyen/kindred-api)
[![dependencies Status](https://david-dm.org/chautnguyen/kindred-api/status.svg)](https://david-dm.org/chautnguyen/kindred-api)

Node.js League of Legends v3 API wrapper with built-in rate-limiting (enforced per region, burst/spread, follows retry headers), caching (in-memory, Redis), automatic retries, and parameter checking on top of [Riot's League of Legends API](http://www.developer.riotgames.com).

### Treat my [versioning](https://github.com/ChauTNguyen/kindred-api/blob/master/CHANGELOG.md) as 0.x.y!

# Refer to [Wiki](https://github.com/ChauTNguyen/kindred-api/wiki) for Complete Documentation and Working Examples!

# Table of Contents:
* [Core Features](#core-features)
* [Introduction](#introduction)
* [How the Methods Work](#how-the-methods-work)
* [Quickstart](#quickstart)
* [Known Issues](#known-issues)
* [Changelog](https://github.com/ChauTNguyen/kindred-api/blob/master/CHANGELOG.md)
* [Performance & Other Libraries](https://github.com/ChauTNguyen/kindred-api/wiki/Benchmarks)

# Core Features
* All standard endpoints covered but tournament endpoints.
* Supports both **callbacks** and **promises**.
* **Burst/Spread** rate limiter that is **enforced per region** and **respects method rate limits (per region as well)**.
    * **Retries** on 429 and >= 500 **until all calls are successful**.
    * **Follows and respects retry headers**.
* Built-in **parameter checks** so you can hopefully refer to documentation less! :)
    * Checks type of parameters (id, name, account id).
    * Checks if you're not passing valid query parameters!
* Built-in **caching** (in-memory and Redis).
    * **Customized expiration timers**. You can set a timer for each endpoint type. Refer to [Caching](https://github.com/ChauTNguyen/kindred-api/wiki/Caching) for more info.
* Designed to be simple but convenient. For example, you can call an exclusively by-id endpoint (such as grabbing the runes of a player) **with just the summoner name**.
* Tons of config (showing debug, configurable number of retries, turning off auto-retry, changing method rate limits, etcetc). Check out [Initialization](https://github.com/ChauTNguyen/kindred-api/wiki/Initialization) for all configs.

# Introduction

This will just be a quick introduction to some of the core features & configuration mentioned above. Check out the QuickStart section below for a lot of method usage. Make sure to check the wiki as well for detailed information about anything.

```javascript
import {
  Kindred,
  REGIONS,
  LIMITS,
  METHOD_TYPES,
  QUEUE_TYPES, // for matchlist query params
  QUEUE_STRINGS, // for master/challenger leagues query params
  InMemoryCache,
  RedisCache,
  print // simple callback function that prints the error or data
} from 'kindred-api'

const k = new Kindred({ key: 'myRitoAPIKey' })

// read more about methods in # How the Methods Work
k.Summoner.get({ name: 'Contractz' }, print)
k.Summoner.by.name('Contractz', print)

// both can take a callback
// in this case, print is just
// function (err, data) { if (err) console.error(err) else console.log(data) }
// {"id":32932398,"accountId":47776491,"name":"Contractz","profileIconId":1626,"revisionDate":1497308139000,"summonerLevel":30}

// Promises work too
k.Summoner.by.name('Contractz')
 .then(data => console.log(data))
 .catch(error => console.error(error))

// This is kinda boring though.
// Let's try turning on the debug.
const lol = new Kindred({
  key: 'myRitoAPIKey',
  debug: true
})

lol.Summoner.by.name('Contractz', print)
// 200 @ https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/contractz?api_key=
// {"id":32932398,"accountId":47776491,"name":"Contractz","profileIconId":1626,"revisionDate":1497308139000,"summonerLevel":30}

// Nice! The API key is hidden by default.
// However, let's say I want the convenience of clicking on the URL for some minor debugging.

const haha = new Kindred({
  key: 'myRitoAPIKey',
  debug: true,
  showKey: true
})

haha.Summoner.by.name('Contractz', print)

// 200 @ https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/contractz?api_key=myRitoAPIKey easy clicks / copypasting :)
// {"id":32932398,"accountId":47776491,"name":"Contractz","profileIconId":1626,"revisionDate":1497308139000,"summonerLevel":30}

// Let's now add a timeout
const omg = new Kindred({
  key: 'myRitoAPIKey',
  debug: true,
  showKey: true,
  timeout: 1 // millisecond
})

omg.Summoner.by.name('Contractz')

/*
{ Error: ETIMEDOUT
    at Timeout._onTimeout (/Users/sani/dev/kindred-api/node_modules/request/request.js:852:19)
    at ontimeout (timers.js:365:14)
    at tryOnTimeout (timers.js:237:5)
    at Timer.listOnTimeout (timers.js:207:5) code: 'ETIMEDOUT', connect: true } 'https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/contractz'

    Not fast enough, huh?
*/

// Let's add the dev limit,
// show the headers,
// set the default region,
// and add some in-memory-caching!
const wowomg = new Kindred({
  key: 'myRitoAPIKey',
  defaultRegion: REGIONS.NORTH_AMERICA,
  limits: LIMITS.DEV, // [[20, 1], [100, 120]] 20 reqs/1s. 100 reqs/2m.
  debug: true,
  timeout: 10000, // 10 seconds
  cache: new InMemoryCache()
})

wowomg.Summoner
      .get({ name: 'Contractz' })
      .then(data => wowomg.Summoner.get({ name: 'Contractz' }))
      .catch(error => console.error(error))

// 200 @ https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/contractz?api_key=
/*
{ 'x-rate-limit-type': undefined,
  'x-app-rate-limit': '100:120,20:1',
  'x-app-rate-limit-count': '1:120,1:1',
  'x-method-rate-limit': '20000:10,1200000:600',
  'x-method-rate-limit-count': '1:10,3:600',
  'x-rate-limit-count': '1:120,1:1',
  'retry-after': undefined }
*/
// CACHE HIT @ https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/contractz

// Here's a production type of config
const production = new Kindred({
  key: 'myProductionRitoAPIKey',
  limits: [[500, 10], [30000, 600]], // depends on app, this is base limit
  spread: true, // setting spread to true will help prevent timeout/econreset errors
  timeout: 100000,
  cache: new RedisCache()
})

// These are mostly the core configuration options.
// There are many others though.
// One useful one is
const zxcv = new Kindred({
  key: 'myRitoAPIKey',
  limits: LIMITS.DEV,
  retryOptions: {
    auto: true, // make sure this is true
    numberOfRetriesBeforeBreak: 3,
  }
})

// Now, if you hit an error that isn't a 404, it'll only retry
// up to N more time -- in this case, 3.

// https://github.com/ChauTNguyen/kindred-api/wiki/Initialization
// Make sure to check this for all possible configuration.

```

# How the Methods Work
* [Object + Callback Functions](#object-and-callback-functions)
* [Standard Functions](#standard-functions)

All `list` and `by.xxx` functions will have standard parameters.

**Any other method** will always take in an object as the first parameter, and an optional callback as the second.

These methods can work with different type of parameters (id, name, accountId) when applicable.

What I like about the functions that take object parameters is that you can declare config objects and pass in things really cleanly instead of worrying about the order of parameters in standard functions.

These functions take in an optional `region` and an optional `options` parameter (whenever possible) WITHIN the same object parameter. Most of the time, when they're called, they look like this:

## Object and Callback Functions
```javascript
const id = 32932398 // summonerId
const name = 'Contractz'
const accId = 47776491

k.Matchlist.get({ id }, KindredAPI.print)
k.Matchlist.get({ name }, KindredAPI.print)
k.Matchlist.get({ accId }, KindredAPI.print)

k.Summoner.get({ id }, KindredAPI.print)
k.Summoner.get({ name }, KindredAPI.print)
k.Summoner.get({ accId }, KindredAPI.print)

// Want to use more regular-looking functions? Scroll to the `Standard Functions` section!

const config = {
  id: 6323,
  region: REGIONS.NORTH_AMERICA,
  options: {
    tags: ['image', 'sanitizedDescription']
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
    tags: 'stats'
  },
  region: REGIONS.NORTH_AMERICA
}

k.Static.runes(runesConfig, KindredAPI.print)

const championsConfig = {
  options: {
    tags: 'all',
    version: '7.9.1'
  }
}

k.Static.champions(championsConfig, KindredAPI.print)

const koreaChampListConfig = {
  options: {
    tags: 'all'
  },
  region: REGIONS.KOREA
}

k.Static.champions(koreaChampListConfig)
        .then(data => console.log(data))
        .catch(error => console.error(error))

const rakanConfig = {
  id: 497,
  options: {
    tags: 'all'
  },
  region: REGIONS.BRAZIL
}

k.Static.champion(rakanConfig)
        .then(data => console.log(data))
        .catch(err => console.error(err))

// As you can see in the above, all functions that aren't named `list` or `by-id`
// will take in an object parameter as the first parameter ALWAYS.
```

## Standard Functions
```javascript
const QUEUES = KindredAPI.QUEUE_TYPES

k.Summoner.by.name('Contractz', KindredAPI.print)
k.Summoner.by.id(32932398, KindredAPI.print)

// The way these functions handle parameters is:
// Optimal parameters can be excluded, but it's in a left -> right order.
// For example, not including options when it's possible
// would mean whatever you place in there will be in region.
// function(
//  <id>|<name>|<accId>, type varies, existence depends on endpoint, not optional
//  <options>, object, existence depends on endpoint, optional
//  <region>, string, in every function, optional
//  <callback>, function, in every function, optional
//)

k.Summoner
 .by.account(47776491)
 .then(data => console.log(data))
 .catch(error => console.error(error))

const opts = {
  queue: [QUEUES.TEAM_BUILDER_RANKED_SOLO, QUEUES.RANKED_FLEX_SR],
  champion: 81 // Ezreal
}

k.Matchlist.by.name('Contractz', opts, KindredAPI.print)

k.Matchlist.by.name('Contractz', KindredAPI.print)

k.Matchlist
 .by.name('Contractz')
 .then(data => console.log(data))
 .catch(error => console.error(error))

k.Matchlist
 .by.name('sktt1peanut', REGIONS.KOREA)
 .then(data => console.log(data))
 .catch(error => console.error(error))

k.Matchlist
 .by.name('sktt1peanut', opts, REGIONS.KOREA)
 .then(data => console.log(data))
 .catch(error => console.error(error))

k.Static.Champion.list({ tags: 'all' }, KindredAPI.print)
k.Static.Champion.list(KindredAPI.print)
k.Static.Champion.list(REGIONS.KOREA, KindredAPI.print)
k.Static.Champion.list({ tags: 'all' }, REGIONS.KOREA, KindredAPI.print)

// Notice how parameters are somewhat flexible! This is the case for all functions.
```

Make sure to check out the [Wiki](https://github.com/ChauTNguyen/kindred-api/wiki)
for working, copy-pastable examples.

# Quickstart
* Debug on
* Dev key rate limiting per region
* In-memory (JS) cache with default settings on for quick scripts
* Burst Rate Limiter

This initialization's purpose should be fairly obvious; This is just for quickly starting on a project. You can always easily replace the QuickStart code with the code required for initializing through the regular way (see below), and Kindred will work just fine.

Start out with this if you want to make test calls right away to play around with the library and decide if you like it.

[For production apps and more customizable initialization (caching, spread rate limiter), refer to wiki.](https://github.com/ChauTNguyen/kindred-api/wiki/Initialization)

```javascript
const KindredAPI = require('kindred-api')
const REGIONS = KindredAPI.REGIONS
const QUEUES = KindredAPI.QUEUE_TYPES // numbers for match endpoints
const debug = true // shows status code + url on request. enables showKey and showHeaders.
const k = KindredAPI.QuickStart('YOUR_KEY', REGIONS.NORTH_AMERICA, debug)
const Q_STRINGS = KindredAPI.QUEUE_STRINGS // strings for editor convenience

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
    tags: 'stats'
  },
  region: REGIONS.NORTH_AMERICA,
}

k.Static.runes(runesConfig, KindredAPI.print)

const name = 'do not nuke PROD'
const region = REGIONS.NORTH_AMERICA
const options = {
  // no need for joins or hardcoded numbers
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

const accId = 47776491
const id = 32932398 // summonerId
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
    tags: 'all'
  },
  region: REGIONS.KOREA
}

k.Static.champions(koreaChampListConfig)
        .then(data => console.log(data))
        .catch(error => console.error(error))

const rakanConfig = {
  id: 497,
  options: {
    tags: 'all'
  },
  region: REGIONS.BRAZIL
}

k.Static.champion(rakanConfig)
        .then(data => console.log(data))
        .catch(err => console.error(err))

k.Static.Champion
        .list({ tags: 'all' }, REGIONS.KOREA)
        .then(data => console.log(data))
        .catch(error => console.error(error))

k.Static.Champion
        .by.id(497, { tags: 'all' })
        .then(data => console.log(data))
        .catch(error => console.error(err))
```

# Known Issues

## No header validation.

It'd be cool if we could do something like this [library](https://github.com/NitashEU/zed.gg). Adjusting the headers on the first request would be really useful for scripts and all that to prevent rate-limiting (especially when they have high production limits) on app/script restart.

## [~~Allow users to ignore timeout-related issues.~~ (ADDED 2.0.67)](https://github.com/ChauTNguyen/kindred-api/commit/b8fec78fe0283e515a4845edcb193f59ecbe6e07)

## [~~Burst rate limiter would not work well for production.~~ (FIXED 2.0.39)](https://github.com/ChauTNguyen/kindred-api/commit/8089717995d42ae2b222b18c57f79c0fb8e11a27)

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

## [~~Promises retry on 404.~~ (FIXED 2.0.43)](https://github.com/ChauTNguyen/kindred-api/commit/3fd4ac7ac04aa3a992098b22e987807f170efcc6)

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