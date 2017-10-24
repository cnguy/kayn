An elegant way of querying League of Legend's API. `kayn` is a reimplementation of `kindred-api`.

[![NPM](https://nodei.co/npm/kayn.png)](https://nodei.co/npm/kayn/)

[![Build Status](https://travis-ci.org/cnguy/kayn.svg?branch=master)](https://travis-ci.org/cnguy/kayn)
[![codecov](https://codecov.io/gh/cnguy/kayn/branch/master/graph/badge.svg)](https://codecov.io/gh/cnguy/kayn)
[![dependencies Status](https://david-dm.org/cnguy/kayn/status.svg)](https://david-dm.org/cnguy/kayn)




Wiki is not updated. It currently is documentation about the old `kindred-api`.

# Table of Contents:
* [Why](#why)
* [Documentation](#documentation)
* [Installation](#installation)
* [Features](#features)
* [Planned Features](#planned-features)
* [Basic Usage / How to Initialize](#basic-usage)
* [Current API](#current-api)
    * [Request Naming Conventions](#request-naming-conventions)
    * [Setting the Region of a Request](#setting-the-region-of-a-request)
    * [Adding Query Parameters to a Request](#adding-query-parameters-to-a-request)
    * [Promises](#promises)
    * [Await](#await)
    * [Callbacks](#callbacks)
    * [High-level Overview of API](#high-level-overview-of-api)
* [Caching](#caching)
* [TypeScript](#typescript)
* [Bugs](#bugs)
* [Changelog](#changelog)
* [Disclaimer](#disclaimer)

# Why

So I decided to come back to rewrite this `kindred-api` (API looks the same, but trust me your old code will not remotely work) since the code really bothered me, and I have a lot of time now (I quit work). Better code => more likely to not ditch it later.

# Documentation

Still under construction!

ESDoc -http://kayn.surge.sh/

# Installation

```sh
yarn add kayn
```

# Features

* [Rate limiting](https://github.com/Colorfulstan/RiotRateLimiter-node) 
* All regular endpoints implemented
* Basic caching (in memory cache, redis cache)
* API works with both callbacks & promises
* Basic TypeScript support (WIP)

# Planned Features

## Whenever

* Tournament
* DDragon

# Basic Usage

When you import the Kayn class,

```javascript
const { Kayn } = require('kayn');
```

you're actually importing the `init` function.

```javascript
const init = key => config => {
  return new Kayn(key, config);
};
```

This means you don't have to construct the object using `new`. Furthermore, `init` will automatically look for a `.env` file that has the key-value pair below:

```sh
# .env
RIOT_LOL_API_KEY=<key>
```

Using this is preferable as you generally don't commit `.env` files to GitHub.

```javascript
const {
  Kayn,
  REGIONS,
  METHOD_NAMES,
  BasicJSCache,
  RedisCache,
} = require('kayn');

// to initialize Kayn without a .env file
// const Kayn = Kayn('mykey')()
// notice the second parentheses is mandatory because
// init exports a second function
// that takes in an optional config

const kayn = Kayn('my-optional-key')({
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
    cache: null,
    ttls: {}, 
  },
});

// above are the default configs
// if you pass in a config,
// the rest of the top-level config will be used
// ex: if you pass in just debugOptions to disable it,
// requestOptions and the (empty) cacheOptions will be used 

  kayn.Summoner.by
    .name('Contractz')
    .region('na') // if this is not appended, default region is used
    .callback(function(err, summoner) {
      if (err) {
        console.log('could not get summoner');
      } else {
        console.log('got the summoner data');
        console.log('will try to get number of matches');
        kayn.Matchlist.by
          .accountID(summoner.accountId)
          .region('na')
          .query({ season: 9 })
          .query({ champion: 67 })
          .callback(function(err, matchlistDTO) {
            if (err) {
              console.log('matchlist error');
            } else {
              console.log('callback style meh');
              console.log(
                'number of matches callback style:',
                matchlistDTO.matches.length,
              );
            }
          });
      }
    });

  kayn.Summoner.by
    .name('Contractz')
    .region(REGIONS.NORTH_AMERICA)
    .then(summoner => {
      return kayn.Matchlist.by
        .accountID(summoner.accountId)
        .query({ season: 9 });
    })
    .then(matchlistDTO => {
      console.log('number of matches:', matchlistDTO.matches.length);
    })
    .catch(err => console.error(err));

  kayn.Summoner.by
    .name('Contractz')
    .then(summoner => {
      return kayn.Runes.by.summonerID(summoner.id);
    })
    .then(runes => {
      console.log('number of rune pages:', runes.pages.length);
    })
    .catch(err => console.error('runes error'));

```

Check `example.js` and the files in the `recipes` directory (they're more just random composition of functions lol) for more usage.

# Current API

`kayn` methods do not take `region`, `query`, or `callback` arguments like in `kindred-api` and other libraries. As of now, the maximum amount of arguments a `kayn` method can take is 1, with one exception (ChampionMastery.get, which takes 2). You'll see why later below.

`kayn`'s api is reliant on regions instead of platform ids. Regions are transformed to platform ids within the code wherever necessary.

## Request Naming Conventions 

`get`: to target and grab something specific, where the parameters are also easy to guess (Match.get would be grabbing a match via its match id). However, runes/matchlist take different arguments (summoner id vs account id), and so they use the `by.xxx` naming below.

`list`: to list out something (e.g. a list of champions, a list of challengers, etc).

`by.xxx`: `by.summonerName`, `by.accountID`, `by.summonerID` is everywhere necessary (e.g. `Matchlist.by.accountID`, `Runes.by.summonerID`). It's explicit for `Matchlist`, `Masteries`, etc to make the call much more clear. However, the `Summoner` namespace simply uses `name`, `id`, and `accountID`. I have not added extra methods like `Matchlist.by.summonerName` yet. This naming makes the request parameter guessable.

## Setting the Region of a Request

Append `.region(regionAbbr)` to a call to set the region. If no region is appended, then we use the default region which is `na` or whatever the user passed in.

```javascript
kayn.Summoner.by.name('Faker').region('kr')
```

## Adding Query Parameters to a Request

Append `.query(key->value)` to a call to add a query. A query is just a regular JavaScript object. Therefore, you can either chain multiple query parameters together, or pass in a whole blob at once.

```javascript
const config = {
    season: 7,
    champion: 67,
    queue: 420,
}

kayn.Matchlist.by.accountID(accountID).query(config)

kayn.Matchlist.by.accountID(accountID)
    .query({ season: 7 })
    .query({ champion: 67 })
    .query({ queue: 420 })
```

## Promises

All `kayn` methods support promises. 

```javascript
const promise = kayn.Summoner.by.name('Contractz')
promise
    .then(data => console.log(data))
    .catch(err => console.error(err))
```

## Await

Naturally, you can `await` any method as long as you have not called `.callback`.

```javascript
const main = async () => {
    try {
        const summoner = await kayn.Summoner.by.name('Contractz')
    } catch (ex) {
        console.error(ex)
    }
}
```

## Callbacks

This is simply a renaming of `superagent`'s `end` method. As stated before, `kayn` methods do not have callback parameters.

However, passing in callbacks is still trivial. This is similar to how `region` and `query` are set as well (thanks `superagent`).

```javascript
const printBoth = (err, data) => console.log(err, data)
kayn.Summoner.by.name('Contractz').callback(printBoth)
```

## High-level Overview of API

This is all (both endpoints & methods) in the same order as in the official docs.

Note that the API is not fully consistent. I wanted the API to be readable & easy-to-use-without-documentation, but still be somewhat terse, and so exceptions had to be made for now.

Also note that there is not a one-to-one mapping between namespaces/methods & the official endpoints/resources -- This API somewhat mirrors `kindred-api` in that I separated some resources to make it more convenient for the user (`Matchlist`, `CurrentGame`, and `FeaturedGames` are some examples of this, as `Matchlist` actually belongs to `Match`, and `CurrentGame` and `FeaturedGames` both belong to `Spectator`).

```javascript
/* CHAMPION-MASTERY-V3 */
ChampionMastery.list(summonerID: int)
ChampionMastery.get(summonerID: int)(championID: int)
ChampionMastery.totalScore(summonerID: int)

/* CHAMPION-V3 */
Champion.list()
Champion.get(championID: int)

/* LEAGUE-V3 */
Challenger.list(queueName: string)
Leagues.by.summonerID(summonerID: int)
League.by.uuid(leagueUUID: string)
Master.list(queueName: string)
LeaguePositions.by.summonerID(summonerID: int)

/* LOL-STATIC-DATA-V3 */
Static.Champion.list()
Static.Champion.get(championID: int)
Static.Item.list()
Static.Item.get(itemID: int)
Static.LanguageString.list()
Static.Language.list()
Static.Map.get()
Static.Mastery.list()
Static.Mastery.get(masteryID: int)
Static.ProfileIcon.list()
Static.Realm.get()
Static.Rune.list()
Static.Rune.get(runeID: int)
Static.SummonerSpell.list()
Static.SummonerSpell.get(summonerSpellID: int)
Static.Version.list()

/* LOL-STATUS-V3 */
Status.get()

/* MASTERIES-V3 */
Masteries.by.summonerID(summonerID: int)

/* MATCH-V3 */
Match.get(matchID: int)
Matchlist.by.accountID(accountID: int)
Matchlist.Recent.by.accountID(accountID: int)
Match.timeline(matchID: int)

/* RUNES-V3 */
Runes.by.summonerID(summonerID: int)

/* SPECTATOR-V3 */
CurrentGame.by.summonerID(summonerID: int)
FeaturedGames.list()

/* SUMMONER-V3 */
Summoner.by.name(summonerName: string)
Summoner.by.id(summonerID: int)
Summoner.by.accountID(accountID: int)
```

# Caching

To cache, firstly create some Cache that has a get/set function, and then pass it to `cacheOptions.cache`.

`ttls` are method ttls. This part is pretty inconvenient right now. Suggestions are welcome.

Current caches:
* basic in-memory cache 
* Redis cache

```javascript
import {
    Kayn,
    REGIONS,
    METHOD_NAMES,
    BasicJSCache,
    RedisCache,
} from 'kayn';

const redisCache = new RedisCache({
  host: 'localhost',
  port: 5000,
  keyPrefix: 'kayn',
})

const basicCache = new BasicCache();

const myCache = redisCache; // or basicCache

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
});

kayn.Summoner.by.name('Contractz').then(() => kayn.Summoner.by.name('Contractz'));

/*
200 @ https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/Contractz
CACHE HIT @ https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/Contractz
*/
```

# TypeScript

TypeScript support should automatically be integrated upon requiring this module.

source: [index.d.ts](https://github.com/cnguy/kayn/blob/master/typings/index.d.ts)

This will be improved over time.

`any`'s should be removed
enums gotta get fixed

# Bugs

Feel free to make an issue (bug, typos, questions, suggestions, whatever) or pull request to fix an issue. Just remember to run `prettier` (via `yarn lint`).

Currently, there are no tests. A lot of the code has already been tested in `kindred-api`, and due to the fact that this libary now relies on a 3rd party rate limiter, it has become much less time consuming to test the API. Also, due to the new `Request` interface (using `superagent`'s API), I no longer have to spend time testing various functions and their various parameters.

Tests will be added regardless though over time.

Expect a few bugs here and there because I rapidly rewrote this (it wasn't hard to using the `Request` class I made).

Package commands:

* `yarn lint`
for `prettier` (will add `eslint` to `prettier` soon)
* `yarn example`
to run the various files in `./examples`
* `yarn build`
to build. `yarn example` runs this command
* `yarn test`
does not exist atm

# Changelog

Go to [CHANGELOG.md](https://github.com/cnguy/kayn/blob/master/CHANGELOG.md).

# Disclaimer

`kayn` isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.