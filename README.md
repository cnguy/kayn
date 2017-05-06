# Kindred
Kindred is a Node.js wrapper with built-in rate-limiting (enforced per region), caching (in-memory and Redis), and parameter checking on top of [Riot's League of Legends API](http://www.developer.riotgames.com).

## Table of Contents
* [Core Features](#core-features)
* [Philosophy](#philosophy)
* [Installation](#installation)
* [Endpoints Covered](#endpoints-covered)
* [Quickstart](#quickstart)
* [Detailed Usage](#detailed-usage)
* [Rate Limiter](#rate-limiter)
* [Caching](#caching)
* [Ugly Object Parameters: Extending the Libary](#ugly)
* [Contributing and Issues](#contributing-and-issues)

## Core Features
* All standard endpoints covered but tournament endpoints.
* Supports both callbacks and promises.
* Rate limiter that is enforced per region and follows retry headers.
    * Retries on 429 and >= 500.
* Built-in parameter checks so you can hopefully refer to documentation less! :)
* Built-in caching (in-memory and Redis).
    * Customized expiration timers. You can set a timer for each endpoint type. Refer to [Caching](#caching) for more info.
* Designed to be simple but convenient. For example, you can call an exclusively by-id endpoint (such as grabbing the runes of a player) with just the name.

## Philosophy
My goal is to make a wrapper that is simple, sensible, and consistent. This project is heavily inspired by [psuedonym117's Python wrapper](https://github.com/pseudonym117/Riot-Watcher). Look at the [Quickstart Section](#quickstart) to see what I mean.

## Installation
```
yarn add kindred-api
// or npm install kindred-api
```

## Endpoints Covered
All examples here should be able to be run alone individually.

Make sure to check the [official Riot Documentation](https://developer.riotgames.com/api-methods/) to see what query parameters you can pass in to each endpoint (through the options parameter)!

Note: All ```region``` parameters are **OPTIONAL**. All ```options``` parameters are **OPTIONAL** unless stated otherwise.

* [CHAMPION-MASTERY-V3](#champion-mastery)
* [CHAMPION-V3](#champion)
* [GAME-V1.3](#game)
* [LEAGUE-V3](#league)
* [LOL-STATUS-V3](#lol-status)
* [MASTERIES-V3](#masteries)
* [MATCH-V3](#match)
* [RUNES-V3](#runes)
* [SPECTATOR-V3](#spectator)
* [STATIC-DATA-V3](#static-data)
* [STATS-V1.3](#stats)
* [SUMMONER-V3](#summoner)
* [TOURNAMENT-V3](#tournament)

### Champion Mastery
[docs](https://developer.riotgames.com/api-methods/#champion-mastery-v3)

1. **/lol/champion-mastery/v3/champion-masteries/by-summoner/{summonerId}**
    * Get all champion mastery entries sorted by number of champion points descending. (RPC)
    * getChampMasteries({ region = this.defaultRegion, accountId/accId (int), id/summonerId/playerId (int), name (string), options (object) }, cb)
    * Namespaced Functions: *ChampionMastery.getChampionMasteries, ChampionMastery.getAll, ChampionMastery.all, Summoner.getChampionMasteries, Summoner.championMasteries*
    * Example 1: ```k.ChampionMastery.all({ accId: 47776491 }, KindredAPI.print)```
    * Example 2: ```k.ChampionMastery.all({ id: 20026563 }, KindredAPI.print)```
    * Example 3: ```k.ChampionMastery.all({ id: 20026563 }).then(data => console.log(data))```
2. **/lol/champion-mastery/v3/champion-masteries/by-summoner/{summonerId}/by-champion/{championId}**
    * Get a champion mastery by player id and champion id.(RPC)
    * getChampMastery({ region = this.defaultRegion, playerId (int), championId (int), options (object) }, cb)
    * Namespaced Functions: *ChampionMastery.getChampionMastery, ChampionMastery.get*
    * Example 1: ```k.ChampionMastery.get({ playerId: 20026563, championId: 203 }, KindredAPI.print)```
    * Example 2: ```k.ChampionMastery.get({ playerId: 20026563, championId: 203 }).then(data => console.log(data))```
3. **/lol/champion-mastery/v3/scores/by-summoner/{summonerId}**
    * Get a player's total champion mastery score, which is sum of individual champion mastery levels (RPC)
    * getTotalChampMasteryScore({ region = this.defaultRegion, accountId/accId (int), id/summonerId/playerId (int), name (string), options (object) }, cb)
    * Namespaced Functions: *ChampionMastery.getTotalChampMasteryScore, ChampionMastery.getTotalScore, ChampionMastery.totalScore, ChampionMastery.total, ChampionMastery.score, Summoner.getTotalChampionMasteryScore, Summoner.totalChampionMasteryScore*
    * Example 1: ```k.ChampionMastery.score({ id: 20026563 }, KindredAPI.print)```

### Champion
[docs](https://developer.riotgames.com/api-methods/#champion-v3)

1. **/lol/platform/v3/champions**
    * Retrieve all champions.
    * getChamps({ region, id (int), options (object) }, cb)
    * Namespaced Functions: *Champion.getChampions, Champion.getAll, Champion.all*
    * Example 1: ```k.Champion.all({ region: REGIONS.KOREA }, KindredAPI.print)```
2. **/lol/platform/v3/champions/{id}**
    * Retrieve champion by Id.
    * getChamp({ region, id/championId (int) }, cb)
    * Namespaced Functions: *Champion.getChampion, Champion.get*
    * Example 1: ```k.Champion.get({ championId: 67 }, KindredAPI.print)```
    * Example 2: ```k.Champion.get({ championId: 67 }).then(data => console.log(data))```
    * Example 3: ```k.Champion.get({ championId: 67, region: 'kr' }, KindredAPI.print)```

### Game
[docs](https://developer.riotgames.com/api-methods/#game-v1.3)

1. **/api/lol/{region}/v1.3/game/by-summoner/{summonerId}/recent**
    * Get recent games by summoner Id. (REST)
    * getRecentGames({ region, accountId/accId (int), id/summonerId/playerId (int), name (str) }, cb)
    * Namespaced Functions: *Game.getRecentGames, Game.getRecent, Game.recent, Game.get*
    * Example 1: ```k.Game.get({ summonerId: 20026563 }, KindredAPI.print)```
    * Example 2: ```k.Game.recent({ id: 20026563 }, KindredAPI.print)```

### League
[docs](https://developer.riotgames.com/api-methods/#league-v3)

1. **/lol/league/v3/challengerleagues/by-queue/{queue}**
    * Get the challenger league for a given queue.
    * getChallengers({ region, queue = 'RANKED_SOLO_5x5' } }, cb)
    * Namespaced Functions: *League.getChallengers, League.challengers*
    * Example 1: ```k.League.challengers(KindredAPI.print)```
    * Example 2: ```k.League.challengers({ region: 'na' }, KindredAPI.print)```
    * Example 3: ```k.League.challengers({ queue:'RANKED_FLEX_5x5' }, KindredAPI.print)```
2. **/lol/league/v3/leagues/by-summoner/{summonerId**
    * Get leagues in all queues for a given summoner ID.
    * getLeagues({ region, accountId/accId (int), id/summonerId/player/Id (int), name (str) }, cb)
    * Namespaced Functions: *League.getLeagues, League.leagues, League.get*
    * Example 1: ```k.League.getLeagues({ summonerId: 20026563 }, KindredAPI.print)```
    * Example 2: ```k.League.get({ summonerId: 20026563 }, KindredAPI.print)```
3. **/lol/league/v3/masterleagues/by-queue/{queue}**
    * Get the master league for a given queue.
    * getMasters({ region, queue = 'RANKED_SOLO_5x5' }, cb)
    * Namespaced Functions: *League.getMasters, League.masters*
    * Example 1: ```k.League.masters(KindredAPI.print)```
    * Example 2: ```k.League.masters({ region: 'na' }, KindredAPI.print)```
    * Example 3: ```k.League.masters({ queue:'RANKED_FLEX_5x5' }, KindredAPI.print)```
4. **/lol/league/v3/positions/by-summoner/{summonerId}**
    * Get league positions in all queues for a given summoner ID.
    * getLeaguePositions({ region, accountId/accId (int), id/summonerId/playerId (int), name (str) }, cb)
    * Namespaced Functions: *League.getLeaguePositions, League.getPositions, League.positions*
    * Example 1: ```k.League.positions({ summonerId: 20026563 }, KindredAPI.print)```

### LoL Status
[docs](https://developer.riotgames.com/api-methods/#lol-status-v3)

1. **/lol/status/v3/shard-data**
    * Get League of Legends status for the given shard.
    * getShardStatus({ region }, cb)
    * Namespaced Functions: *Status.getShardStatus, Status.getStatus, Status.get*
    * Example 1: ```k.Status.get().then(data => console.log(data))```

### Masteries
[docs](https://developer.riotgames.com/api-methods/#masteries-v3)

1. **/lol/platform/v3/masteries/by-summoner/{summonerId}**
    * Get mastery pages for a given summoner Id.
    * getMasteries({ region, accountId/accId (int), id/summonerId/playerId (int), name (str)}, cb)
        * Namespaced Functions: *Masteries.get, Summoner.getMasteries, Summoner.masteries*
        * Example 1: ```k.Masteries.get({ id: 20026563 }, KindredAPI.print)```
    * getMasteriesByAccountId(accId, [region], [cb])
        * Namespaced Functions: *Masteries.by.account*
        * Example 1: ```k.Masteries.by.account(47776491, REGIONS.NORTH_AMERICA, KindredAPI.print)```
    * getMasteriesById(id, [region], [cb])
        * Namespaced Functions: *Masteries.by.id*
        * Example 1: ```k.Masteries.by.id(32932398).then(data => console.log(data))```
    * getMasteriesByName(name, [region], [cb])
        * Namespaced Functions: *Masteries.by.name*
        * Example 1: ```k.Masteries.by.name('Contractz', KindredAPI.print)```

### Match
[docs](https://developer.riotgames.com/api-methods/#match-v3/)

Note that this section has two different namespaces (Match and Matchlist).
`id` parameter still refers to summonerId (not accountId).

1. **/lol/match/v3/matches/{matchId}**
    * Get match by match Id.
    * getMatch({ region, id/matchId (int), options (object) }, cb)
    * Namespaced Functions: *Match.getMatch, Match.get*
    * Example 1: ```k.Match.get({ id: 2482174957 }, KindredAPI.print)```
2. **/lol/match/v3/matchlists/by-account/{accountId}**
    * Get matchlist for given account Id and platform Id.
    * getMatchlist({ region, accountId/accId (int), id/summonerId/playerId (int), name (str), options = { queue: QUEUES.TEAM_BUILDER_RANKED_SOLO } }, cb)
    * Namespaced Functions: *Matchlist.getMatchlist, Matchlist.get, Summoner.getMatchlist, Summoner.matchlist*
    * Example 1: ```k.Matchlist.get({ accId: 47776491 }, KindredAPI.print)```
    * Example 2: ```k.Matchlist.get({ id: 32932398 }, KindredAPI.print)```
    * Example 3: ```k.Matchlist.get({ name: 'Contractz' }, KindredAPI.print)```
3. **/lol/match/v3/matchlists/by-account/{accountId}/recent**
    * Get recent matchlist for given account Id and platform Id.
    * getRecentMatchlist({ region, accountId/accId (int), id/summonerId/playerId (int), name (str) }, cb)
    * Namespaced Functions: *Matchlist.getRecentMatchlist, Matchlist.recent, Summoner.getMatchHistory, Summoner.matchHistory*
    * Example 1: ```k.Matchlist.recent({ accId: 47776491 }, KindredAPI.print)```
    * Example 2: ```k.Matchlist.recent({ id: 32932398 }, KindredAPI.print)``` // by summonerId
    * Example 3: ```k.Matchlist.recent({ name: 'Contractz' }, KindredAPI.print)```
4. **/lol/match/v3/timelines/by-match/{matchId}**
    * Get match timeline by match Id.
    * getMatchTimeline({ region, id/matchId (int) }, cb) 
    * Namespaced Functions: *Match.getMatchTimeline, Match.getTimeline, Match.timeline*
    * Example 1: ```k.Match.timeline({ id: 2478544123 }, KindredAPI.print)```

### Runes
[docs](https://developer.riotgames.com/api-methods/#runes-v3)

1. **/lol/platform/v3/runes/by-summoner/{summonerId}**
    * Get rune pages for a given summoner Id.
    * getRunes({ region, accountId/accId (int), id/summonerId/playerId (int), name (str) }, cb)
        * Namespaced Functions: *Runes.get, Summoner.getRunes, Summoner.runes*
        * Example 1: ```k.Runes.get({ id: 20026563 }, KindredAPI.print)```
        * Example 2: ```k.Runes.get({ name: 'Contractz' }, KindredAPI.print)```
        * Example 3: ```k.Runes.get({ accId: 47776491 }, KindredAPI.print)```
    * getRunesByAccountId(accId, [region], [cb])
        * Namespaced Functions: *k.Runes.by.account*
        * Example 1: ```k.Runes.by.account(47776491, KindredAPI.print)```
    * getRunesById(id, [region], [cb])
        * Namespaced Functions: *k.Runes.by.id*
        * Example 1: ```k.Runes.by.id(32932398, KindredAPI.print)```
    * getRunesByName(name, [region], [cb])
        * Namespaced Functions: *k.Runes.by.name*
        * Example 1: ```k.Runes.by.name('Contractz').then(data => console.log(data)).catch(error => console.error(error))```

### Spectator
[docs](https://developer.riotgames.com/api-methods/#spectator-v3)

1. **/lol/spectator/v3/active-games/by-summoner/{summonerId}**
    * Get current game information for the given summoner Id. (REST)
    * getCurrentGame({ region = this.defaultRegion, accountId/accId (int), id/summonerId/playerId (int), name (str) }, cb)
    * Namespaced Functions: *CurrentGame.getCurrentGame, CurrentGame.get*
    * Example 1: ```k.CurrentGame.get({ name: 'Contractz' }, KindredAPI.print)```
    * Example 2: ```k.CurrentGame.get({ id: 32932398 }, KindredAPI.print)```
2. **/lol/spectator/v3/featured-games**
    * Get list of featured games. (REST)
    * getFeaturedGames({ region }, cb)
    * Namespaced Functions: *FeaturedGames.getFeaturedGames, FeaturedGames.get*
    * Example 1: ```k.FeaturedGames.get().then(data => console.log(data))```
    * Example 2: ```k.FeaturedGames.get({ region: 'na' }, KindredAPI.print)```

### Static Data
[docs](https://developer.riotgames.com/api-methods/#static-data-v3)

1. **/lol/static-data/v3/champions**
    * Retrieves champion list. (REST)
    * getStaticChampionList([options], [region], [cb])
        * Namespaced Functions: *Static.Champion.list*
        * Example 1: ```k.Static.Champion.list()```
        * Example 2: ```k.Static.Champion.list({ champListData: 'all' }, KindredAPI.print)```
        * Example 3: ```k.Static.Champion.list(KindredAPI.print)```
        * Example 4: ```k.Static.Champion.list(REGIONS.KOREA, KindredAPI.print)```
        * Example 5: ```k.Static.Champion.list({ champListData: 'all' }, REGIONS.KOREA, KindredAPI.print)```
    * getChampionList({ region, options (object) }, cb)
        * Namespaced Functions: *Static.getChampions, Static.champions*
        * Example 1: ```k.Static.champions(KindredAPI.print)```
        * Example 2: ```k.Static.champions({ options: { champData: 'all' } }).then(data => console.log(data))```
2. **/lol/static-data/v3/champions/{id}**
    * Retrieves a champion by its id. (REST)
    * staticGetChampionById(id, [options], [region], [cb])
        * Example 1: ```k.Static.Champion.by.id(497, REGIONS.KOREA, KindredAPI.print)```
        * Example 2: ```k.Static.Champion.by.id(497, { champListData: 'all' }, KindredAPI.print)```
    * getChampion({ region, id/championId (int), options (object) }, cb)
        * Namespaced Functions: *Static.getChampion, Static.champion*
        * Example 1: ```k.Static.champion({ id: 131 }, KindredAPI.print)```
        * Example 2: ```k.Static.champion({ id: 131, options: { champData: 'enemytips', version: '7.7.1' } }, KindredAPI.print)```
3. **/lol/static-data/v3/items**
    * Retrieves item list. (REST)
    * getStaticItemList([options], [region], [cb])
        * Namespaced Functions: *Static.Item.list*
        * Example 1: ```k.Static.Item.list(REGIONS.KOREA).then(data => console.log(data))```
        * Example 2: ```k.Static.Item.list(KindredAPI.print)```
    * getItems({ region, options (object) }, cb)
        * Namespaced Functions: *Static.getItems, Static.items*
        * Example 1: ```k.Static.items({ options: { itemListData: all } }, KindredAPI.print)```
4. **/lol/static-data/v3/items/{id}**
    * Retrieves item by ID.
    * getStaticItemById(id, [options], [region], [cb])
        * Namespaced Functions: *Static.Item.by.id*
        * Example 1: ```k.Static.Item.by.id(3903).then(data => console.log(data)).catch(error => console.error(error))```
    * getItem({ region, id/itemId (int), options (object) }, cb)
        * Namespaced Functions: *Static.getItem, Static.item*
        * Example 1: ```k.Static.item({ id: 3901, options: { itemData: ['image', 'gold'] } }, KindredAPI.print)```
        * Example 2: ```k.Static.items(KindredAPI.print)```
5. **/lol/static-data/v3/language-strings**
    * Retrieve language strings data. (REST)
    * getStaticLanguageString([options], [region], [cb])
        * Namespaced Functions: *Static.LanguageString.list*
        * Example 1: ```k.Static.LanguageString.list(KindredAPI.print)```
    * getLanguageStrings({ region, options (object) }, cb)
        * Namespaced Functions: *Static.getLanguageStrings, Static.languageStrings*
        * Example 1: ```k.Static.languageStrings(KindredAPI.print)```
6. **/lol/static-data/v3/languages**
    * Retrieve supported languages data. (REST)
    * getStaticLanguageList([region], [cb])
        * Namespaced Functions: *Static.Language.list*
        * Example 1: ```k.Static.Language.list(KindredAPI.print)```
    * getLanguages({ region }, cb)
        * Namespaced Functions: *Static.getLanguages, Static.languages*
        * Example 1: ```k.Static.languages().then(data => console.log(data)).catch(err => console.error(err))```
7. **/lol/static-data/v3/maps**
    * Retrieve map data. (REST)
    * getStaticMapList([region], [cb])
        * Namespaced Functions: *Static.Map.list*
    * getMapData({ region, options (object) }, cb)
        * Namespaced Functions: *Static.getMapData, Static.mapData, Static.map, Static.maps*
        * Example 1: ```k.Static.mapData().then(data => console.log(data))```
8. **/lol/static-data/v3/masteries**
    * Retrieve mastery list. (REST)
    * getStaticMasteryList([options], [region], [cb])
        * Namespaced Functions: *Static.Mastery.list*
        * Example 1: ```k.Static.Mastery.list(KindredAPI.print)```
    * getMasteryList({ region, options (object) }, cb)
        * Namespaced Functions: *Static.getMasteries, Static.masteries*
        * Example 1: ```k.Static.masteries({ options: { masteryListData: 'image' } }, KindredAPI.print)```
        * Example 2: ```k.Static.masteries(KindredAPI.print)```
9. **/lol/static-data/v3/masteries/{id}**
    * Retrieves mastery item by its unique id. (REST)
    * getStaticMasteryById(id, [options], [region], [cb])
        * Namespaced Functions: *Static.Mastery.by.id*
        * Example 1: ```k.Static.Mastery.by.id(6362, KindredAPI.print)```
    * getMastery({ region, id/masteryId (int), options (object) }, cb)
        * Namespaced Functions: *Static.getMastery, Static.mastery*
        * Example 1: ```k.Static.mastery({ id: 6361 }, KindredAPI.print)```
        * Example 2: ```k.Static.mastery({ id: 6361, options: { masteryData: ['image', 'masteryTree'] } }, KindredAPI.print)```
        * Example 3: ```k.Static.mastery({ id: 6361, options: { masteryData: 'image' } }, KindredAPI.print)```
10. **/lol/static-data/v3/profile-icons**
    * Retrieve profile icons. (REST)
    * getProfileIcons({ region, options (object) }, cb)
    * Namespaced Functions:  *Static.getProfileIcons, Static.profileIcons*
    * Example 1: ```k.Static.profileIcons(KindredAPI.print)```
11. **/lol/static-data/v3/realms**
    * Retrieve realm data. (REST)
    * getRealmData({ region }, cb)
    * Namespaced Functions: *Static.getRealmData, Static.realmData, Static.realm, Static.realms*
    * Example 1: ```k.Static.realmData().then(data => console.log(data))```
12. **/lol/static-data/v3/runes**
    * Retrieves rune list. (REST)
    * getRuneList({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getRunes, Static.runes*
    * Example 1: ```k.Static.runes().then(data => console.log(data))```
    * Example 2: ```k.Static.runes({ options: { runeListData: 'basic' } }, KindredAPI.print)```
13. **/lol/static-data/v3/runes/{id}**
    * Retrieves rune by its unique id. (REST)
    * getRune({ region, id/runeId (int), options (object) }, cb)
    * Namespaced Functions: *Static.getRune, Static.rune*
    * Example 1: ```k.Static.rune({ id: 10002 }, KindredAPI.print)```
    * Example 2: ```k.Static.rune({ id: 10001, options: { runeData: 'image' } }, KindredAPI.print)```
14. **/lol/static-data/v3/summoner-spells**
    * Retrieves summoner spell list. (REST)
    * getSummonerSpells({ region, options (object) }, cb)
    * Namespaced Functions: *Static.getSummonerSpells, Static.summonerSpells, Static.spells*
    * Example 1: ```k.Static.spells(KindredAPI.print)```
    * Example 2: ```k.Static.spells({ options: { spellData: 'cost', dataById: true } }, KindredAPI.print)```
15. **/lol/static-data/v3/summoner-spells/{id}**
    * Retrieves summoner spell by its unique id. (REST)
    * getSummonerSpell({ region, id/spellId/summonerSpellId (int), options (object) }, cb)
    * Namespaced Functions: *Static.getSummonerSpell, Static.summonerSpell, Static.spell*
    * Example 1: ```k.Static.spell({ id: 31 }, KindredAPI.print)```
    * Example 2: ```k.Static.spell({ id: 31, options: { spellData: 'cooldown' } }, KindredAPI.print)```
16. **/lol/static-data/v3/versions**
    * Retrieve version data. (REST)
    * getVersionData({ region }, cb)
    * Namespaced Functions: *Static.getVersionData, Static.versionData, Static.version, Static.versions*
    * Example 1: ```k.Static.versions(rprint)```

### Stats
[docs](https://developer.riotgames.com/api-methods/#stats-v1.3)

1. **/api/lol/{region}/v1.3/stats/by-summoner/{summonerId}/ranked**
    * Get ranked stats by summoner Id. (REST)
    * getRankedStats({ region, id/summonerId/playerId (int), name (str), options (object) }, cb)
    * Namespaced Functions: *Stats.getRankedStats, Stats.ranked*
    * Example 1: ```k.Stats.ranked({ id: 20026563 }, KindredAPI.print)```
    * Example 2: ```k.Stats.ranked({ id: 20026563, options: { season: 'SEASON2016' } }, KindredAPI.print)```
2. **/api/lol/{region}/v1.3/stats/by-summoner/{summonerId}/summary**
    * Get player stats summaries by summoner Id. (REST)
    * getStatsSummary({ region, id/summonerId/playerId (int), name (str), options (object) }, cb)
    * Namespaced Functions: *Stats.getStatsSummary, Stats.summary*
    * Example 1: ```k.Stats.summary({ id: 20026563 }, KindredAPI.print)```

### Summoner
[docs](https://developer.riotgames.com/api-methods/#summoner-v3)

1. **/lol/summoner/v3/summoners/by-account/{accountId}**
    * Get a summoner by account id
    * getSummoner({ region, accountId/accId (int), name (str) }, cb)
        * Namespaced Functions: *Summoner.getSummoner, Summoner.get*
        * Example 1: ```k.Summoner.get({ accountId: 123123 }, KindredAPI.print)```
    * getSummonerByAccountId(accId, [region], [cb])
        * Namespaced Functions: *Summoner.by.account*
        * Example 1: ```k.Summoner.by.account(47776491, KindredAPI.print)```
        * Example 2: ```k.Summoner.by.account(47776491, REGIONS.NORTH_AMERICA, KindredAPI.print)```
2. **/lol/summoner/v3/summoners/by-name/{summonerName}**
    * Get a summoner by summoner name
    * getSummoner({ region, id/summonerId/playerId (int) }, cb)
        * Namespaced Functions: *Summoner.getSummoner, Summoner.get*
        * Example 1: ```k.Summoner.get({ name: 'Contractz' }, KindredAPI.print)```
    * getSummonerByName(name, [region], [cb])
        * Namespaced Functinos: *Summoner.by.name*
        * Example 1: ```k.Summoner.by.name('Contractz', KindredAPI.print)```
        * Example 2: ```k.Summoner.by.name('Contractz', REGIONS.NORTH_AMERICA, KindredAPI.print)```
        * Example 3: ```k.Summoner.by.name('Contractz').then(data => console.log(data))```
3. **/lol/summoner/v3/summoners/{summonerId}**
    * Get a summoner by summoner id
    * getSummoner({ region, id/summonerId/playerId (int) }, cb)
        * Namespaced Functions: *Summoner.getSummoner, Summoner.get*
        * Example 1: ```k.Summoner.get({ id: 20026563 }, KindredAPI.print)```
    * getSummonerById(id, [region], [cb])
        * Namespaced Functions: *Summoner.by.id*
        * Example 1: ```k.Summoner.by.id(32932398, REGIONS.NORTH_AMERICA, KindredAPI.print)```

### Tournament
[docs](https://developer.riotgames.com/api-methods/#tournament-v3)

1. **/lol/tournament/v3/codes/{tournamentCode}**
    * Returns the tournament code DTO associated with a tournament code string.
    * getDTOByCode(code (string), cb)
    * Namespaced Functions: *Tournament.getDTOByCode, Tournament.DTO.by.code*
    * Example 1: ```k.Tournament.DTO.by.code('123123')```
2. **/lol/tournament/v3/lobby-events/by-code/{tournamentCode}**
    * Gets a list of lobby events by tournament code.
    * getLobbyListEventsByCode(code (string), cb)
    * Namespaced Functions: *Tournament.getLobbyListEventsByCode, Tournament.LobbyListEvents.by.code*
    * Example 1: ```k.Tournament.LobbyListEvents.by.code('123123')```

## Quickstart
Debug on, dev key rate limiting per region, in-memory cache with default settings on for quick scripts

```javascript
var KindredAPI = require('kindred-api')
var REGIONS = KindredAPI.REGIONS
var QUEUES = KindredAPI.QUEUE_TYPES
var debug = true
var k = KindredAPI.QuickStart('YOUR_KEY', REGIONS.NORTH_AMERICA, debug)

/* Summoners! */
k.Summoner.get({ id: 32932398 }, KindredAPI.print)
k.Summoner.get({ name: 'Contractz' }, KindredAPI.print)
k.Summoner.by.id(32932398, KindredAPI.print)
k.Summoner.by.name('Contractz', REGIONS.NORTH_AMERICA, KindredAPI.print)

/* How to pass in options 101. */
var name = 'caaaaaaaaaria'
var region = REGIONS.NORTH_AMERICA
var options = {
  queue: [QUEUES.TEAM_BUILDER_RANKED_SOLO, QUEUES.RANKED_FLEX_SR], // no need for joins or messy strings
  // you can pass in arrays into any options params; array values will always be joined into a string
  champion: 79
  // option params should be spelled and capitalized the same as it is in Riot's docs!
  // for example, Matchlist query params in Riot's docs include `champion`, `beginIndex`, `beginTime`, `season`
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
 .get({ name, options })
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

const config = {
  options: {
    champListData: 'all'
  },
  region: REGIONS.KOREA
}

k.Static.champions(config)
        .then(data => console.log(data))

k.Static.champion({
    id: 497,
    config.options
}).then(data => console.log(data))

/*
    `get` style functions always take in an object as the first parameter.
    They can work with different type of parameters (id, name, accountId)
    when applicable.

    All `list` and `by.xxx` functions will have the standard way of
    inserting arguments into the parameters.
*/
k.Static.Champion
        .list({ champListData: 'all' }, REGIONS.KOREA)
        .then(data => console.log(data))

k.Static.Champion
        .by.id(497, { champListData: 'all' })
        .then(data => console.log(data))
        .catch(error => console.error(err))
```

## Detailed Usage
```javascript
var KindredAPI = require('kindred-api')

// var RIOT_API_KEY = require('whatever')
// or if you're using something like dotenv..
require('dotenv').config()
var RIOT_API_KEY = process.env.RIOT_API_KEY
var REGIONS = KindredAPI.REGIONS
var LIMITS = KindredAPI.LIMITS
var CACHE_TYPES = KindredAPI.CACHE_TYPES

/*
  Default region for every method call is NA,
  but you can set it during initialization as shown below.
  You can also change it with 'setRegion(region)' as well.
  To NOT use the built-in rate limiter, do NOT pass in anything
  into limits. Same if you don't want to use the cache (cacheOptions).
*/
var k = new KindredAPI.Kindred({
  key: RIOT_API_KEY,
  defaultRegion: REGIONS.NORTH_AMERICA,
  debug: true, // shows status code, urls, and relevant headers
  limits: [ [10, 10], [500, 600] ], // user key
  // 10 requests per 10 seconds, 500 requests per 10 minutes
  // You can just pass in LIMITS.DEV, LIMITS.PROD, 'dev', or 'prod' instead though.
  cacheOptions: CACHE_TYPES[0] // in memory
})

console.log(CACHE_TYPES)

// ['in-memory-cache', 'redis']

var rprint = KindredAPI.print

/*
  The important thing about this wrapper is that it does not
  take in parameters the usual way. Instead, the only parameter,
  excluding the callback parameter, is an object of parameters.
*/
k.Summoner.get({ id: 354959 }, rprint)
k.Summoner.get({ id: 354959 }).then(data => console.log(data))

k.Match.get({ id: 2459973154, options: {
    includeTimeline: false // of course, option params must be the same as the ones in Riot Docs
}}, rprint)

k.League.challengers({ region: 'na', queue: 'RANKED_FLEX_SR' }, rprint)

/*
  All functions essentially have the following form:

  functionName({ arg1, arg2...argN, options: {} }, optionalCallback) -> promise

  If a method does not have the `options` parameter within my code, that simply means
  there are no possible query parameters that you can pass in to that method.
*/

/*
  Making any form of parameter error will inform you
  what parameters you can pass in so you hopefully
  don't have to refer to the documentation as much.
*/
k.Summoner.get(rprint)
// getSummoner request FAILED; required params `id` (int) or `name` (string) not passed in

k.ChampionMastery.get(rprint)
// getChampMastery request FAILED; required params `playerId` (int) AND `championId` (int) not passed in

/*
  Notice the OR and the AND!!
  Note: getChampMastery is the only method that can't take in an 'id' parameter,
  because it requires both a 'playerId' and a 'championId'!
*/

/*
  Let me reiterate: the first parameter of all endpoint methods will ALWAYS be an object.
  However, when the parameters are satisfied by default parameters and/or
  only have optional parameters, you can simply pass your callback in.
*/
k.League.challengers(rprint) // default region, default solo queue mode, valid

k.Static.runes(rprint) // only optional arguments & not passing in any optional arguments, valid

/*
  getSummoners & getSummoner target both the by-name and by-id endpoints.
  In the case of the summoner endpoints, it made a lot more sense for the two
  functions to target both the by-name and by-id summoner endpoints.
*/

k.Summoner.get({ name: 'Contractz' }, rprint)
k.Summoner.get({ id: 354959 }, rprint)

/*
  There are aliases for the `id` param.
  
  For example, for summoners, you have summonerId and playerId.
*/
k.Summoner.get({ summonerId: 354959 }, rprint)

k.Summoner
 .get({ summonerId: 354959 })
 .then(json => console.log(json))
 .catch(err => console.error(err))

k.Match.get({ id: 2459973154 }, rprint)

k.Match
 .get({ matchId: 2459973154 })
 .then(data => console.log(data))
 .catch(err => console.error(err))

/* Every method has an optional 'region' parameter. */
var params = { name: 'sktt1peanut', region: REGIONS.KOREA }
k.Summoner.get(params, rprint) // peanut's data

/* Changing the default region! */
k.setRegion(REGIONS.KOREA)

/* Note that you can use spaces in the name. */
var fakerIgn = { name: 'hide on bush' }
var fakerId
k.Summoner.get(fakerIgn, function (err, data) {
  fakerId = data.id
  console.log('fakerId:', fakerId)
})

/*
  Note that the player runes endpoint only accepts
  a comma-separated list of integers.
*/

k.setRegion(REGIONS.NORTH_AMERICA)

k.Runes.get({ id: 354959 }, rprint)

k.Runes
 .get({ id: 354959 })
 .then(json => console.log(json))
 .catch(err => console.error(err))

/*
  But what if you want to quickly get the rune page of
  some random summoner given their name?

  You'd chain it like in many other clients:
  Get the id from the name, get the runes from the id.
*/
var name = 'Richelle'
k.Summoner.get({ name }, function (err, data) {
  if (data) k.Runes.get({ id: data.id }, rprint)
  else console.error(err)
})

// or with promises
k.Summoner
 .get({ name })
 .then(data => k.Runes.get({ id: data.accountId }))
 .then(data => console.log(data))
 .catch(err => console.error(err))

/* I find that inconvenient, and so I just chain it for you in my code. */
// all methods that target endpoints that only accept ids
k.Runes.get({ name: 'Richelle' }, rprint)
k.Game.get({ name: 'Richelle' }, rprint)
k.League.get({ name: '5tunt' }, rprint)

k.CurrentGame.get({ name: 'Fràe', region: REGIONS.OCEANIA }, rprint)
k.League.get({ name: '5tunt' })
 .then(data => console.log(data))

var name = 'Grigne'
k.Runes.get({ name })
       .then(data => console.log(data))
k.Masteries.get({ name })
       .then(data => console.log(data))
/*
  Functions will have an options parameter that you can pass in query
  strings when applicable. Values of options should match the
  endpoint's 'Query Parameters'. Check the methods to see which methods
  you can pass in options to.

  Some are required, and some are not. I often take care of the ones
  that are required by using the most sensible defaults.

  For example, the required parameter for many methods is 'type' (of queue).
  I made it so that the default is 'RANKED_SOLO_5x5' (or 'TEAM_BUILDER_RANKED_SOLO')
  if 'type' is not passed in.
*/
k.League.challengers({ region: REGIONS.NORTH_AMERICA }, rprint) // get challengers from ranked solo queue ladder
k.League.challengers({ region: REGIONS.NORTH_AMERICA, queue: 'RANKED_FLEX_SR' }, rprint) // get challengers from ranked flex ladder
k.Match.get({ id: 2459973154 }, rprint) // includes timeline by default
k.Match.get({ id: 2459973154, options: { includeTimeline: false } }, rprint)

/*
  However, for getMatchlist, the endpoint uses an optional
  'queue' instead of 'type' to allow multiple options.
  I set the default in this case to TEAM_BUILDER_RANKED_SOLO.
*/
var name = 'Contractz'
var region = REGIONS.NORTH_AMERICA
k.Matchlist.get({ name, region, options: {
    /*
    According to Riot API, query parameters that can accept multiple values
    must be a comma separated list (or a single value), which is why one can do the below join.

    However, both these options are inconvenient, and so I check if you pass in array values
    for every option parameter, and manually join it for you. You can still pass in string values
    if you want though.

    Note, for arrays of values that are conceptually integers,
    both strings and integers work because they're joined together as a string anyways.
    */
    // queue: [QUEUES.RANKED_SOLO_5x5, QUEUES.RANKED_FLEX_SR].join(','), STILL VALId
    // champion: '67' // '267,67' or ['267', '67'].join(',') STILL VALId
  queue: [QUEUES.TEAM_BUILDER_RANKED_SOLO, QUEUES.RANKED_FLEX_SR], // valid
  champion: [236, 432, 81, '432', 7], // valid
  season: 6
} }, rprint)

/* The above example with promises. */
var options = {
    queue: [QUEUES.TEAM_BUILDER_RANKED_SOLO, QUEUES.RANKED_FLEX_SR],
    champion: [236, 432, 81, '432', 7],
    season: 6
}

k.Matchlist
 .get({ name, region, options })
 .then(data => console.log(data))
 .catch(err => console.error(err))

var furyMasteryId = 6111
k.Static.mastery({ id: furyMasteryId }, rprint)

var msRuneId = 10002
k.Static.rune({ id: msRuneId }, rprint)
```

## Rate Limiter
So basically, I'm using [psuedonym117's Python wrapper](https://github.com/pseudonym117/Riot-Watcher)'s rate limiter class and modified it a bunch to make it work. I'm simply doing a primitive rate-limiting-by-timestamps approach, nothing fancy.

You can test out the rate limiter (and see that it supports simultaneous requests to multiple regions) with the following code:

```javascript
var num = 45 // # of requests

function count(err, data) {
  if (data) --num
  if (err) console.error(err)
  if (num == 0) console.timeEnd('api')
}

console.time('api')
for (var i = 0; i < 15; ++i) {
  k.Champion.all({ region: 'na' }, count)
  k.Champion.all({ region: 'kr' }, count)
  k.Champion.all({ region: 'euw' }, count)
}
```
This should output something like ```api: 20779.116ms```.

To test that it works with retry headers, just run the program
while sending a few requests from your browser to intentionally
rate limit yourself.

Because of these lines, ```if (data) --num``` and ```if (num == 0) console.timeEnd('api')```, you can tell if all your requests went through.

## Caching
*April 2*
I have added caching support. Right now, the library supports in-memory caching as well as
caching with Redis. These are the default timers that made sense to me.

```javascript
const endpointCacheTimers = {
  // defaults
  CHAMPION: cacheTimers.MONTH,
  CHAMPION_MASTERY: cacheTimers.SIX_HOURS,
  CURRENT_GAME: cacheTimers.NONE,
  FEATURED_GAMES: cacheTimers.NONE,
  GAME: cacheTimers.HOUR,
  LEAGUE: cacheTimers.SIX_HOURS,
  STATIC: cacheTimers.MONTH,
  STATUS: cacheTimers.NONE,
  MATCH: cacheTimers.MONTH,
  MATCH_LIST: cacheTimers.ONE_HOUR,
  RUNES_MASTERIES: cacheTimers.WEEK,
  STATS: cacheTimers.HOUR,
  SUMMONER: cacheTimers.DAY
}
```

If you pass in cacheOptions, but not how long you want each type of request
to be cached (cacheTTL object), then by default you'll use the above timers.

To pass in your own custom timers, initialize Kindred like this:

``` javascript
import TIME_CONSTANTS from KindredAPI.TIME_CONSTANTS // for convenience, has a bunch of set timers in seconds

var k = new KindredAPI.Kindred({
  key: RIOT_API_KEY,
  defaultRegion: REGIONS.NORTH_AMERICA,
  debug: true, // you can see if you're retrieving from cache with lack of requests showing
  limits: [ [10, 10], [500, 600] ],
  cacheOptions: CACHE_TYPES[0], // in-memory
  cacheTTL: {
    // All values in SECONDS.
    CHAMPION: whatever,
    CHAMPION_MASTERY: whatever,
    CURRENT_GAME: whatever,
    FEATURED_GAMES: whatever,
    GAME: whatever,
    LEAGUE: whatever,
    STATIC: TIME_CONSTANTS.MONTH,
    STATUS: whatever,
    MATCH: whatever,
    MATCH_LIST: whatever,
    RUNES_MASTERIES: whatever,
    STATS: whatever,
    SUMMONER: TIME_CONSTANTS.DAY
  }
})
```

## Ugly
**May 5: I'm actually in the process of adding a bunch of the functions I described below. Summoner, Runes, and Masteries have these type of functions now. I'm working on Static currently!**

Some people might disagree with how I formed my functions.

It's actually not really idiomatic JavaScript, and with an object inside an object it gets ugly really fast.

The benefits of this approach is that it's implementing Python's named parameters in a way, which was my original goal with this project.

However, the problem is that some of the functions could be simplified a lot as they only have one parameter and no options such as grabbing a summoner by their summoner Id. You would want something like:

```getSummonerById(id, region, cb)```

I decided to make the first parameter always an object for my main library methods though because it made my functions very consistent with each other, and so I wouldn't have to look at the method documentation as much.

It was very easy to switch between functions and have the call still be successful with the same parameters.

### However, it's easy to add functions.
You would simply have to define new functions within the class that return calls to my methods. I have a few examples within my code.

```javascript
this.Ex = {
    getSummonerByAccId: this.getSummonerByAccId.bind(this),
    getMatchlistByName: this.getMatchlistByName.bind(this),
    getRunesBySummonerId: this.getRunesBySummonerId.bind(this),
    getRunesByAccountId: this.getRunesByAccountId.bind(this)
    staticRuneList: this.staticRuneList.bind(this)
}

getSummonerByAccId(accId, region, cb) {
    return this.Summoner.get({
        region,
        accId
    }, cb)
  }

getMatchlistByName(name, region, options, cb) {
    return this.Matchlist.get({
        region,
        name,
        options
    }, cb)
}

getRunesBySummonerId(id, region, cb) {
    return this.Runes.get({
        region,
        id
    }, cb)
}

getRunesByAccountId(accId, region, cb) {
    return this.Runes.get({
        region,
        accId
    }, cb)
}

staticRuneList(region, options, cb) {
    return this.Static.runes({
        region, options
    }, cb)
}
```

It could still be kinda funky, but now you can call the functions like this:

```javascript
k.Ex
 .getMatchlistByName('Contractz')
 .then(data => console.log(data))
 .catch(err => console.error(err))

k.Ex
 .getRunesByAccountId(47776491)
 .then(data => console.log(data))
 .catch(err => console.error(err))

k.Ex
 .getSummonerByAccId(47776491)
 .then(data => console.log(data))
 .catch(err => console.error(err))

k.Ex.getRunesByAccountId(47776491, 'na', KindredAPI.print)
k.Ex.getRunesBySummonerId(32932398, 'na', KindredAPI.print)
k.Ex.staticRuneList('na', {}, KindredAPI.print)
k.Ex.staticRuneList('na').then(data => console.log(data))

k.Ex
 .getMatchlistByName('Contractz', 'na', {
    season: 3, queue: [41, 42]
 })
 .then(data => console.log(data))
 .catch(err => console.error(err))

k.Ex.staticRuneList('na', { runeListData: 'all' }, KindredAPI.print)
```

You can decide on how you want to namespace everything though.

## Contributing and Issues
**Right now, the code is also quite messy and there is a lot of repeated code.** Function definitions are quite long because I include many aliases as well. I haven't thought of an elegant way to make a magic function that manages to work for every single endpoint request yet.

Any help and/or advice is appreciated!