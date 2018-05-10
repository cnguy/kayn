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
/**
 * This object contains champion information.
 */
export interface ChampionV3ChampionDto {
    /**
     * Ranked play enabled flag.
     */
    rankedPlayEnabled?: boolean
    /**
     * Bot enabled flag (for custom games).
     */
    botEnabled?: boolean
    /**
     * Bot Match Made enabled flag (for Co-op vs. AI games).
     */
    botMmEnabled?: boolean
    /**
     * Indicates if the champion is active.
     */
    active?: boolean
    /**
     * Indicates if the champion is free to play. Free to play champions are rotated periodically.
     */
    freeToPlay?: boolean
    /**
     * Champion ID. For static information correlating to champion IDs, please refer to the LoL Static Data API.
     */
    id?: number // int64
}
/**
 * This object contains a collection of champion information.
 */
export interface ChampionV3ChampionListDto {
    /**
     * The collection of champion information.
     */
    champions?: ChampionV3ChampionDto[]
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
/**
 * This object contains champion recommended block data.
 */
export interface LolStaticDataV3BlockDto {
    items?: LolStaticDataV3BlockItemDto[]
    recMath?: boolean
    type?: string
}
/**
 * This object contains champion recommended block item data.
 */
export interface LolStaticDataV3BlockItemDto {
    count?: number // int32
    id?: number // int32
}
/**
 * This object contains champion data.
 */
export interface LolStaticDataV3ChampionDto {
    info?: LolStaticDataV3InfoDto
    enemytips?: string[]
    stats?: LolStaticDataV3StatsDto
    name?: string
    title?: string
    image?: LolStaticDataV3ImageDto
    tags?: string[]
    partype?: string
    skins?: LolStaticDataV3SkinDto[]
    passive?: LolStaticDataV3PassiveDto
    recommended?: LolStaticDataV3RecommendedDto[]
    allytips?: string[]
    key?: string
    lore?: string
    id?: number // int32
    blurb?: string
    spells?: LolStaticDataV3ChampionSpellDto[]
}
/**
 * This object contains champion list data.
 */
export interface LolStaticDataV3ChampionListDto {
    keys?: {
        [name: string]: string
    }
    data?: {
        [name: string]: LolStaticDataV3ChampionDto
    }
    version?: string
    type?: string
    format?: string
}
/**
 * This object contains champion spell data.
 */
export interface LolStaticDataV3ChampionSpellDto {
    cooldownBurn?: string
    resource?: string
    leveltip?: LolStaticDataV3LevelTipDto
    vars?: LolStaticDataV3SpellVarsDto[]
    costType?: string
    image?: LolStaticDataV3ImageDto
    sanitizedDescription?: string
    sanitizedTooltip?: string
    /**
     * This field is a List of List of Double.
     */
    effect?: number /* double */[][]
    tooltip?: string
    maxrank?: number // int32
    costBurn?: string
    rangeBurn?: string
    /**
     * This field is either a List of Integer or the String 'self' for spells that target one's own champion.
     */
    range?: number /* int32 */[]
    cooldown?: number /* double */[]
    cost?: number /* int32 */[]
    key?: string
    description?: string
    effectBurn?: string[]
    altimages?: LolStaticDataV3ImageDto[]
    name?: string
}
/**
 * This object contains item gold data.
 */
export interface LolStaticDataV3GoldDto {
    sell?: number // int32
    total?: number // int32
    base?: number // int32
    purchasable?: boolean
}
/**
 * This object contains item group data.
 */
export interface LolStaticDataV3GroupDto {
    MaxGroupOwnable?: string
    key?: string
}
/**
 * This object contains image data.
 */
export interface LolStaticDataV3ImageDto {
    full?: string
    group?: string
    sprite?: string
    h?: number // int32
    w?: number // int32
    y?: number // int32
    x?: number // int32
}
/**
 * This object contains champion information.
 */
export interface LolStaticDataV3InfoDto {
    difficulty?: number // int32
    attack?: number // int32
    defense?: number // int32
    magic?: number // int32
}
/**
 * This object contains stats for inventory (e.g., runes and items).
 */
export interface LolStaticDataV3InventoryDataStatsDto {
    PercentCritDamageMod?: number // double
    PercentSpellBlockMod?: number // double
    PercentHPRegenMod?: number // double
    PercentMovementSpeedMod?: number // double
    FlatSpellBlockMod?: number // double
    FlatCritDamageMod?: number // double
    FlatEnergyPoolMod?: number // double
    PercentLifeStealMod?: number // double
    FlatMPPoolMod?: number // double
    FlatMovementSpeedMod?: number // double
    PercentAttackSpeedMod?: number // double
    FlatBlockMod?: number // double
    PercentBlockMod?: number // double
    FlatEnergyRegenMod?: number // double
    PercentSpellVampMod?: number // double
    FlatMPRegenMod?: number // double
    PercentDodgeMod?: number // double
    FlatAttackSpeedMod?: number // double
    FlatArmorMod?: number // double
    FlatHPRegenMod?: number // double
    PercentMagicDamageMod?: number // double
    PercentMPPoolMod?: number // double
    FlatMagicDamageMod?: number // double
    PercentMPRegenMod?: number // double
    PercentPhysicalDamageMod?: number // double
    FlatPhysicalDamageMod?: number // double
    PercentHPPoolMod?: number // double
    PercentArmorMod?: number // double
    PercentCritChanceMod?: number // double
    PercentEXPBonus?: number // double
    FlatHPPoolMod?: number // double
    FlatCritChanceMod?: number // double
    FlatEXPBonus?: number // double
}
/**
 * This object contains item data.
 */
export interface LolStaticDataV3ItemDto {
    gold?: LolStaticDataV3GoldDto
    plaintext?: string
    hideFromAll?: boolean
    inStore?: boolean
    into?: string[]
    id?: number // int32
    stats?: LolStaticDataV3InventoryDataStatsDto
    colloq?: string
    maps?: {
        [name: string]: boolean
    }
    specialRecipe?: number // int32
    image?: LolStaticDataV3ImageDto
    description?: string
    tags?: string[]
    effect?: {
        [name: string]: string
    }
    requiredChampion?: string
    from?: string[]
    group?: string
    consumeOnFull?: boolean
    name?: string
    consumed?: boolean
    sanitizedDescription?: string
    depth?: number // int32
    stacks?: number // int32
}
/**
 * This object contains item list data.
 */
export interface LolStaticDataV3ItemListDto {
    data?: {
        [name: string]: LolStaticDataV3ItemDto
    }
    version?: string
    tree?: LolStaticDataV3ItemTreeDto[]
    groups?: LolStaticDataV3GroupDto[]
    type?: string
}
/**
 * This object contains item tree data.
 */
export interface LolStaticDataV3ItemTreeDto {
    header?: string
    tags?: string[]
}
/**
 * This object contains language strings data.
 */
export interface LolStaticDataV3LanguageStringsDto {
    data?: {
        [name: string]: string
    }
    version?: string
    type?: string
}
/**
 * This object contains champion level tip data.
 */
export interface LolStaticDataV3LevelTipDto {
    effect?: string[]
    label?: string[]
}
/**
 * This object contains map data.
 */
export interface LolStaticDataV3MapDataDto {
    data?: {
        [name: string]: LolStaticDataV3MapDetailsDto
    }
    version?: string
    type?: string
}
/**
 * This object contains map details data.
 */
export interface LolStaticDataV3MapDetailsDto {
    mapName?: string
    image?: LolStaticDataV3ImageDto
    mapId?: number // int64
    unpurchasableItemList?: number /* int64 */[]
}
/**
 * This object contains mastery data.
 */
export interface LolStaticDataV3MasteryDto {
    prereq?: string
    /**
     * (Legal values:  Cunning,  Ferocity,  Resolve,  Defense,  Offense,  Utility)
     */
    masteryTree?:
        | 'Cunning'
        | 'Ferocity'
        | 'Resolve'
        | 'Defense'
        | 'Offense'
        | 'Utility'
    name?: string
    ranks?: number // int32
    image?: LolStaticDataV3ImageDto
    sanitizedDescription?: string[]
    id?: number // int32
    description?: string[]
}
/**
 * This object contains mastery list data.
 */
export interface LolStaticDataV3MasteryListDto {
    data?: {
        [name: string]: LolStaticDataV3MasteryDto
    }
    version?: string
    tree?: LolStaticDataV3MasteryTreeDto
    type?: string
}
/**
 * This object contains mastery tree data.
 */
export interface LolStaticDataV3MasteryTreeDto {
    Resolve?: LolStaticDataV3MasteryTreeListDto[]
    Defense?: LolStaticDataV3MasteryTreeListDto[]
    Utility?: LolStaticDataV3MasteryTreeListDto[]
    Offense?: LolStaticDataV3MasteryTreeListDto[]
    Ferocity?: LolStaticDataV3MasteryTreeListDto[]
    Cunning?: LolStaticDataV3MasteryTreeListDto[]
}
/**
 * This object contains mastery tree item data.
 */
export interface LolStaticDataV3MasteryTreeItemDto {
    masteryId?: number // int32
    prereq?: string
}
/**
 * This object contains mastery tree list data.
 */
export interface LolStaticDataV3MasteryTreeListDto {
    masteryTreeItems?: LolStaticDataV3MasteryTreeItemDto[]
}
/**
 * This object contains meta data.
 */
export interface LolStaticDataV3MetaDataDto {
    tier?: string
    type?: string
    isRune?: boolean
}
/**
 * This object contains champion passive data.
 */
export interface LolStaticDataV3PassiveDto {
    image?: LolStaticDataV3ImageDto
    sanitizedDescription?: string
    name?: string
    description?: string
}
/**
 * This object contains profile icon data.
 */
export interface LolStaticDataV3ProfileIconDataDto {
    data?: {
        [name: string]: LolStaticDataV3ProfileIconDetailsDto
    }
    version?: string
    type?: string
}
/**
 * This object contains profile icon details data.
 */
export interface LolStaticDataV3ProfileIconDetailsDto {
    image?: LolStaticDataV3ImageDto
    id?: number // int64
}
/**
 * This object contains realm data.
 */
export interface LolStaticDataV3RealmDto {
    /**
     * Legacy script mode for IE6 or older.
     */
    lg?: string
    /**
     * Latest changed version of Dragon Magic.
     */
    dd?: string
    /**
     * Default language for this realm.
     */
    l?: string
    /**
     * Latest changed version for each data type listed.
     */
    n?: {
        [name: string]: string
    }
    /**
     * Special behavior number identifying the largest profile icon ID that can be used under 500. Any profile icon that is requested between this number and 500 should be mapped to 0.
     */
    profileiconmax?: number // int32
    /**
     * Additional API data drawn from other sources that may be related to Data Dragon functionality.
     */
    store?: string
    /**
     * Current version of this file for this realm.
     */
    v?: string
    /**
     * The base CDN URL.
     */
    cdn?: string
    /**
     * Latest changed version of Dragon Magic's CSS file.
     */
    css?: string
}
/**
 * This object contains champion recommended data.
 */
export interface LolStaticDataV3RecommendedDto {
    map?: string
    blocks?: LolStaticDataV3BlockDto[]
    champion?: string
    title?: string
    priority?: boolean
    mode?: string
    type?: string
}
/**
 * This object contains reforged rune data.
 */
export interface LolStaticDataV3ReforgedRuneDto {
    runePathName?: string
    runePathId?: number // int32
    name?: string
    id?: number // int32
    key?: string
    shortDesc?: string
    longDesc?: string
    icon?: string
}
/**
 * This object contains reforged rune path data.
 */
export interface LolStaticDataV3ReforgedRunePathDto {
    slots?: LolStaticDataV3ReforgedRuneSlotDto[]
    icon?: string
    id?: number // int32
    key?: string
    name?: string
}
/**
 * This object contains reforged rune slot data.
 */
export interface LolStaticDataV3ReforgedRuneSlotDto {
    runes?: LolStaticDataV3ReforgedRuneDto[]
}
/**
 * This object contains rune data.
 */
export interface LolStaticDataV3RuneDto {
    stats?: LolStaticDataV3RuneStatsDto
    name?: string
    tags?: string[]
    image?: LolStaticDataV3ImageDto
    sanitizedDescription?: string
    rune?: LolStaticDataV3MetaDataDto
    id?: number // int32
    description?: string
}
/**
 * This object contains rune list data.
 */
export interface LolStaticDataV3RuneListDto {
    data?: {
        [name: string]: LolStaticDataV3RuneDto
    }
    version?: string
    type?: string
}
/**
 * This object contains stats for runes.
 */
export interface LolStaticDataV3RuneStatsDto {
    PercentTimeDeadModPerLevel?: number // double
    PercentArmorPenetrationModPerLevel?: number // double
    PercentCritDamageMod?: number // double
    PercentSpellBlockMod?: number // double
    PercentHPRegenMod?: number // double
    PercentMovementSpeedMod?: number // double
    FlatSpellBlockMod?: number // double
    FlatEnergyRegenModPerLevel?: number // double
    FlatEnergyPoolMod?: number // double
    FlatMagicPenetrationModPerLevel?: number // double
    PercentLifeStealMod?: number // double
    FlatMPPoolMod?: number // double
    PercentCooldownMod?: number // double
    PercentMagicPenetrationMod?: number // double
    FlatArmorPenetrationModPerLevel?: number // double
    FlatMovementSpeedMod?: number // double
    FlatTimeDeadModPerLevel?: number // double
    FlatArmorModPerLevel?: number // double
    PercentAttackSpeedMod?: number // double
    FlatDodgeModPerLevel?: number // double
    PercentMagicDamageMod?: number // double
    PercentBlockMod?: number // double
    FlatDodgeMod?: number // double
    FlatEnergyRegenMod?: number // double
    FlatHPModPerLevel?: number // double
    PercentAttackSpeedModPerLevel?: number // double
    PercentSpellVampMod?: number // double
    FlatMPRegenMod?: number // double
    PercentHPPoolMod?: number // double
    PercentDodgeMod?: number // double
    FlatAttackSpeedMod?: number // double
    FlatArmorMod?: number // double
    FlatMagicDamageModPerLevel?: number // double
    FlatHPRegenMod?: number // double
    PercentPhysicalDamageMod?: number // double
    FlatCritChanceModPerLevel?: number // double
    FlatSpellBlockModPerLevel?: number // double
    PercentTimeDeadMod?: number // double
    FlatBlockMod?: number // double
    PercentMPPoolMod?: number // double
    FlatMagicDamageMod?: number // double
    PercentMPRegenMod?: number // double
    PercentMovementSpeedModPerLevel?: number // double
    PercentCooldownModPerLevel?: number // double
    FlatMPModPerLevel?: number // double
    FlatEnergyModPerLevel?: number // double
    FlatPhysicalDamageMod?: number // double
    FlatHPRegenModPerLevel?: number // double
    FlatCritDamageMod?: number // double
    PercentArmorMod?: number // double
    FlatMagicPenetrationMod?: number // double
    PercentCritChanceMod?: number // double
    FlatPhysicalDamageModPerLevel?: number // double
    PercentArmorPenetrationMod?: number // double
    PercentEXPBonus?: number // double
    FlatMPRegenModPerLevel?: number // double
    PercentMagicPenetrationModPerLevel?: number // double
    FlatTimeDeadMod?: number // double
    FlatMovementSpeedModPerLevel?: number // double
    FlatGoldPer10Mod?: number // double
    FlatArmorPenetrationMod?: number // double
    FlatCritDamageModPerLevel?: number // double
    FlatHPPoolMod?: number // double
    FlatCritChanceMod?: number // double
    FlatEXPBonus?: number // double
}
/**
 * This object contains champion skin data.
 */
export interface LolStaticDataV3SkinDto {
    num?: number // int32
    name?: string
    id?: number // int32
}
/**
 * This object contains spell vars data.
 */
export interface LolStaticDataV3SpellVarsDto {
    ranksWith?: string
    dyn?: string
    link?: string
    coeff?: number /* double */[]
    key?: string
}
/**
 * This object contains champion stats data.
 */
export interface LolStaticDataV3StatsDto {
    armorperlevel?: number // double
    hpperlevel?: number // double
    attackdamage?: number // double
    mpperlevel?: number // double
    attackspeedoffset?: number // double
    armor?: number // double
    hp?: number // double
    hpregenperlevel?: number // double
    spellblock?: number // double
    attackrange?: number // double
    movespeed?: number // double
    attackdamageperlevel?: number // double
    mpregenperlevel?: number // double
    mp?: number // double
    spellblockperlevel?: number // double
    crit?: number // double
    mpregen?: number // double
    attackspeedperlevel?: number // double
    hpregen?: number // double
    critperlevel?: number // double
}
/**
 * This object contains summoner spell data.
 */
export interface LolStaticDataV3SummonerSpellDto {
    vars?: LolStaticDataV3SpellVarsDto[]
    image?: LolStaticDataV3ImageDto
    costBurn?: string
    cooldown?: number /* double */[]
    effectBurn?: string[]
    id?: number // int32
    cooldownBurn?: string
    tooltip?: string
    maxrank?: number // int32
    rangeBurn?: string
    description?: string
    /**
     * This field is a List of List of Double.
     */
    effect?: number /* double */[][]
    key?: string
    leveltip?: LolStaticDataV3LevelTipDto
    modes?: string[]
    resource?: string
    name?: string
    costType?: string
    sanitizedDescription?: string
    sanitizedTooltip?: string
    /**
     * This field is either a List of Integer or the String 'self' for spells that target one's own champion.
     */
    range?: number /* int32 */[]
    cost?: number /* int32 */[]
    summonerLevel?: number // int32
}
/**
 * This object contains summoner spell list data.
 */
export interface LolStaticDataV3SummonerSpellListDto {
    data?: {
        [name: string]: LolStaticDataV3SummonerSpellDto
    }
    version?: string
    type?: string
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
    seasonId?: number // int32
    queueId?: number // int32
    gameId?: number // int64
    participantIdentities?: MatchV3ParticipantIdentityDto[]
    gameVersion?: string
    platformId?: string
    gameMode?: string
    mapId?: number // int32
    gameType?: string
    teams?: MatchV3TeamStatsDto[]
    participants?: MatchV3ParticipantDto[]
    gameDuration?: number // int64
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
    stats?: MatchV3ParticipantStatsDto
    participantId?: number // int32
    runes?: MatchV3RuneDto[]
    timeline?: MatchV3ParticipantTimelineDto
    teamId?: number // int32
    spell2Id?: number // int32
    masteries?: MatchV3MasteryDto[]
    highestAchievedSeasonTier?: string
    spell1Id?: number // int32
    championId?: number // int32
}
export interface MatchV3ParticipantIdentityDto {
    player?: MatchV3PlayerDto
    participantId?: number // int32
}
export interface MatchV3ParticipantStatsDto {
    physicalDamageDealt?: number // int64
    neutralMinionsKilledTeamJungle?: number // int32
    magicDamageDealt?: number // int64
    totalPlayerScore?: number // int32
    deaths?: number // int32
    win?: boolean
    neutralMinionsKilledEnemyJungle?: number // int32
    altarsCaptured?: number // int32
    largestCriticalStrike?: number // int32
    totalDamageDealt?: number // int64
    magicDamageDealtToChampions?: number // int64
    visionWardsBoughtInGame?: number // int32
    damageDealtToObjectives?: number // int64
    largestKillingSpree?: number // int32
    item1?: number // int32
    quadraKills?: number // int32
    teamObjective?: number // int32
    totalTimeCrowdControlDealt?: number // int32
    longestTimeSpentLiving?: number // int32
    wardsKilled?: number // int32
    firstTowerAssist?: boolean
    firstTowerKill?: boolean
    item2?: number // int32
    item3?: number // int32
    item0?: number // int32
    firstBloodAssist?: boolean
    visionScore?: number // int64
    wardsPlaced?: number // int32
    item4?: number // int32
    item5?: number // int32
    item6?: number // int32
    turretKills?: number // int32
    tripleKills?: number // int32
    damageSelfMitigated?: number // int64
    champLevel?: number // int32
    nodeNeutralizeAssist?: number // int32
    firstInhibitorKill?: boolean
    goldEarned?: number // int32
    magicalDamageTaken?: number // int64
    kills?: number // int32
    doubleKills?: number // int32
    nodeCaptureAssist?: number // int32
    trueDamageTaken?: number // int64
    nodeNeutralize?: number // int32
    firstInhibitorAssist?: boolean
    assists?: number // int32
    unrealKills?: number // int32
    neutralMinionsKilled?: number // int32
    objectivePlayerScore?: number // int32
    combatPlayerScore?: number // int32
    damageDealtToTurrets?: number // int64
    altarsNeutralized?: number // int32
    physicalDamageDealtToChampions?: number // int64
    goldSpent?: number // int32
    trueDamageDealt?: number // int64
    trueDamageDealtToChampions?: number // int64
    participantId?: number // int32
    pentaKills?: number // int32
    totalHeal?: number // int64
    totalMinionsKilled?: number // int32
    firstBloodKill?: boolean
    nodeCapture?: number // int32
    largestMultiKill?: number // int32
    sightWardsBoughtInGame?: number // int32
    totalDamageDealtToChampions?: number // int64
    totalUnitsHealed?: number // int32
    inhibitorKills?: number // int32
    totalScoreRank?: number // int32
    totalDamageTaken?: number // int64
    killingSprees?: number // int32
    timeCCingOthers?: number // int64
    physicalDamageTaken?: number // int64
}
export interface MatchV3ParticipantTimelineDto {
    lane?: string
    participantId?: number // int32
    csDiffPerMinDeltas?: {
        [name: string]: number // double
    }
    goldPerMinDeltas?: {
        [name: string]: number // double
    }
    xpDiffPerMinDeltas?: {
        [name: string]: number // double
    }
    creepsPerMinDeltas?: {
        [name: string]: number // double
    }
    xpPerMinDeltas?: {
        [name: string]: number // double
    }
    role?: string
    damageTakenDiffPerMinDeltas?: {
        [name: string]: number // double
    }
    damageTakenPerMinDeltas?: {
        [name: string]: number // double
    }
}
export interface MatchV3PlayerDto {
    currentPlatformId?: string
    summonerName?: string
    matchHistoryUri?: string
    platformId?: string
    currentAccountId?: number // int64
    profileIcon?: number // int32
    summonerId?: number // int64
    accountId?: number // int64
}
export interface MatchV3RuneDto {
    runeId?: number // int32
    rank?: number // int32
}
export interface MatchV3TeamBansDto {
    pickTurn?: number // int32
    championId?: number // int32
}
export interface MatchV3TeamStatsDto {
    firstDragon?: boolean
    firstInhibitor?: boolean
    bans?: MatchV3TeamBansDto[]
    baronKills?: number // int32
    firstRiftHerald?: boolean
    firstBaron?: boolean
    riftHeraldKills?: number // int32
    firstBlood?: boolean
    teamId?: number // int32
    firstTower?: boolean
    vilemawKills?: number // int32
    inhibitorKills?: number // int32
    towerKills?: number // int32
    dominionVictoryScore?: number // int32
    win?: string
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
