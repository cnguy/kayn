* [Endpoints](#endpoints)
* [kayn Methods](#methods)

# Endpoints 

## CHAMPION-MASTERY-V3
- [x] `Get all champion mastery entries sorted by number of champion points descending,`
- [x] `Get a champion mastery by player ID and champion ID.`
- [x] `Get a player's total champion mastery score, which is the sum of individual champion mastery levels.`

## CHAMPION-V3
- [x] `Retrieve all champions.`
- [x] `Retrieve champion by ID.`

## LEAGUE-V3
- [x] - `Get the challenger league for given queue.`
- [x] - `Get leagues in all queues for a given summoner ID.` (Riot plans to deprecate this by January)
- [x] - `Get league with given ID, including inactive entries.`
- [x] - `Get the master league for given queue.`
- [x] - `Get league positions in all queues for given summoner ID.`

## LOL-STATIC-DATA-V3
- [x] - `Retrieves champion list.`
- [x] - `Retrieves champion by ID.`
- [x] - `Retrieves item list.`
- [x] - `Retrieves item by ID.`
- [x] - `Retrieve language strings data.`
- [x] - `Retrieve supported languages data.`
- [x] - `Retrieve map data.`
- [x] - `Retrieves mastery list.`
- [x] - `Retrieves mastery item by ID.`
- [x] - `Retrieve profile icons.`
- [x] - `Retrieve realm data.`
- [x] - `Retrieves rune list.`
- [x] - `Retrieves rune by ID.`
- [x] - `Retrieves summoner spell list.`
- [x] - `Retrieves summoner spell by ID.`
- [x] - `Retrieve version data.`

## LOL-STATUS-V3
- [x] - `Get League of Legends status for the given shard.`

## MATCH-V3
- [x] - `Get match by match ID.`
- [x] - `Get matchlist for games played on given account ID and platform ID and filtered using given filter parameters, if any.`
- [x] - `Get matchlist for last 20 matches played on given account ID and platform ID.`
- [x] - `Get match timeline by match ID.`
- [ ] - `Get match IDs by tournament code.`
- [ ] - `Get match by match ID and tournament code.`

## SPECTATOR-V3
- [x] - `Get current game information for the given summoner ID.`
- [x] - `Get list of featured games.`

## SUMMONER-V3
- [x] - `Get a summoner by account ID.`
- [x] - `Get a summoner by summoner name.`
- [x] - `Get a summoner by summoner ID.`

## TOURNAMENT-STUB-V3
- [ ] - `Create a mock tournament code for the given tournament.`
- [ ] - `Gets a mock list of lobby events by tournament code.`
- [ ] - `Creates a mock tournament provider and return its ID.`
- [ ] - `Creates a mock tournament and return its ID.`

## TOURNAMENT-V3
- [ ] - `Create a tournament code for the given tournament.`
- [ ] - `Update the pick type, map, spectator type, or allowed summoners for a code.`
- [ ] - `Returns the tournament code DTO associated with a tournament code string.`
- [ ] - `Gets a list of lobby events by tournament code.`
- [ ] - `Creates a tournament provider and return its ID.`
- [ ] - `Creates a tournament and return its ID.`

# Methods 

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

/* MATCH-V3 */
Match.get(matchID: int)
Matchlist.by.accountID(accountID: int)
Matchlist.Recent.by.accountID(accountID: int)
Match.timeline(matchID: int)

/* SPECTATOR-V3 */
CurrentGame.by.summonerID(summonerID: int)
FeaturedGames.list()

/* SUMMONER-V3 */
Summoner.by.name(summonerName: string)
Summoner.by.id(summonerID: int)
Summoner.by.accountID(accountID: int)

/* THIRD-PARTY-CODE-V3 */
ThirdPartyCode.by.summonerID(summonerID: int)
```