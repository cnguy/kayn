# 0.8.22

* Add automatic version handling that works off your default region
* Add automatic version handling that can be extracted from the region passed to `region()`
* Remove Static-related code from type definitions

# 0.8.21

* Throw an error if no `version` is provided to `DDragon` `data` methods (listing champions, runes,etc). This should help out users in case if they don't read all the docs

# 0.8.20 (BREAKING if you have anything related to Static endpoints)

* Remove all static endpoints

# 0.8.19

* Add various new endpoints

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
		"226": {
      ...
			"id": "266",
			"key": "Aatrox"
		}
	}
}
```

These functions are cached differently from the actual HTTP functions too.

# 0.8.18

* Add ChampionRotationEndpoint (no types yet; cache supported)
* Add deprecation warnings to ChampionEndpoint (get/list)
* Fix DDragon logging issues

# 0.8.17

* Add default `locale` option that can be passed to config
* Add following DDragon methods, along with caching and debugging:
  * Champion
    * get
    * list
    * listFull
  * Item
    * list
  * Language
    * list
  * LanguageString
    * list
  * Map
    * list
  * ProfileIcon
    * list
  * Realm
    * list
  * RunesReforged
    * list
  * SummonerSpell
    * list
  * Version
    * list

Things not handled yet:
* ~~Optional version via automatic versoin grabbing. Should respect cache options~~ Not possible because regions can have different versions?
* Tarball tgz or link (not sure what the use case is yet)
* Rune (do we need this anymore)
* Mastery (do we need this anymore)
* TS types (will be added in subsequent releases)
* cdn/Images? ddragon provides img urls too (is this necessary)

# 0.8.16

* Add deprecation warnings to static endpoint methods.

# 0.8.15

* (breaking) Make force-quitting application on 403 configurable.
 Also set the default behavior from `true` to `false`.

# 0.8.14

* Move typings into scope (some of the typings were declared outside of the actual 'kayn' module).
* Strengthen some typings while cleaning up others.

# 0.8.13

* (non-breaking) Replace Matchlist.Recent implementation with regular matchlist query.

# 0.8.12

* Allow more redis options by just passing the user-defined object straight into redis.createClient().

# 0.8.11

* Fixed BasicJSCache setting of expiry timers. I used seconds instead of milliseconds.
* Add [lru-cache](https://www.npmjs.com/package/lru-cache).

# 0.8.10

* kayn's errors now have an additional prop called 'error' that has the rest of the error object besides statusCode and url.
* Add static RunesReforged, RunePathsReforged, and TarballLinks endpoints, along with the type definitions.
* Add API deprecation endpoint to 'getting recent matchlist*. However, even after this officially gets deprecated on April 27th, 2018, the function will still be implemented via the 'get matchlist' endpoint.

# 0.8.9

* Add `cacheOptions.timeToLives.{useDefault, byGroup, byMethod}`.

# 0.8.8

* Remove Leagues.by.summoner related code.

# 0.8.7 (BREAKING, but simple)

* An error object as shown below is now returned instead of a single number.

```javascript
{
    statusCode: 42, // the error code
    url: '', // the debug URL (works with and without showKey)
}
```

More information will be provided in the future if there is demand. The URL is quite important for debugging if the users do not want to run debug commands and see other debugging information (even if namespaced very specifically), so I'm releasing this first.

**Migration**

This part is simple. If you're in an environment where destructuring is supported, simply destructure the parameter while renaming the parameter to `statusCode`.

```javascript
oldErrorHandler(myCode) { /* do something with code */ }

// should become

newErrorHandler({ statusCode }) { /* statusCode is same as the parameter in `oldErrorHandler` */ }

// To then grab the URL for quick checking, you can then do:
finalErrorHandler({ statusCode, url }) {}

// Otherwise, if you can't destructure, just declare the variable you need at the top by accessing the object.
myOldErrorHandler(error) {
    const myErrorCodeNumber = error.statusCode
    /*


    a lot of code blahblahblah


    */
    const oldCodeThatHandlesError = doSomething(myErrorCodeNumber)
}
```

# 0.8.6

* Add `regionNoThrow` method. This is similar to `.region()` except it does not throw and simply falls back to default on error (.region() falls back in this manner too).

# 0.8.5

* Loggers should not show key unless showKey=true.

# 0.8.4

* Move riot-ratelimiter fork dependency from GitHub to npm for obvious reasons. This is temporary!! TournamentStub/Tournament requests shouldn't throw JSON errors anymore, and existing methods should still work.

# 0.8.3

* Update TypeScript definitions via `yarn swagger`. Basically, the Tournament Params for summoner ids/participants were removed and replaced with a simple number array.

# 0.8.2
https://github.com/cnguy/kayn/pull/44
* Add CurrentGame to index.d.ts.

# 0.8.1
* index.d.ts Kayn class => KaynClass to avoid duplicate name error.
* make config optional.

# 0.8.0
* Add full DTOs using Swagger and Tournament-related methods.

# 0.7.7
* Add Match tournament related methods (Match.Tournament.get and Match.Tournament.listMatchIDs).

# 0.7.6
* Add tournament endpoints.
* Add logging config on init.
* Make logging outcoming requests more explicit (e.g. [GET], [POST]).

# BETA: 0.7.5 / 0.7.4
* Bad tournament endpoint implementations.

# 0.6.4
* Add `debug` for proper logging.

# 0.5.3 (BREAKING?)
* Remove babel-polyfill, forcing users to use node with default async/await support (which might be recommended anyways?). I pretty much just have 1 async/await line, but who knows when I'll have more, so might as well get this fixed now.
* Upgrade riotratelimiter-node.

# 0.5.2
* Fixed `undefined` Redis setex() error when users did not pass in a TTL for a method and called that method. `kayn` should simply not attempt to cache if the ttl is not > 0.

# 0.5.1
* Add ThirdPartyCode to TypeScript and remove Runes

# 0.5.0
* Remove Runes/Masteries endpoints
* Add [Third Party Code endpoint](https://developer.riotgames.com/api-methods/#third-party-code-v3/GET_getThirdPartyCodeBySummonerId)

# 0.4.5
* Fix tests broken in 0.4.3 via DEEP merge. This makes the config always explicit as well. Read the commit message for more information.

# 0.4.4
* Skipped by accident. X)

# 0.4.3
* Add basic config validation

config.cache isn't checked, but everything else in the config is checked via [superstruct](https://github.com/ianstormtaylor/superstruct).

# 0.4.2
* Promisify flushCache.

# 0.4.1
* Update `riot-ratelimiter` dependency.

# 0.4.0
* FIXED RedisCache [option Option] bug (setex).
* Add flushCache, check README#Caching

# 0.3.0
* Add burst functionality

```javascript
requestOptions: {
    shouldRetry: true,
    burst: true,
}
```

# 0.2.9
* Encode Summoner.by.name values

# 0.2.8
* Fix the TypeScript METHOD_NAMES export

# 0.2.7
* This isn't backward compatible, but it's fine. `League.by.id` has been changed to `League.by.uuid`. Now takes a string instead of an int of course.

# 0.2.6
* Minor TypeScript fixes

# 0.2.5
* Add basic TypeScript support

# 0.1.5
* Update dependencies
    * RiotRateLimiter node from 0.0.7 to 0.0.9
    * Use babel-present-env instead of babel-preset-es2015

# 0.1.4
* Implement `/lol/match/v3/matchlists/by-account/{accountId}` through Matchlist.recent(summonerID: int)
* Implements `/lol/league/v3/leagues/{leagueID}` through League.by.id(leagueID: int)

# 0.0.1-0.0.4
Initial release
