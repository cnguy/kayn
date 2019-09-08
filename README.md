A small Node.js library to work with Riot's League of Legend's API.

[![NPM](https://nodei.co/npm/kayn.png)](https://nodei.co/npm/kayn/)

[![Build Status](https://travis-ci.org/cnguy/kayn.svg?branch=master)](https://travis-ci.org/cnguy/kayn)
[![API Cov. Badge](/_pictures/api_cov.png?raw=true "API Cov. Badge")](https://github.com/cnguy/kayn/blob/master/ENDPOINTS.md)
[![codecov](https://codecov.io/gh/cnguy/kayn/branch/master/graph/badge.svg)](https://codecov.io/gh/cnguy/kayn)
[![dependencies Status](https://david-dm.org/cnguy/kayn/status.svg)](https://david-dm.org/cnguy/kayn)

<details><summary>Simple example using promises and callbacks</summary>

<p>

####

```javascript
const _kayn = require('kayn')
const Kayn = _kayn.Kayn
const REGIONS = _kayn.REGIONS

const kayn = Kayn(/* process.env.RIOT_LOL_API_KEY */)(/* optional config */)

kayn.Summoner.by
    .name('Contractz')
    .region(REGIONS.NORTH_AMERICA) // same as 'na'
    .callback(function(unhandledError, summoner) {
        kayn.Matchlist.by
            .accountID(summoner.accountId)
            /* Note that region falls back to default if unused. */
            .query({
                season: 11,
                queue: [420, 440],
            })
            .then(function(matchlist) {
                console.log('actual matches:', matchlist.matches)
                console.log('total number of games:', matchlist.totalGames)
            })
            .catch(console.error)
    })
```
</p>
</details>

<details><summary>Same example (as the above) using async/await, destructuring, and template strings</summary>

<p>

####

```javascript
import { Kayn, REGIONS } from 'kayn'

const kayn = Kayn(/* process.env.RIOT_LOL_API_KEY */)(/* optional config */)

const main = async () => {
    const { accountId } = await kayn.Summoner.by.name('Contractz')
    // ^ default region is used, which is `na` unless specified in config
    const { matches, totalGames } = await kayn.Matchlist.by
        .accountID(accountId)
        .query({ season: 11, champion: 67 })
        .region(REGIONS.NORTH_AMERICA)

    console.log('actual matches:', matches)
    console.log(`total number of games: ${totalGames}`)
}

main()
```
</p>
</details>

<details><summary>Example of getting match information from 100 matches at once</summary>

<p>

####
```javascript
const getChampionIdFromMatch = (match, accountId) => {
    for (let i in match.participantIdentities) {
        if (
            match.participantIdentities[i].player.currentAccountId ===
            accountId
        ) {
            return match.participants[parseInt(i)].championId
        }
    }
}

const main = async kayn => {
    const { accountId } = await kayn.SummonerV4.by.name('Contractz')
    const rankGameIds = (await kayn.MatchlistV4.by
        .accountID(accountId)
        .query({ queue: 420 })).matches.map(el => el.gameId)
    const championIds = await Promise.all(
        rankGameIds.map(async gameId => {
            const matchDetail = await kayn.MatchV4.get(gameId).region('na')
            return getChampionIdFromMatch(matchDetail, accountId)
        }),
    )
    console.log(championIds.slice(0, 5), championIds.length)
}
```
</p>
</details>

<details><summary>Example of getting DDragon information of banned champions in a game</summary>

<p>

####

```javascript
const main = async (kayn) => {
    const match = await kayn.Match.get(2877485196)
    const bans = match.teams.map(m => m.bans).reduce((t, c) => t.concat(c), [])
    const ids = bans.map(b => b.championId)
    const ddragonChampions = await kayn.DDragon.Champion.listDataByIdWithParentAsId()
    const champions = ids.map(id => ddragonChampions.data[id])
    console.log(champions)
}
```
</p>
</details>

[More Examples](#more-examples)
<details><summary>Example Selected Implementations</summary>

<p>

####
- [Get last 10 matches asynchronously and efficiently (vs slower version as well)](https://github.com/cnguy/kayn/blob/master/examples/async.await/v4/get-last-10-ranked-matches-efficiently.js)
- [Get champion name, win status, season id, and game date for past 5 ranked games of a player](https://github.com/cnguy/kayn/blob/master/examples/async.await/v4/get-detailed-info-from-last-5-ranked-matches.js)

... [More Examples](#more-examples)

</p>
</details>

# Table of Contents:
* [Features](#features)
* [Methods](#methods)
* [Installation & (Riot API) Usage](#installation-and-usage)
* [DDragon Usage](#ddragon-usage)
* [Configuration](#configuration)
* [My Project](#my-project)
* [Bugs / Changelog / Disclaimer](#bugs)
* [FAQ](#faq)

# Features

## Rate Limiting

Handled by [Colorfulstan](https://github.com/Colorfulstan)'s wonderful [riot-ratelimiter](https://github.com/Colorfulstan/RiotRateLimiter-node).

See [RATELIMITING.md](https://github.com/cnguy/kayn/blob/master/RATELIMITING.md).

## All Endpoints Covered

## Caching

Currently supports a basic JS cache (for simple scripts), node-lru-cache, and Redis.

## Compatible with Callbacks, Promises, Async / Await

## TypeScript Support

Works immediately upon installation.

As of v0.8.0, full DTO's are provided thanks to [MingweiSamuel](https://github.com/MingweiSamuel)'s [auto-updated Swagger JSON](https://github.com/MingweiSamuel/riotapi-schema).

# Methods

Check out [ENDPOINTS.md](https://github.com/cnguy/kayn/blob/master/ENDPOINTS.md) to see kayn's methods, as well as the endpoints covered.

## Documentation

The auto-generated ESDoc documentation can be found [here](http://kayn.surge.sh).

# Installation and Usage

The minimum required [Node.js version is v7.6.0](https://nodejs.org/en/blog/release/v7.6.0/) for native async/await support (there's only a mere line in the codebase, though).

## npm

```sh
npm i --save kayn
```

## yarn

```sh
yarn add kayn
```

### Quick Setup with [Default Config](https://github.com/cnguy/kayn/blob/master/lib/KaynConfig.js)

```javascript
const { Kayn, REGIONS } = require('kayn')
const kayn = Kayn('RGAPI-my-api-key')(/*{
    region: REGIONS.NORTH_AMERICA,
    apiURLPrefix: 'https://%s.api.riotgames.com',
    locale: 'en_US',
    debugOptions: {
        isEnabled: true,
        showKey: false,
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 1000,
        burst: false,
        shouldExitOn403: false,
    },
    cacheOptions: {
        cache: null,
        timeToLives: {
            useDefault: false,
            byGroup: {},
            byMethod: {},
        },
    },
}*/)
```

**Note: Any config passed in is deeply merged with the default config.**

### Environment Variables

```javascript
const kayn = Kayn(/* process.env.RIOT_LOL_API_KEY */)(myConfig)
```

Although it is possible to manually pass in the API key, it is preferable to store the key in a secret file (which should not be committed).

This allows `kayn` to be constructed like in the above code.

```sh
# filename: .env
RIOT_LOL_API_KEY=RGAPI-my-api-key
```

### Callbacks

```javascript
kayn.Summoner.by.name('Contractz').callback(function(err, summoner) {
    // do something
})
```

### Promises

```javascript
kayn.Summoner.by.name('Contractz')
    .then(summoner => doSomething(summoner))
    .then(console.log)
    .catch(error => console.error(error))
```

### Async / Await

```javascript
const main = async () => {
    const ctz = await kayn.Summoner.by.name('Contractz')
}
```

### Region

This forces a request to target a specific region instead of the default region set in `kayn`'s config. If `.region()` is not used, `kayn` will use the default region to make requests.

```javascript
kayn.Summoner.by.name('hide on bush')
    .region(REGIONS.KOREA)
    .callback(function(error, summoner) {
        doSomething(summoner)
    })
```

#### Region without Throwing

There is another utility method in case if you want to avoid handling exceptions caused by `.region()`. This method simply catches `.region()`'s exception, and so it will fall back to the default region as well.

```javascript
kayn.Summoner.by.name('hide on bush')
    .regionNoThrow(null) // No error thrown. Uses default region.

kayn.Summoner.by.name('hide on bush')
    .regionNoThrow(3) // Same as above.

kayn.Summoner.by.name('hide on bush')
    .regionNoThrow('kr524') // Same as above.
```

### Query Parameters

You can pass in strings, numbers, or arrays as values. Just pass in whatever Riot expects. :)

```javascript
kayn.Matchlist.by.accountID(3440481)
    .region(REGIONS.KOREA)
    .query({
        season: 9,
        queue: [420, 440],
    })
    .callback(function(err, matchlist) {
        console.log(matchlist.matches.length)
    })
```

### Request Errors

Errors as of v0.8.7 return the following error object:

```javascript
{
    statusCode: 42, // some random number
    url: '', // the debug URL that is used in logging as well
    error: {} // the rest of the error object
}
```

# DDragon Usage

### Version

This forces a request to target a specific version and is no longer mandatory as of `v0.8.22`.

```javascript
kayn.DDragon.Champion.list()
    .version('8.15.1') /* Explicit */
    .callback(function(error, champions) {
        console.log(champions)
    })

// Let's say the config region is North America and that the latest version
// for the champion endpoint in NA is 8.24.1
kayn.DDragon.Champion.list() // Implicitly targets 8.24.1
    .callback(function(error, champions) {
        console.log(champions)
    })

// Same thing as above, but gets the versions for a different region from the configuration.
kayn.DDragon.Champion.list().region('br')
    .callback(function(error, champions) {
        console.log(champions)
    })
```

#### Notes about Optional Version Argument

Whenever you make a request that does not have a version passed in, `kayn` will automatically grab all the JSON versions associated with your default region or through the `region()` method.

If you do not have caching enabled, note that each request with no version passed will always send an additional request for grabbing the version. Otherwise, it follows standard caching.

##### No Cache Example
```javascript
// Calls the Realm list endpoint to get the version for North America's champion data. It then gets the champions.
kaynWithNoCache.DDragon.Champion.list()

// Gets versions for 'kr' instead of default region.
kaynWithNoCache.DDragon.Champion.list().region('kr')
```

##### Cache Example
```javascript
// Calls Kayn.Realm.list(), caches it, and then gets the version for North America's champion data. It then gets the champions. 
kaynWithCache.DDragon.Champion.list()
// Retrieves the cached version (because we already called the realm endpoint under the hood) for North America's champion data and then gets the champions.
kaynWithCache.DDragon.Champion.list()
```

### Region

This is only for /cdn/data/___/___.json-esque requests. It is a helper method that allows `kayn` to not force the user to have to pass in a version.

```javascript
kayn.DDragon.Champion.list()
    .region('kr')
    .locale('ko_KR')
```

### Locale

This forces a request to target a specific locale instead of the default locale set in `kayn`'s config. If `.locale()` is not used, `kayn` will use the default locale to make requests.

```javascript
kayn.DDragon.Champion.list()
    .version('8.15.1')
    .locale('sg_SG')
    .callback(function(error, champions) {
        console.log(champions)
    })

kayn.DDragon.Champion.list()
    .version('8.15.1')
    /* Locale not specified. Uses default locale, which is 'en_US' in the config and is adjustable. */
    .callback(function(error, champions) {
        console.log(champions)
    })
```

## Realm -> Version Example

This example firstly hits the `Realm` endpoint, which grabs a list of versions where each version corresponds with some type of DDragon endpoint (`Champion`, `Item`, etc). I then grab the version associated with the `Champion` endpoint to get the latest static champion list for the NA region. Note that `kayn.DDragon.Realm.list` uses the default region or takes in a region specified, which is why I am able to avoid passing in extra arguments.

```javascript
const main = async () => {
    const kayn = Kayn('RGAPI-my-api-key')({
        region: REGIONS.NORTH_AMERICA,
        locale: 'en_US',
        debugOptions: {
            isEnabled: true,
            showKey: false,
        },
        requestOptions: {}, // Doesn't apply to DDragon requests
        cacheOptions: {
            cache: new LRUCache({ max: 5000 }),
            timeToLives: {
                useDefault: true, // Cache DDragon by default!
            },
        },
    })

    /*
        kayn.DDragon.Realm.list('na') =>
        {
        	"n": {
        		"item": "8.17.1",
        		"rune": "7.23.1",
        		"mastery": "7.23.1",
        		"summoner": "8.17.1",
          		"champion": "8.17.1",
          		"profileicon": "8.17.1",
        		"map": "8.17.1",
          		"language": "8.17.1",
        		"sticker": "8.17.1"
          	},
        	"v": "8.17.1",
          	"l": "en_US",
          	"cdn": "https://ddragon.leagueoflegends.com/cdn",
          	"dd": "8.17.1",
          	"lg": "8.17.1",
          	"css": "8.17.1",
          	"profileiconmax": 28,
          	"store": null
        }
    */

    // Same as `const championVersion = data.n.champion`.
    const { n: { champion: championVersion } } = await kayn.DDragon.Realm.list(/* default region */)
    const championList = await kayn.DDragon.Champion.list().version(championVersion)
    console.log(championList)
}
```

## dataById and dataByIdWithParentAsId

As of v0.8.19, the following DDragon.Champion functions have been added:

```javascript
DDragon.Champion.getDataById(championName: string)
DDragon.Champion.getDataByIdWithParentAsId(championName: string)
DDragon.Champion.listDataById()
DDragon.Champion.listDataByIdWithParentAsId()
DDragon.Champion.listFullDataById()
DDragon.Champion.listFullDataByIdWithParentAsId()
```

Given:

```json
{
  ...
	"data": {
        ...
		"Aatrox": {
            ...
			"id": "Aatrox",
			"key": "266"
		}
	}
}
```

`someFunctionDataById` changes the shape to:

```json
{
  ...
	"data": {
        ...
		"Aatrox": {
            ...
			"id": "266",
			"key": "Aatrox"
		}
	}
}
```

while `someFunctionDataByIdWithParentAsId` changes the shape to:

```json
{
  ...
	"data": {
    ...
		"266": {
            ...
			"id": "266",
			"key": "Aatrox"
		}
	}
}
```

These functions also cache their own data, separate from the functions that make the actual HTTP requests. They also have their own method names, and are cached under the 'DDRAGON' namespace.

# More Examples

* [Regular JavaScript](https://github.com/cnguy/kayn/tree/master/examples/es5)
* [Async Await](https://github.com/cnguy/kayn/tree/master/examples/async.await)

# Configuration

### region

Default: 'na'

### locale

Default: 'en_US'

### apiURLPrefix

Default: '`https://%s.api.riotgames.com`'

## Request Options

### numberOfRetriesBeforeAbort

Default: 3 attempts.

### delayBeforeRetry

Default: 1000 ms (1 second).

This option will be scrapped in the future in favor for more flexibility (linear, exponential, random, etc).

### burst

Default: false.

Disabled by default in favor of `spread`.

`true` => `riotratelimiter` will use its burst strategy.

`false` => `riotratelimiter` will use its spread strategy.

### shouldExitOn403

Default: false.

This option will force the process to quit if your API key is blacklisted or invalid.

## Cache Options

To cache, firstly create some cache that implements the `get` and `set` functions that `kayn` interfaces with, and then pass that cache instance to `cacheOptions.cache`.

`ttls` are method ttls. This part is pretty inconvenient right now. Suggestions are welcome.

Current caches:
* basic in-memory cache
* [(node) lru-cache](https://github.com/isaacs/node-lru-cache)
* [Redis cache](https://github.com/NodeRedis/node_redis)

For the last two caches, the options that they take are the same options that their respective docs list out. In other words, I basically export wrappers that takes in the options and just passes it to the actual cache client.

```javascript
import { Kayn, REGIONS, METHOD_NAMES, BasicJSCache, LRUCache, RedisCache } from 'kayn'

const redisCache = new RedisCache({
    host: 'localhost',
    port: 5000,
    keyPrefix: 'kayn',
    password: 'hello-world',
    // etc...
})

const lruCache = new LRUCache({
    max: 500,
    dispose: (key, value) => {},
    length: (value, key) => 1,
    // maxAge intentionally is disabled
})

const basicCache = new BasicJSCache()

const myCache = redisCache // or basicCache/lruCache

const kayn = Kayn(/* optional key */)({
    region: 'na',
    locale: 'en_US',
    debugOptions: {
        isEnabled: true,
        showKey: false,
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 1000,
    },
    cacheOptions: {
        cache: myCache,
        timeToLives: {
            useDefault: true,
            byGroup: {
                DDRAGON: 1000 * 60 * 60 * 24 * 30, // cache for a month
            },
            byMethod: {
                [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME]: 1000, // ms
            },
        },
    },
})

kayn.Summoner.by
    .name('Contractz')
    .then(() => kayn.Summoner.by.name('Contractz'))

/*
200 @ https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/Contractz
CACHE HIT @ https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/Contractz
*/
```

### TTLs???

Check out `Enums/default-ttls` and `Enums/method-names` to find the constants that you can use as keys within `byGroup` and `byMethod`.

Here is the order in which ttl's resolve (highest-priority first):
1. byMethod
2. byGroup
3. useDefault

Note that if you're using the `ttls` prop before v0.8.9, you're perfectly fine. `ttls` is the source of truth, and has the highest priotity over the above 3 ways.

#### byMethod

`byMethod` takes pairs of `Enums/method-names`, which are just unique (string-type) identifiers and the ttl value you desire.

```javascript
cacheOptions: {
    timeToLives: {
        byMethod: {
            [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME]: 1000,
        }
    }
}

// Same as passing this:
// 'SUMMONER.GET_BY_SUMMONER_NAME': 1000,
// Constants just help for auto-complete.
```

#### byGroup

`byGroup` takes pairs as well. The key difference is that it follows how Riot groups their API methods on their developer interface. You can check `Enums/method-names` once again to see how methods are grouped toegher.

`byGroup` has lower priority than `byMethod`. This as you'll see is flexible.

```javascript
cacheOptions: {
    timeToLives: {
        byGroup: {
            MATCH: 60 * 60 * 24 * 30, // 30 days
        }
        byMethod: {
            [METHOD_NAMES.MATCH.GET_MATCHLIST]: 1000,
        }
    }
}

// Enums/method-names
/*
const MATCH = {
    GET_MATCH: 'MATCH.GET_MATCH',
    GET_MATCHLIST: 'MATCH.GET_MATCHLIST',
    GET_RECENT_MATCHLIST: 'MATCH.GET_RECENT_MATCHLIST',
    GET_MATCH_TIMELINE: 'MATCH.GET_MATCH_TIMELINE',
    GET_MATCH_IDS_BY_TOURNAMENT_CODE: 'MATCH.GET_MATCH_IDS_BY_TOURNAMENT_CODE',
    GET_MATCH_BY_TOURNAMENT_CODE: 'MATCH.GET_MATCH_BY_TOURNAMENT_CODE',
}
*/
```

What this does is set the cache ttl of every single one of the above match method to 30 days. However, since `byMethod` has higher priority, we are then able to overwrite the `Matchlist.by.accountID` ttl, making it only be cached for a second instead.

This is good because the other match methods rarely change, while matchlists can change every 20 minutes.

#### useDefault

Simply set `useDefault` in `timeToLives` to true. This option basically sets ttls I thought made some sense. `useDefault` has the lowest priority, which means you can set it to `true`, and then overwrite it on a case-by-case basis using `byGroup` and `byMethod`.

### Flushing the Cache

```javascript
// BasicJSCache O(1)
// synchronous
kayn.flushCache()
// this has been turned into a promise so that it can be chained.
// still can just be called normally though.
// the `data` parameter returns "OK" just like in the RedisCache.
async1
  .then(() => kayn.flushCache())
  .then(console.log) // prints OK always. there's no way to get an error.
  .catch(console.err)

// RedisCache O(N)
// asynchronous
kayn.flushCache(function (err, ok) {
  console.log(ok === "OK")
})

const flush = async () => {
  try {
    await kayn.flushCache() // returns "OK", but not really necessary to store.
  } catch (exception) {
    console.log(exception)
  }
}

async1
  .then(() => async2())
  .then(() => kayn.flushCache())
  .then(console.log)
  .catch(console.log)
```
## Debug Options

### showKey

When logging, URLs printed out on the screen will also have the API key query string attached to it, allowing the user to conveniently inspect the response if necessary.

### loggers

`kayn` now uses [debug](https://www.npmjs.com/package/debug) for all logging purposes.

Here are the current namespaces:

kayn
  * init
  * request
    * incoming
      * success
      * error
    * outgoing
  * cache
    * set
    * get

To enable debugging, firstly make sure `config.debugOptions.isEnabled` is `true`. Then, run your program with the desired DEBUG environment variables.

For example, if you wish to only see the request errors (404, 420, 503, 500, etc), run:

```sh
DEBUG=kayn:request:incoming:error <command>
# DEBUG=kayn:*:error works too.
```

...where command runs the script/server/whatever (`npm run start`, `yarn start`, `node index.js`).

To enable all loggers, simply run:
```sh
DEBUG=kayn:* <command>
```

# My Project

If you're interested in what I have built using this library, here's a small web application I made, along with the original reddit post.

One Tricks:
* site: http://onetricks.net
* reddit link: https://www.reddit.com/r/leagueoflegends/comments/5x1c5c/hi_i_made_a_small_website_to_compile_a_list_of/
* src: https://github.com/cnguy/OneTricks

Here are the requests stats for anyone interested.

Note that my requests stats are inflated since I'm not really caching at the moment (lol).

![Alt text](/_pictures/number_of_requests.png?raw=true "onetricks.net")

![Alt text](/_pictures/status_codes.png?raw=true "onetricks.net")

# Bugs

Feel free to make an issue (bug, typos, questions, suggestions, whatever) or pull request to fix an issue. Just remember to run `prettier` (via `yarn lint`).

Package commands:

* `yarn lint`
for `prettier` (will add `eslint` to `prettier` soon)
* `yarn example`
to run the various files in `./examples`
* `yarn build`
to build. `yarn example` runs this command
* `yarn test`

## General Workflow

Here's my general workflow when it comes to `kayn`.

Note: You don't have to worry about editor configuration as long as you follow the steps.

* If possible, create a unit test (make more if applicable)
* Set `describe.only` on your test(s)
* Run `yarn test` to make sure test is failing
* Write implementation and run `yarn test` on completion
* You can manually test requests in `example.js` using your own API key
    * Preferrable just to use a .env file with kayn's default key (RIOT_API_KEY)
    * Run `yarn example` and verify behavior manually
* Remove `describe.only` from your tests and run the entire test suite
* When tests pass and manual testing went well, run `yarn lint`
* Commit and push! For forks, make sure you check out a new branch

# Changelog

[CHANGELOG.md](https://github.com/cnguy/kayn/blob/master/CHANGELOG.md).

As long this library is pre-1.0.0, breaking changes may be made, but will be documented and will generally not be drastic. Upon 1.0.0, SemVer will be followed strictly.

# Disclaimer

`kayn` isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.

# FAQ

## My requests seem to take a long time.

You are most likely using the default `spread` rate limiting strategy, which spreads out your requests over rate limit periods.

Set `requestOptions.burst` to `true` to burst your requests instead.

## I'm getting (a lot of) 429's.

If you're getting 429's, you're most likely processing huge amounts of requests that probably needs to be broken into smaller pieces (while also setting `requestOptions.burst` to `false`), needs effective caching, and/or requires a more powerful, but smaller library like [riot-lol-api](https://github.com/Neamar/riot-lol-api), which also happens to be made by a Riot employee IIRC. [TeemoJS](https://github.com/MingweiSamuel/TeemoJS) would probably work well too!

Occasionally, if `requestOptions.burst = true`, the rate limiter may get out of sync if you're running thousands of concurrent requests (like [onetricks.net](onetricks.net) when building stats), which can cause 429's that will propagate until you're blacklisted.

It is thus ideal to use the `spread` strategy when working on apps that process a ton of requests because there is a much lower risk of getting a 429. However, for small or dev scripts, bursting your requests is a lot better.

# External Links

* [Batching Node.js Asynchronous Requests via Promises using Riot League of Legends API](http://chau.codes/batching-node-js-asynchronous-requests-via-promises-using-riot-league-of-legends-api/)
