# 0.10.1

* Add `apiURLPrefix` to config, which allows developers to set a URL for testing or update the URL when necessary (if lib hasn't been updated)

# 0.10.0 (breaking for TypeScript users)

* (BREAKING) TypeScript: Rename all types named 'SomeObjectDto' -> 'SomeObjectDTO' to be consistent
* TypeScript: Add new DDragon typings

# 0.9.11

Fixes:

* Fix TS support by removing random DDragonRequest import in `index.d.ts` entry point

# 0.9.10 (BREAKING)

Removals:

* Deprecate position ranking-related endpoints as per Riot's [instructions](https://www.riotgames.com/en/DevRel/riot-api-update-190417). Stay on v0.9.9 if you need time

Feats:

* Upgrade package.json requirements for `dotenv`, `supports-color`, and `lru-cache`

Notes:

After releasing, I noticed that TS support is messed up because of a random JavaScript import, probably from my editor. This will be fixed in `v0.9.11`.

# 0.9.9

Feats:
* Add `/lol/league/v4/entries/by-summoner/{encryptedSummonerId}`
* Add `/lol/league/v4/entries/{queue}/{tier}/{division}`
* Add typings for above
* Update DDragon endpoints to return `KaynDDragonRequest<any>`, which has basic typings

Notes:
* Did not remove other June 17th endpoints yet

# 0.9.8

Feats:
* Add `/lol/league/v4/positional-rank-queues`
* Add `/lol/league/v4/positions/{positionalQueue}/{tier}/{division}/{position}/{page}`

Fix:
* Remove no longer necessary deprecation warning

# 0.9.7 (REMOVE ALL V3, nonbreaking to V4)

Fixes:
* Replace all V3 namespaces with V4 namespaces (while keeping the V4 namespaces)*
* Update typings

Notes:
* All previous namespaces now use the V4 namespaces, which means it won't break your code
  * e.g. `kayn.Summoner` calls `kayn.SummonerV4`, and `kayn.SummonerV4` still calls the V4 API

# 0.9.6

Fixes:
* Move V4 warning to `initLogger`
* Hide "creating sync rate limiter" with updated `riot-ratelimiter-tmp`

# 0.9.5

* Revert rate limiter dependency (downgrade) for now due to this [issue](https://github.com/cnguy/kayn/issues/62)

# 0.9.4

* Upgrade riot-rate-limiter fork
  * Fixes hanging issue: https://github.com/Colorfulstan/RiotRateLimiter-node/pull/13
  * Also removes the "Creating sync ratelimiter..." messages that are meant for debug mode
* Update deprecation warning to [1/28/2019](https://www.riotgames.com/en/DevRel/player-universally-unique-identifiers-and-a-new-security-layer)

# 0.9.3 (possibly breaking for TypeScript V2 users)

* Upgrade TypeScript to latest (v3.2.2) and fix bindings for the upgrade

# 0.9.2

* Fix DDragonRequest [case](https://github.com/cnguy/kayn/issues/60) where a cache is not used and the version is unspecified / implicit

# 0.9.1

* Add `TournamentV4` and `TournamentStubV4`
* Add TypeScript bindings for V4 endpoints and finish up incomplete METHOD_NAMES

# 0.9.0

* Add `ChampionMasteriesV4`, `LeagueV4`, `MatchV4`, `SpectatorV4`, `SummonerV4`, `ThirdPartyCodeV4`

## Notes:
* No types
* No `TournamentStubV4`, `TournamentV4` 

The above will be added in the next version! Just need to release the core endpoints first for everyone. :)

## Migration:

All the V3 endpoints still work until the deprecation date. Riot did not change the field names of `accountId` and `id`, even though they are encrypted, which makes the developer do less work fortunately.

I think the easiest thing most developers can do is updating all their summoner V3 objects to V4:

https://github.com/cnguy/kayn/blob/v4/examples/async.await/helper-for-updating-summoner-to-v4.js

This code uses a mock database to update a bunch of random summoners to V4, with their regions intact. Your database objects may be shaped differently, but the flow is probably somewhat similar.

# 0.8.26

* Updated the following packages: `debug`, `dotenv`, `superstruct`

Does not affect `kayn` in any noticeable way

# 0.8.25

* Add deprecation warnings regarding V3 endpoints on initialization

# 0.8.24

* Remove deprecated champion endpoints
* Add new namespace `Champion.Rotation`

I made a mistake when I implemented the champion rotation endpoint. It's part of the champion endpoints and so it should have been under the `Champion` namespace instead. However, I'll keep both for now since this isn't really a big deal.

* Types
  * Regenerate dto typings (champion and static data dtos are removed)
  * Remove extra champion endpoint typings and add `Champion.Rotation` typing

# 0.8.23

* Fixed bug regarding interaction between implicit versioning and helper methods such as `kayn.DDragon.Champion.listDataById()`

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
