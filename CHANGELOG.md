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
