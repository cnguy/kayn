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
                champion: 67,
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
</details>

# Table of Contents:
* [Features](#features)
* [Methods](#methods)
* [Installation & Usage](#installation-and-usage)
* [Configuration](#configuration)
* [My Project](#my-project)
* [Bugs / Changelog / Disclaimer](#bugs)
* [FAQ](#faq)

# Features

## Rate Limiting

Handled by [Colorfulstan](https://github.com/Colorfulstan)'s wonderful [riot-ratelimiter](https://github.com/Colorfulstan/RiotRateLimiter-node).

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

```javascript
kayn.Matchlist.by.accountID(3440481)
    .region(REGIONS.KOREA)
    .query({
        champion: 67,
        season: 9,
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

# Configuration

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

This optoin will force the process to quit if your API key is blacklisted or invalid.

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
                STATIC: 1000 * 60 * 60 * 24 * 30, // cache for a month
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

# Changelog

[CHANGELOG.md](https://github.com/cnguy/kayn/blob/master/CHANGELOG.md).

As long this library is pre-1.0.0, breaking changes may be made, but will be documented and will generally not be drastic. Upon 1.0.0, SemVer will be followed strictly.

# Disclaimer

`kayn` isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.

# FAQ

## My requests seem to take a long time.

You are most likely using the default `spread` rate limiting strategy, which spreads out your requests over rate limit periods.

Set `requestOptions.burst` to `false` to burst your requests instead.

## I'm getting (a lot of) 429's.

If you're getting 429's, you're most likely processing huge amounts of requests that probably needs to be broken into smaller pieces (while also setting `requestOptions.burst` to `false`), needs effective caching, and/or requires a more powerful, but smaller library like [riot-lol-api](https://github.com/Neamar/riot-lol-api), which also happens to be made by a Riot employee IIRC. [TeemoJS](https://github.com/MingweiSamuel/TeemoJS) would probably work well too!

Occasionally, if `requestOptions.burst = true`, the rate limiter may get out of sync if you're running thousands of concurrent requests (like [onetricks.net](onetricks.net) when building stats), which can cause 429's that will propagate until you're blacklisted.

It is thus ideal to use the `spread` strategy when working on apps that process a ton of requests because there is a much lower risk of getting a 429. However, for small or dev scripts, bursting your requests is a lot better.
