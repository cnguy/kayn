# 0.8.2
https://github.com/cnguy/kayn/pull/44
* Add CurrentGame to index.d.ts

# 0.8.1
* index.d.ts Kayn class => KaynClass to avoid duplicate name error
* make config optional

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
