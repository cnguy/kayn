A small library to work with Riot's League of Legend's API.

[![NPM](https://nodei.co/npm/kayn.png)](https://nodei.co/npm/kayn/)

[![Build Status](https://travis-ci.org/cnguy/kayn.svg?branch=master)](https://travis-ci.org/cnguy/kayn)
[![codecov](https://codecov.io/gh/cnguy/kayn/branch/master/graph/badge.svg)](https://codecov.io/gh/cnguy/kayn)
[![dependencies Status](https://david-dm.org/cnguy/kayn/status.svg)](https://david-dm.org/cnguy/kayn)

# Table of Contents:
* [Features](#features)
* [Installation & Usage](#installation-and-usage)
* [Configuration](#configuration)
* [My Project](#my-project)
* [Bugs / Changelog / Disclaimer](#bugs)

# Features

## Rate limiting

Handled by [riot-ratelimiter](https://github.com/Colorfulstan/RiotRateLimiter-node).

## Most endpoints covered

Check out [COVERAGE.md](https://github.com/cnguy/kayn/blob/master/COVERAGE.md) to see the League of Legends API endpoints side-by-side with `kayn`'s methods.

## Caching

Currently supports a basic JS cache (for simple scripts) and Redis for anything more complicated.

## Compatible with Callbacks, Promises, Async / Await

## Basic TypeScript support

Works immediately upon installation.

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
        loggers: {},
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 1000,
        burst: false,
    },
    cacheOptions: {
        cache: null,
        ttls: {},
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
    .catch(error => console.error(error))
```

### Async / Await

```javascript
const main = async () => {
    const ctz = await kayn.Summoner.by.name('Contractz')
}
```

### Region 

This forces a request to target a specific region instead of the default region set in `kayn`'s config.

```javascript
kayn.Summoner.by.name('hide on bush')
    .region(REGIONS.KOREA)
    .callback(function(error, summoner) {
        doSomething(summoner)
    })
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

### Documentation

The auto-generated ESDoc documentation can be found [here](http://kayn.surge.sh).

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

## Cache Options

To cache, firstly create some Cache that has a get/set function, and then pass it to `cacheOptions.cache`.

`ttls` are method ttls. This part is pretty inconvenient right now. Suggestions are welcome.

Current caches:
* basic in-memory cache 
* Redis cache

```javascript
import { Kayn, REGIONS, METHOD_NAMES, BasicJSCache, RedisCache } from 'kayn'

const redisCache = new RedisCache({
    host: 'localhost',
    port: 5000,
    keyPrefix: 'kayn',
})

const basicCache = new BasicCache()

const myCache = redisCache // or basicCache

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
        ttls: {
            [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME]: 1000, // ms
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

### Flushing the Cache

```javascript
// BasicJSCache O(1)
// synchronous
kayn.flushCache();
// this has been turned into a promise so that it can be chained.
// still can just be called normally though.
// the `data` parameter returns "OK" just like in the RedisCache.
async1
  .then(() => kayn.flushCache())
  .then(console.log) // prints OK always. there's no way to get an error.
  .catch(console.err);

// RedisCache O(N)
// asynchronous
kayn.flushCache(function (err, ok) {
  console.log(ok === "OK");
});

const flush = async () => {
  try {
    await kayn.flushCache(); // returns "OK", but not really necessary to store.
  } catch (exception) {
    console.log(exception);
  }
}

async1
  .then(() => async2())
  .then(() => kayn.flushCache())
  .catch(console.log);
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

Note that my requests stats are a bit inflated because I've experimented with different season data, and also forgot to cache getMatchlist calls early on.

![Alt text](/_pictures/number_of_requests.png?raw=true "onetricks.net")

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