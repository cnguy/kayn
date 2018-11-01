/**
 * This object contains single Champion Mastery information for player and champion combination.
 */
export interface ChampionMasteryV3ChampionMasteryDTO {
    /**
     * Is chest granted for this champion or not in current season.
     */
    chestGranted?: boolean
    /**
     * Champion level for specified player and champion combination.
     */
    championLevel?: number // int32
    /**
     * Total number of champion points for this player and champion combination - they are used to determine championLevel.
     */
    championPoints?: number // int32
    /**
     * Champion ID for this entry.
     */
    championId?: number // int64
    /**
     * Player ID for this entry.
     */
    playerId?: number // int64
    /**
     * Number of points needed to achieve next level. Zero if player reached maximum champion level for this champion.
     */
    championPointsUntilNextLevel?: number // int64
    /**
     * The token earned for this champion to levelup.
     */
    tokensEarned?: number // int32
    /**
     * Number of points earned since current level has been achieved.
     */
    championPointsSinceLastLevel?: number // int64
    /**
     * Last time this champion was played by this player - in Unix milliseconds time format.
     */
    lastPlayTime?: number // int64
}
export interface ChampionV3ChampionInfo {
    freeChampionIdsForNewPlayers?: number /* int32 */[]
    freeChampionIds?: number /* int32 */[]
    maxNewPlayerLevel?: number // int32
}
export interface Error {
    status?: {
        status_code?: number
        message?: string
    }
}
export interface LeagueV3LeagueListDTO {
    leagueId?: string
    tier?: string
    entries?: LeagueV3LeaguePositionDTO[]
    queue?: string
    name?: string
}
export interface LeagueV3LeaguePositionDTO {
    rank?: string
    queueType?: string
    hotStreak?: boolean
    miniSeries?: LeagueV3MiniSeriesDTO
    wins?: number // int32
    veteran?: boolean
    losses?: number // int32
    freshBlood?: boolean
    leagueId?: string
    playerOrTeamName?: string
    inactive?: boolean
    playerOrTeamId?: string
    leagueName?: string
    tier?: string
    leaguePoints?: number // int32
}
export interface LeagueV3MiniSeriesDTO {
    wins?: number // int32
    losses?: number // int32
    target?: number // int32
    progress?: string
}
export interface LolStatusV3Incident {
    active?: boolean
    created_at?: string
    id?: number // int64
    updates?: LolStatusV3Message[]
}
export interface LolStatusV3Message {
    severity?: string
    author?: string
    created_at?: string
    translations?: LolStatusV3Translation[]
    updated_at?: string
    content?: string
    id?: string
}
export interface LolStatusV3Service {
    status?: string
    incidents?: LolStatusV3Incident[]
    name?: string
    slug?: string
}
export interface LolStatusV3ShardStatus {
    name?: string
    region_tag?: string
    hostname?: string
    services?: LolStatusV3Service[]
    slug?: string
    locales?: string[]
}
export interface LolStatusV3Translation {
    locale?: string
    content?: string
    updated_at?: string
}
export interface MatchV3MasteryDto {
    masteryId?: number // int32
    rank?: number // int32
}
export interface MatchV3MatchDto {
    /**
     * Please refer to the Game Constants documentation.
     */
    seasonId?: number // int32
    /**
     * Please refer to the Game Constants documentation.
     */
    queueId?: number // int32
    gameId?: number // int64
    /**
     * Participant identity information.
     */
    participantIdentities?: MatchV3ParticipantIdentityDto[]
    /**
     * The major.minor version typically indicates the patch the match was played on.
     */
    gameVersion?: string
    /**
     * Platform where the match was played.
     */
    platformId?: string
    /**
     * Please refer to the Game Constants documentation.
     */
    gameMode?: string
    /**
     * Please refer to the Game Constants documentation.
     */
    mapId?: number // int32
    /**
     * Please refer to the Game Constants documentation.
     */
    gameType?: string
    /**
     * Team information.
     */
    teams?: MatchV3TeamStatsDto[]
    /**
     * Participant information.
     */
    participants?: MatchV3ParticipantDto[]
    /**
     * Match duration in seconds.
     */
    gameDuration?: number // int64
    /**
     * Designates the timestamp when champion select ended and the loading screen appeared, NOT when the game timer was at 0:00.
     */
    gameCreation?: number // int64
}
export interface MatchV3MatchEventDto {
    eventType?: string
    towerType?: string
    teamId?: number // int32
    ascendedType?: string
    killerId?: number // int32
    levelUpType?: string
    pointCaptured?: string
    assistingParticipantIds?: number /* int32 */[]
    wardType?: string
    monsterType?: string
    /**
     * (Legal values:  CHAMPION_KILL,  WARD_PLACED,  WARD_KILL,  BUILDING_KILL,  ELITE_MONSTER_KILL,  ITEM_PURCHASED,  ITEM_SOLD,  ITEM_DESTROYED,  ITEM_UNDO,  SKILL_LEVEL_UP,  ASCENDED_EVENT,  CAPTURE_POINT,  PORO_KING_SUMMON)
     */
    type?:
        | 'CHAMPION_KILL'
        | 'WARD_PLACED'
        | 'WARD_KILL'
        | 'BUILDING_KILL'
        | 'ELITE_MONSTER_KILL'
        | 'ITEM_PURCHASED'
        | 'ITEM_SOLD'
        | 'ITEM_DESTROYED'
        | 'ITEM_UNDO'
        | 'SKILL_LEVEL_UP'
        | 'ASCENDED_EVENT'
        | 'CAPTURE_POINT'
        | 'PORO_KING_SUMMON'
    skillSlot?: number // int32
    victimId?: number // int32
    timestamp?: number // int64
    afterId?: number // int32
    monsterSubType?: string
    laneType?: string
    itemId?: number // int32
    participantId?: number // int32
    buildingType?: string
    creatorId?: number // int32
    position?: MatchV3MatchPositionDto
    beforeId?: number // int32
}
export interface MatchV3MatchFrameDto {
    timestamp?: number // int64
    participantFrames?: {
        [name: string]: MatchV3MatchParticipantFrameDto
    }
    events?: MatchV3MatchEventDto[]
}
export interface MatchV3MatchParticipantFrameDto {
    totalGold?: number // int32
    teamScore?: number // int32
    participantId?: number // int32
    level?: number // int32
    currentGold?: number // int32
    minionsKilled?: number // int32
    dominionScore?: number // int32
    position?: MatchV3MatchPositionDto
    xp?: number // int32
    jungleMinionsKilled?: number // int32
}
export interface MatchV3MatchPositionDto {
    y?: number // int32
    x?: number // int32
}
export interface MatchV3MatchReferenceDto {
    lane?: string
    gameId?: number // int64
    champion?: number // int32
    platformId?: string
    season?: number // int32
    queue?: number // int32
    role?: string
    timestamp?: number // int64
}
export interface MatchV3MatchTimelineDto {
    frames?: MatchV3MatchFrameDto[]
    frameInterval?: number // int64
}
export interface MatchV3MatchlistDto {
    matches?: MatchV3MatchReferenceDto[]
    totalGames?: number // int32
    startIndex?: number // int32
    endIndex?: number // int32
}
export interface MatchV3ParticipantDto {
    /**
     * Participant statistics.
     */
    stats?: MatchV3ParticipantStatsDto
    participantId?: number // int32
    /**
     * List of legacy Rune information. Not included for matches played with Runes Reforged.
     */
    runes?: MatchV3RuneDto[]
    /**
     * Participant timeline data.
     */
    timeline?: MatchV3ParticipantTimelineDto
    /**
     * 100 for blue side. 200 for red side.
     */
    teamId?: number // int32
    /**
     * Second Summoner Spell id.
     */
    spell2Id?: number // int32
    /**
     * List of legacy Mastery information. Not included for matches played with Runes Reforged.
     */
    masteries?: MatchV3MasteryDto[]
    /**
     * Highest ranked tier achieved for the previous season in a specific subset of queueIds, if any, otherwise null. Used to display border in game loading screen. Please refer to the Ranked Info documentation.
     *              (Legal values:  CHALLENGER,  MASTER,  DIAMOND,  PLATINUM,  GOLD,  SILVER,  BRONZE,  UNRANKED)
     */
    highestAchievedSeasonTier?:
        | 'CHALLENGER'
        | 'MASTER'
        | 'DIAMOND'
        | 'PLATINUM'
        | 'GOLD'
        | 'SILVER'
        | 'BRONZE'
        | 'UNRANKED'
    /**
     * First Summoner Spell id.
     */
    spell1Id?: number // int32
    championId?: number // int32
}
export interface MatchV3ParticipantIdentityDto {
    /**
     * Player information.
     */
    player?: MatchV3PlayerDto
    participantId?: number // int32
}
export interface MatchV3ParticipantStatsDto {
    firstBloodAssist?: boolean
    visionScore?: number // int64
    magicDamageDealtToChampions?: number // int64
    damageDealtToObjectives?: number // int64
    totalTimeCrowdControlDealt?: number // int32
    longestTimeSpentLiving?: number // int32
    /**
     * Post game rune stats.
     */
    perk1Var1?: number // int32
    /**
     * Post game rune stats.
     */
    perk1Var3?: number // int32
    /**
     * Post game rune stats.
     */
    perk1Var2?: number // int32
    tripleKills?: number // int32
    /**
     * Post game rune stats.
     */
    perk3Var3?: number // int32
    nodeNeutralizeAssist?: number // int32
    /**
     * Post game rune stats.
     */
    perk3Var2?: number // int32
    playerScore9?: number // int32
    playerScore8?: number // int32
    kills?: number // int32
    playerScore1?: number // int32
    playerScore0?: number // int32
    playerScore3?: number // int32
    playerScore2?: number // int32
    playerScore5?: number // int32
    playerScore4?: number // int32
    playerScore7?: number // int32
    playerScore6?: number // int32
    /**
     * Post game rune stats.
     */
    perk5Var1?: number // int32
    /**
     * Post game rune stats.
     */
    perk5Var3?: number // int32
    /**
     * Post game rune stats.
     */
    perk5Var2?: number // int32
    totalScoreRank?: number // int32
    neutralMinionsKilled?: number // int32
    damageDealtToTurrets?: number // int64
    physicalDamageDealtToChampions?: number // int64
    nodeCapture?: number // int32
    largestMultiKill?: number // int32
    /**
     * Post game rune stats.
     */
    perk2Var2?: number // int32
    /**
     * Post game rune stats.
     */
    perk2Var3?: number // int32
    totalUnitsHealed?: number // int32
    /**
     * Post game rune stats.
     */
    perk2Var1?: number // int32
    /**
     * Post game rune stats.
     */
    perk4Var1?: number // int32
    /**
     * Post game rune stats.
     */
    perk4Var2?: number // int32
    /**
     * Post game rune stats.
     */
    perk4Var3?: number // int32
    wardsKilled?: number // int32
    largestCriticalStrike?: number // int32
    largestKillingSpree?: number // int32
    quadraKills?: number // int32
    teamObjective?: number // int32
    magicDamageDealt?: number // int64
    item2?: number // int32
    item3?: number // int32
    item0?: number // int32
    neutralMinionsKilledTeamJungle?: number // int32
    item6?: number // int32
    item4?: number // int32
    item5?: number // int32
    /**
     * Primary path rune.
     */
    perk1?: number // int32
    /**
     * Primary path keystone rune.
     */
    perk0?: number // int32
    /**
     * Primary path rune.
     */
    perk3?: number // int32
    /**
     * Primary path rune.
     */
    perk2?: number // int32
    /**
     * Secondary path rune.
     */
    perk5?: number // int32
    /**
     * Secondary path rune.
     */
    perk4?: number // int32
    /**
     * Post game rune stats.
     */
    perk3Var1?: number // int32
    damageSelfMitigated?: number // int64
    magicalDamageTaken?: number // int64
    firstInhibitorKill?: boolean
    trueDamageTaken?: number // int64
    nodeNeutralize?: number // int32
    assists?: number // int32
    combatPlayerScore?: number // int32
    /**
     * Primary rune path
     */
    perkPrimaryStyle?: number // int32
    goldSpent?: number // int32
    trueDamageDealt?: number // int64
    participantId?: number // int32
    totalDamageTaken?: number // int64
    physicalDamageDealt?: number // int64
    sightWardsBoughtInGame?: number // int32
    totalDamageDealtToChampions?: number // int64
    physicalDamageTaken?: number // int64
    totalPlayerScore?: number // int32
    win?: boolean
    objectivePlayerScore?: number // int32
    totalDamageDealt?: number // int64
    item1?: number // int32
    neutralMinionsKilledEnemyJungle?: number // int32
    deaths?: number // int32
    wardsPlaced?: number // int32
    /**
     * Secondary rune path
     */
    perkSubStyle?: number // int32
    turretKills?: number // int32
    firstBloodKill?: boolean
    trueDamageDealtToChampions?: number // int64
    goldEarned?: number // int32
    killingSprees?: number // int32
    unrealKills?: number // int32
    altarsCaptured?: number // int32
    firstTowerAssist?: boolean
    firstTowerKill?: boolean
    champLevel?: number // int32
    doubleKills?: number // int32
    nodeCaptureAssist?: number // int32
    inhibitorKills?: number // int32
    firstInhibitorAssist?: boolean
    /**
     * Post game rune stats.
     */
    perk0Var1?: number // int32
    /**
     * Post game rune stats.
     */
    perk0Var2?: number // int32
    /**
     * Post game rune stats.
     */
    perk0Var3?: number // int32
    visionWardsBoughtInGame?: number // int32
    altarsNeutralized?: number // int32
    pentaKills?: number // int32
    totalHeal?: number // int64
    totalMinionsKilled?: number // int32
    timeCCingOthers?: number // int64
}
export interface MatchV3ParticipantTimelineDto {
    /**
     * Participant's calculated lane. MID and BOT are legacy values.
     *              (Legal values:  MID,  MIDDLE,  TOP,  JUNGLE,  BOT,  BOTTOM)
     */
    lane?: 'MID' | 'MIDDLE' | 'TOP' | 'JUNGLE' | 'BOT' | 'BOTTOM'
    participantId?: number // int32
    /**
     * Creep score difference versus the calculated lane opponent(s) for a specified period.
     */
    csDiffPerMinDeltas?: {
        [name: string]: number // double
    }
    /**
     * Gold for a specified period.
     */
    goldPerMinDeltas?: {
        [name: string]: number // double
    }
    /**
     * Experience difference versus the calculated lane opponent(s) for a specified period.
     */
    xpDiffPerMinDeltas?: {
        [name: string]: number // double
    }
    /**
     * Creeps for a specified period.
     */
    creepsPerMinDeltas?: {
        [name: string]: number // double
    }
    /**
     * Experience change for a specified period.
     */
    xpPerMinDeltas?: {
        [name: string]: number // double
    }
    /**
     * Participant's calculated role.
     *              (Legal values:  DUO,  NONE,  SOLO,  DUO_CARRY,  DUO_SUPPORT)
     */
    role?: 'DUO' | 'NONE' | 'SOLO' | 'DUO_CARRY' | 'DUO_SUPPORT'
    /**
     * Damage taken difference versus the calculated lane opponent(s) for a specified period.
     */
    damageTakenDiffPerMinDeltas?: {
        [name: string]: number // double
    }
    /**
     * Damage taken for a specified period.
     */
    damageTakenPerMinDeltas?: {
        [name: string]: number // double
    }
}
export interface MatchV3PlayerDto {
    currentPlatformId?: string
    summonerName?: string
    matchHistoryUri?: string
    /**
     * Original platformId.
     */
    platformId?: string
    currentAccountId?: number // int64
    profileIcon?: number // int32
    summonerId?: number // int64
    /**
     * Original accountId.
     */
    accountId?: number // int64
}
export interface MatchV3RuneDto {
    runeId?: number // int32
    rank?: number // int32
}
export interface MatchV3TeamBansDto {
    /**
     * Turn during which the champion was banned.
     */
    pickTurn?: number // int32
    /**
     * Banned championId.
     */
    championId?: number // int32
}
export interface MatchV3TeamStatsDto {
    /**
     * Flag indicating whether or not the team scored the first Dragon kill.
     */
    firstDragon?: boolean
    /**
     * Flag indicating whether or not the team destroyed the first inhibitor.
     */
    firstInhibitor?: boolean
    /**
     * If match queueId has a draft, contains banned champion data, otherwise empty.
     */
    bans?: MatchV3TeamBansDto[]
    /**
     * Number of times the team killed Baron.
     */
    baronKills?: number // int32
    /**
     * Flag indicating whether or not the team scored the first Rift Herald kill.
     */
    firstRiftHerald?: boolean
    /**
     * Flag indicating whether or not the team scored the first Baron kill.
     */
    firstBaron?: boolean
    /**
     * Number of times the team killed Rift Herald.
     */
    riftHeraldKills?: number // int32
    /**
     * Flag indicating whether or not the team scored the first blood.
     */
    firstBlood?: boolean
    /**
     * 100 for blue side. 200 for red side.
     */
    teamId?: number // int32
    /**
     * Flag indicating whether or not the team destroyed the first tower.
     */
    firstTower?: boolean
    /**
     * Number of times the team killed Vilemaw.
     */
    vilemawKills?: number // int32
    /**
     * Number of inhibitors the team destroyed.
     */
    inhibitorKills?: number // int32
    /**
     * Number of towers the team destroyed.
     */
    towerKills?: number // int32
    /**
     * For Dominion matches, specifies the points the team had at game end.
     */
    dominionVictoryScore?: number // int32
    /**
     * String indicating whether or not the team won. There are only two values visibile in public match history.
     *              (Legal values:  Fail,  Win)
     */
    win?: 'Fail' | 'Win'
    /**
     * Number of times the team killed Dragon.
     */
    dragonKills?: number // int32
}
export interface SpectatorV3BannedChampion {
    /**
     * The turn during which the champion was banned
     */
    pickTurn?: number // int32
    /**
     * The ID of the banned champion
     */
    championId?: number // int64
    /**
     * The ID of the team that banned the champion
     */
    teamId?: number // int64
}
export interface SpectatorV3CurrentGameInfo {
    /**
     * The ID of the game
     */
    gameId?: number // int64
    /**
     * The game start time represented in epoch milliseconds
     */
    gameStartTime?: number // int64
    /**
     * The ID of the platform on which the game is being played
     */
    platformId?: string
    /**
     * The game mode
     */
    gameMode?: string
    /**
     * The ID of the map
     */
    mapId?: number // int64
    /**
     * The game type
     */
    gameType?: string
    /**
     * Banned champion information
     */
    bannedChampions?: SpectatorV3BannedChampion[]
    /**
     * The observer information
     */
    observers?: SpectatorV3Observer
    /**
     * The participant information
     */
    participants?: SpectatorV3CurrentGameParticipant[]
    /**
     * The amount of time in seconds that has passed since the game started
     */
    gameLength?: number // int64
    /**
     * The queue type (queue types are documented on the Game Constants page)
     */
    gameQueueConfigId?: number // int64
}
export interface SpectatorV3CurrentGameParticipant {
    /**
     * The ID of the profile icon used by this participant
     */
    profileIconId?: number // int64
    /**
     * The ID of the champion played by this participant
     */
    championId?: number // int64
    /**
     * The summoner name of this participant
     */
    summonerName?: string
    /**
     * List of Game Customizations
     */
    gameCustomizationObjects?: SpectatorV3GameCustomizationObject[]
    /**
     * Flag indicating whether or not this participant is a bot
     */
    bot?: boolean
    /**
     * Perks/Runes Reforged Information
     */
    perks?: SpectatorV3Perks
    /**
     * The ID of the second summoner spell used by this participant
     */
    spell2Id?: number // int64
    /**
     * The team ID of this participant, indicating the participant's team
     */
    teamId?: number // int64
    /**
     * The ID of the first summoner spell used by this participant
     */
    spell1Id?: number // int64
    /**
     * The summoner ID of this participant
     */
    summonerId?: number // int64
}
export interface SpectatorV3FeaturedGameInfo {
    /**
     * The ID of the game
     */
    gameId?: number // int64
    /**
     * The game start time represented in epoch milliseconds
     */
    gameStartTime?: number // int64
    /**
     * The ID of the platform on which the game is being played
     */
    platformId?: string
    /**
     * The game mode
     *              (Legal values:  CLASSIC,  ODIN,  ARAM,  TUTORIAL,  ONEFORALL,  ASCENSION,  FIRSTBLOOD,  KINGPORO)
     */
    gameMode?:
        | 'CLASSIC'
        | 'ODIN'
        | 'ARAM'
        | 'TUTORIAL'
        | 'ONEFORALL'
        | 'ASCENSION'
        | 'FIRSTBLOOD'
        | 'KINGPORO'
    /**
     * The ID of the map
     */
    mapId?: number // int64
    /**
     * The game type
     *              (Legal values:  CUSTOM_GAME,  MATCHED_GAME,  TUTORIAL_GAME)
     */
    gameType?: 'CUSTOM_GAME' | 'MATCHED_GAME' | 'TUTORIAL_GAME'
    /**
     * Banned champion information
     */
    bannedChampions?: SpectatorV3BannedChampion[]
    /**
     * The observer information
     */
    observers?: SpectatorV3Observer
    /**
     * The participant information
     */
    participants?: SpectatorV3Participant[]
    /**
     * The amount of time in seconds that has passed since the game started
     */
    gameLength?: number // int64
    /**
     * The queue type (queue types are documented on the Game Constants page)
     */
    gameQueueConfigId?: number // int64
}
export interface SpectatorV3FeaturedGames {
    /**
     * The suggested interval to wait before requesting FeaturedGames again
     */
    clientRefreshInterval?: number // int64
    /**
     * The list of featured games
     */
    gameList?: SpectatorV3FeaturedGameInfo[]
}
export interface SpectatorV3GameCustomizationObject {
    /**
     * Category identifier for Game Customization
     */
    category?: string
    /**
     * Game Customization content
     */
    content?: string
}
export interface SpectatorV3Observer {
    /**
     * Key used to decrypt the spectator grid game data for playback
     */
    encryptionKey?: string
}
export interface SpectatorV3Participant {
    /**
     * The ID of the profile icon used by this participant
     */
    profileIconId?: number // int64
    /**
     * The ID of the champion played by this participant
     */
    championId?: number // int64
    /**
     * The summoner name of this participant
     */
    summonerName?: string
    /**
     * Flag indicating whether or not this participant is a bot
     */
    bot?: boolean
    /**
     * The ID of the second summoner spell used by this participant
     */
    spell2Id?: number // int64
    /**
     * The team ID of this participant, indicating the participant's team
     */
    teamId?: number // int64
    /**
     * The ID of the first summoner spell used by this participant
     */
    spell1Id?: number // int64
}
export interface SpectatorV3Perks {
    /**
     * Primary runes path
     */
    perkStyle?: number // int64
    /**
     * IDs of the perks/runes assigned.
     */
    perkIds?: number /* int64 */[]
    /**
     * Secondary runes path
     */
    perkSubStyle?: number // int64
}
/**
 * represents a summoner
 */
