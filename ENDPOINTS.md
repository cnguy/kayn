* [kayn Methods](#methods)
* [Endpoints](#endpoints)

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
Static.ReforgedRunePaths.list()
Static.ReforgedRunePaths.get(runePathID: int)
Static.ReforgedRunes.list()
Static.ReforgedRunes.get(runeID: int)
Static.Rune.list()
Static.Rune.get(runeID: int)
Static.SummonerSpell.list()
Static.SummonerSpell.get(summonerSpellID: int)
Static.TarballLinks.get()
Static.Version.list()

/* LOL-STATUS-V3 */
Status.get()

/* MATCH-V3 */
Match.get(matchID: int)
Matchlist.by.accountID(accountID: int)
Matchlist.Recent.by.accountID(accountID: int) /* April 27th deprecation by Riot, but will still work via the above endpoint */
Match.timeline(matchID: int)
Match.Tournament.listMatchIDs(tournamentCode: string)
Match.Tournament.get(matchID: int, tournamentCode: string)

/* SPECTATOR-V3 */
CurrentGame.by.summonerID(summonerID: int)
FeaturedGames.list()

/* SUMMONER-V3 */
Summoner.by.name(summonerName: string)
Summoner.by.id(summonerID: int)
Summoner.by.accountID(accountID: int)

/* THIRD-PARTY-CODE-V3 */
ThirdPartyCode.by.summonerID(summonerID: int)

/* TOURNAMENT-STUB-V3 */
TournamentStub.create(tournamentID: number, body: object?)
TournamentStub.lobbyEvents(tournamentCode: string)
TournamentStub.registerProviderData(region: string, callbackURL: string)
TournamentStub.register(providerID: number, name: string?)

/* TOURNAMENT-V3 */
Tournament.create(tournamentID: number, body: object?)
Tournament.update(tournamentCode: string, body: object)
Tournament.get(tournamentCode: string)
Tournament.lobbyEvents(tournamentCode: string)
Tournament.registerProviderData(region: string, callbackURL: string)
TournamentStub.register(providerID: number, name: string?)
```

# Endpoints 

Everything should be in the same order as in the official docs.

## CHAMPION-MASTERY-V3
- [x] `Get all champion mastery entries sorted by number of champion points descending,`
- [x] `Get a champion mastery by player ID and champion ID.`
- [x] `Get a player's total champion mastery score, which is the sum of individual champion mastery levels.`

## CHAMPION-V3
- [x] `Retrieve all champions.`
- [x] `Retrieve champion by ID.`

## LEAGUE-V3
- [x] - `Get the challenger league for given queue.`
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
- [x] - `Get matchlist for last 20 matches played on given account ID and platform ID.` (implemented via Get matchlist)
- [x] - `Get match timeline by match ID.`
- [x] - `Get match IDs by tournament code.`
- [x] - `Get match by match ID and tournament code.`

## SPECTATOR-V3
- [x] - `Get current game information for the given summoner ID.`
- [x] - `Get list of featured games.`

## SUMMONER-V3
- [x] - `Get a summoner by account ID.`
- [x] - `Get a summoner by summoner name.`
- [x] - `Get a summoner by summoner ID.`

## TOURNAMENT-STUB-V3
- [x] - `Create a mock tournament code for the given tournament.`
- [x] - `Gets a mock list of lobby events by tournament code.`
- [x] - `Creates a mock tournament provider and return its ID.`
- [x] - `Creates a mock tournament and return its ID.`

## TOURNAMENT-V3
- [x] - `Create a tournament code for the given tournament.`
- [x] - `Update the pick type, map, spectator type, or allowed summoners for a code.`
- [x] - `Returns the tournament code DTO associated with a tournament code string.`
- [x] - `Gets a list of lobby events by tournament code.`
- [x] - `Creates a tournament provider and return its ID.`
- [x] - `Creates a tournament and return its ID.`

