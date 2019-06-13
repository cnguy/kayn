* [kayn Methods](#methods)
* [Endpoints](#endpoints)

# Methods 

```javascript
/* CHAMPION-V3 */
Champion.Rotation.list()

/* CHAMPION-MASTERY-V4 */
ChampionMastery.list(summonerID: string)
ChampionMastery.get(summonerID: string)(championID: int)
ChampionMastery.totalScore(summonerID: string)

/* LEAGUE-V4 */
Challenger.list(queueName: string)
League.Entries.by.summonerID(summonerID: string)
League.Entries.list(queue: string, tier: string, division: string)
Grandmaster.list(queueName: string)
League.by.uuid(leagueUUID: string)
Master.list(queueName: string)
League.PositionalRankQueue.list() // deprecated June 17th and in `v0.9.10`
LeaguePositions.by.summonerID(summonerID: string) // deprecated June 17th and in `v0.9.10`
LeaguePositions.list(
    positionalQueue: queueName | string,
    tier: tierName | string,
    division: divisionName | string,
    position: positionName | string,
    page: int,
) // deprecated June 17th and in 'v0.9.10`

/* DDRAGON
    At its core, DDragonRequest uses `version()` and `locale()`.

    DDragonRequest as of v0.8.22 now also uses `region()` to automatically grab the correct version for the current request (only for data requests like champion lists). DDragonRequest does not use `query()`.

    Both `version()` and `locale()` are optional.
*/
DDragon.Champion.get(championName: string)
DDragon.Champion.list()
DDragon.Champion.listFull()

DDragon.Champion.getDataById(championName: string)
DDragon.Champion.getDataByIdWithParentAsId(championName: string)
DDragon.Champion.listDataById()
DDragon.Champion.listDataByIdWithParentAsId()
DDragon.Champion.listFullDataById()
DDragon.Champion.listFullDataByIdWithParentAsId()

DDragon.Item.list()
DDragon.Language.list()
DDragon.LanguageString.list()
DDragon.Map.list()
DDragon.ProfileIcon.list()
DDragon.Realm.list(region: region)
DDragon.RunesReforged.list()
DDragon.SummonerSpell.list()
DDragon.Version.list()

/* LOL-STATUS-V3 */
Status.get()

/* MATCH-V4 */
Match.get(matchID: int)
Matchlist.by.accountID(accountID: string)
Matchlist.Recent.by.accountID(accountID: string) /* April 27th deprecation by Riot, but will still work via the above endpoint */
Match.timeline(matchID: int)
Match.Tournament.listMatchIDs(tournamentCode: string)
Match.Tournament.get(matchID: int, tournamentCode: string)

/* SPECTATOR-V4 */
CurrentGame.by.summonerID(summonerID: string)
FeaturedGames.list()

/* SUMMONER-V4 */
Summoner.by.name(summonerName: string)
Summoner.by.id(summonerID: string)
Summoner.by.accountID(accountID: string)

/* THIRD-PARTY-CODE-V4 */
ThirdPartyCode.by.summonerID(summonerID: string)

/* TOURNAMENT-STUB-V4 */
TournamentStub.create(tournamentID: number, body: object?)
TournamentStub.lobbyEvents(tournamentCode: string)
TournamentStub.registerProviderData(region: string, callbackURL: string)
TournamentStub.register(providerID: number, name: string?)

/* TOURNAMENT-V4 */
Tournament.create(tournamentID: number, body: object?)
Tournament.update(tournamentCode: string, body: object)
Tournament.get(tournamentCode: string)
Tournament.lobbyEvents(tournamentCode: string)
Tournament.registerProviderData(region: string, callbackURL: string)
Tournament.register(providerID: number, name: string?)
```

# Endpoints 

Everything should be in the same order as in the official docs.

## CHAMPION-MASTERY-V4
- [x] `Get all champion mastery entries sorted by number of champion points descending.`
- [x] `Get a champion mastery by player ID and champion ID.`
- [x] `Get a player's total champion mastery score, which is the sum of individual champion mastery levels.`

## CHAMPION-V3
- [x] `Retrieve all champions.`
- [x] `Retrieve champion by ID.`

## LEAGUE-V4
- [x] `Get the challenger league for given queue.`
- [x] `Get league entries in all queues for a given summoner ID.`
- [x] `Get all the league entries.`
- [x] `Get the grandmaster league of a specific queue.`
- [x] `Get league with given ID, including inactive entries.`
- [x] `Get the master league for given queue.`
- [x] `Get the queues that have positional ranks enabled.` (deprecated June 17th and in `v0.9.10`)
- [x] `Get league positions in all queues for a given summoner ID.` (deprecated June 17th and in `v0.9.10`)
- [x] `Get all the positional league entries.` (deprecated June 17th and in `v0.9.10`)

## LOL-STATUS-V3
- [x] `Get League of Legends status for the given shard.`
- [x] `Get matchlist for games played on given account ID and platform ID and filtered using given filter parameters, if any.`
- [x] `Get match timeline by match ID.`
- [x] `Get match IDs by tournament code.`
- [x] `Get match by match ID and tournament code.`

## SPECTATOR-V4
- [x] `Get current game information for the given summoner ID.`
- [x] `Get list of featured games.`

## SUMMONER-V4
- [x] `Get a summoner by account ID.`
- [x] `Get a summoner by summoner name.`
- [x] `Get a summoner by PUUID.`
- [x] `Get a summoner by summoner ID.`

## TOURNAMENT-STUB-V4
- [x] `Create a mock tournament code for the given tournament.`
- [x] `Gets a mock list of lobby events by tournament code.`
- [x] `Creates a mock tournament provider and returns its ID.`
- [x] `Creates a mock tournament and returns its ID.`

## TOURNAMENT-V4
- [x] `Create a tournament code for the given tournament.`
- [x] `Returns the tournament code DTO associated with a tournament code string.`
- [x] `Update the pick type, map, spectator type, or allowed summoners for a code.`
- [x] `Gets a list of lobby events by tournament code.`
- [x] `Creates a tournament provider and returns its ID.`
- [x] `Creates a tournament and returns its ID.`