export interface SummonerV3SummonerDTO {
    /**
     * ID of the summoner icon associated with the summoner.
     */
    profileIconId?: number // int32
    /**
     * Summoner name.
     */
    name?: string
    /**
     * Summoner level associated with the summoner.
     */
    summonerLevel?: number // int64
    /**
     * Date summoner was last modified specified as epoch milliseconds. The following events will update this timestamp: profile icon change, playing the tutorial or advanced tutorial, finishing a game, summoner name change
     */
    revisionDate?: number // int64
    /**
     * Summoner ID.
     */
    id?: number // int64
    /**
     * Account ID.
     */
    accountId?: number // int64
}
export interface TournamentStubV3LobbyEventDTO {
    /**
     * The type of event that was triggered
     */
    eventType?: string
    /**
     * The summoner that triggered the event
     */
    summonerId?: string
    /**
     * Timestamp from the event
     */
    timestamp?: string
}
export interface TournamentStubV3LobbyEventDTOWrapper {
    eventList?: TournamentStubV3LobbyEventDTO[]
}
export interface TournamentStubV3ProviderRegistrationParameters {
    /**
     * The provider's callback URL to which tournament game results in this region should be posted. The URL must be well-formed, use the http or https protocol, and use the default port for the protocol (http URLs must use port 80, https URLs must use port 443).
     */
    url?: string
    /**
     * The region in which the provider will be running tournaments.
     *              (Legal values:  BR,  EUNE,  EUW,  JP,  LAN,  LAS,  NA,  OCE,  PBE,  RU,  TR)
     */
    region?:
        | 'BR'
        | 'EUNE'
        | 'EUW'
        | 'JP'
        | 'LAN'
        | 'LAS'
        | 'NA'
        | 'OCE'
        | 'PBE'
        | 'RU'
        | 'TR'
}
export interface TournamentStubV3TournamentCodeParameters {
    /**
     * The spectator type of the game.
     *              (Legal values:  NONE,  LOBBYONLY,  ALL)
     */
    spectatorType?: 'NONE' | 'LOBBYONLY' | 'ALL'
    /**
     * The team size of the game. Valid values are 1-5.
     */
    teamSize?: number // int32
    /**
     * The pick type of the game.
     *              (Legal values:  BLIND_PICK,  DRAFT_MODE,  ALL_RANDOM,  TOURNAMENT_DRAFT)
     */
    pickType?: 'BLIND_PICK' | 'DRAFT_MODE' | 'ALL_RANDOM' | 'TOURNAMENT_DRAFT'
    /**
     * Optional list of participants in order to validate the players eligible to join the lobby. NOTE: We currently do not enforce participants at the team level, but rather the aggregate of teamOne and teamTwo. We may add the ability to enforce at the team level in the future.
     */
    allowedSummonerIds?: number /* int64 */[]
    /**
     * The map type of the game.
     *              (Legal values:  SUMMONERS_RIFT,  TWISTED_TREELINE,  HOWLING_ABYSS)
     */
    mapType?: 'SUMMONERS_RIFT' | 'TWISTED_TREELINE' | 'HOWLING_ABYSS'
    /**
     * Optional string that may contain any data in any format, if specified at all. Used to denote any custom information about the game.
     */
    metadata?: string
}
export interface TournamentStubV3TournamentRegistrationParameters {
    /**
     * The provider ID to specify the regional registered provider data to associate this tournament.
     */
    providerId?: number // int32
    /**
     * The optional name of the tournament.
     */
    name?: string
}
export interface TournamentV3LobbyEventDTO {
    /**
     * The type of event that was triggered
     */
    eventType?: string
    /**
     * The summoner that triggered the event
     */
    summonerId?: string
    /**
     * Timestamp from the event
     */
    timestamp?: string
}
export interface TournamentV3LobbyEventDTOWrapper {
    eventList?: TournamentV3LobbyEventDTO[]
}
export interface TournamentV3ProviderRegistrationParameters {
    /**
     * The provider's callback URL to which tournament game results in this region should be posted. The URL must be well-formed, use the http or https protocol, and use the default port for the protocol (http URLs must use port 80, https URLs must use port 443).
     */
    url?: string
    /**
     * The region in which the provider will be running tournaments.
     *              (Legal values:  BR,  EUNE,  EUW,  JP,  LAN,  LAS,  NA,  OCE,  PBE,  RU,  TR)
     */
    region?:
        | 'BR'
        | 'EUNE'
        | 'EUW'
        | 'JP'
        | 'LAN'
        | 'LAS'
        | 'NA'
        | 'OCE'
        | 'PBE'
        | 'RU'
        | 'TR'
}
export interface TournamentV3TournamentCodeDTO {
    /**
     * The game map for the tournament code game
     */
    map?: string
    /**
     * The tournament code.
     */
    code?: string
    /**
     * The spectator mode for the tournament code game.
     */
    spectators?: string
    /**
     * The tournament code's region.
     *              (Legal values:  BR,  EUNE,  EUW,  JP,  LAN,  LAS,  NA,  OCE,  PBE,  RU,  TR)
     */
    region?:
        | 'BR'
        | 'EUNE'
        | 'EUW'
        | 'JP'
        | 'LAN'
        | 'LAS'
        | 'NA'
        | 'OCE'
        | 'PBE'
        | 'RU'
        | 'TR'
    /**
     * The provider's ID.
     */
    providerId?: number // int32
    /**
     * The team size for the tournament code game.
     */
    teamSize?: number // int32
    participants?: number /* int64 */[]
    /**
     * The pick mode for tournament code game.
     */
    pickType?: string
    /**
     * The tournament's ID.
     */
    tournamentId?: number // int32
    /**
     * The lobby name for the tournament code game.
     */
    lobbyName?: string
    /**
     * The password for the tournament code game.
     */
    password?: string
    /**
     * The tournament code's ID.
     */
    id?: number // int32
    /**
     * The metadata for tournament code.
     */
    metaData?: string
}
export interface TournamentV3TournamentCodeParameters {
    /**
     * The spectator type of the game.
     *              (Legal values:  NONE,  LOBBYONLY,  ALL)
     */
    spectatorType?: 'NONE' | 'LOBBYONLY' | 'ALL'
    /**
     * The team size of the game. Valid values are 1-5.
     */
    teamSize?: number // int32
    /**
     * The pick type of the game.
     *              (Legal values:  BLIND_PICK,  DRAFT_MODE,  ALL_RANDOM,  TOURNAMENT_DRAFT)
     */
    pickType?: 'BLIND_PICK' | 'DRAFT_MODE' | 'ALL_RANDOM' | 'TOURNAMENT_DRAFT'
    /**
     * Optional list of participants in order to validate the players eligible to join the lobby. NOTE: We currently do not enforce participants at the team level, but rather the aggregate of teamOne and teamTwo. We may add the ability to enforce at the team level in the future.
     */
    allowedSummonerIds?: number /* int64 */[]
    /**
     * The map type of the game.
     *              (Legal values:  SUMMONERS_RIFT,  TWISTED_TREELINE,  HOWLING_ABYSS)
     */
    mapType?: 'SUMMONERS_RIFT' | 'TWISTED_TREELINE' | 'HOWLING_ABYSS'
    /**
     * Optional string that may contain any data in any format, if specified at all. Used to denote any custom information about the game.
     */
    metadata?: string
}
export interface TournamentV3TournamentCodeUpdateParameters {
    /**
     * The spectator type
     *              (Legal values:  NONE,  LOBBYONLY,  ALL)
     */
    spectatorType?: 'NONE' | 'LOBBYONLY' | 'ALL'
    /**
     * The pick type
     *              (Legal values:  BLIND_PICK,  DRAFT_MODE,  ALL_RANDOM,  TOURNAMENT_DRAFT)
     */
    pickType?: 'BLIND_PICK' | 'DRAFT_MODE' | 'ALL_RANDOM' | 'TOURNAMENT_DRAFT'
    /**
     * Optional list of participants in order to validate the players eligible to join the lobby. NOTE: We currently do not enforce participants at the team level, but rather the aggregate of teamOne and teamTwo. We may add the ability to enforce at the team level in the future.
     */
    allowedSummonerIds?: number /* int64 */[]
    /**
     * The map type
     *              (Legal values:  SUMMONERS_RIFT,  TWISTED_TREELINE,  HOWLING_ABYSS)
     */
    mapType?: 'SUMMONERS_RIFT' | 'TWISTED_TREELINE' | 'HOWLING_ABYSS'
}
export interface TournamentV3TournamentRegistrationParameters {
    /**
     * The provider ID to specify the regional registered provider data to associate this tournament.
     */
    providerId?: number // int32
    /**
     * The optional name of the tournament.
     */
    name?: string
}
