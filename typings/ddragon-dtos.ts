export interface DDragonRunesReforgedDTO {
    id: number
    key: string
    icon: string
    name: string
    slots: DDragonRunesReforgedSlotDTO[]
}
export interface DDragonRunesReforgedSlotDTO {
    runes: DDragonRunesReforgedRuneDTO[]
}
export interface DDragonRunesReforgedRuneDTO {
    id: number
    key: string
    icon: string
    name: string
    shortDesc: string
    longDesc: string
}
interface DDragonWrapper {
    type: string
    format?: string
    version: string
}
interface DDragonDataWrapper<T> extends DDragonWrapper {
    data: { [key: string]: T }
}
export interface DDragonImageDTO {
    id?: number // Only really used for the ProfileIcon. Should we create an entire interface just for that or leave it here as an optional?
    full: string
    sprite: string
    group: string
    x: number
    y: number
    w: number
    h: number
}
export interface DDragonChampionInfoDTO {
    attack: number
    defense: number
    magic: number
    difficulty: number
}
export interface DDragonChampionStatsDTO {
    hp: number
    hpperlevel: number
    mp: number
    mpperlevel: number
    movespeed: number
    armor: number
    armorperlevel: number
    spellblock: number
    spellblockperlevel: number
    attackrange: number
    hpregen: number
    hpregenperlevel: number
    mpregen: number
    mpregenperlevel: number
    crit: number
    critperlevel: number
    attackdamage: number
    attackdamageperlevel: number
    attackspeedperlevel: number
    attackspeed: number
}
export interface DDragonChampionListDTO extends DDragonDataWrapper<DDragonChampionListDataDTO> {}
export interface DDragonChampionListDataDTO {
    version: string
    id: string
    key: string
    name: string
    title: string
    blurb: string
    info: DDragonChampionInfoDTO
    image: DDragonImageDTO
    tags: string[]
    partype: string
    stats: DDragonChampionStatsDTO
}
export interface DDragonChampionDTO extends DDragonDataWrapper<DDragonChampionDataDTO> {}
interface DDragonSpellWrapper {
    id: string
    name: string
    description: string
    tooltip: string
    maxrank: number
    cooldown: number[]
    cooldownBurn: string
    cost: number[]
    datavalues: {}
    effect: number[][]
    effectBurn: string[]
    vars: {
        link: string
        coeff: number
        key: string
    }[]
    costType: string
    maxammo: string
    range: number[]
    rangeBurn: string
    image: DDragonImageDTO
    resource: string
}
export interface DDragonChampionSpellDTO extends DDragonSpellWrapper {
    costBurn: string[]
    leveltip: {
        label: string[]
        effect: string[]
    }
}
export interface DDragonChampionDataDTO {
    id: string
    key: string
    name: string
    title: string
    image: DDragonImageDTO
    skins: {
        id: string
        num: number
        name: string
        chromas: boolean
    }[]
    lore: string
    blurb: string
    allytips: string[]
    enemytips: string[]
    tags: string[]
    partype: string
    info: DDragonChampionInfoDTO
    stats: DDragonChampionStatsDTO
    spells: DDragonChampionSpellDTO[]
    passive: {
        name: string
        description: string
        image: DDragonImageDTO
    }
    recommended: {
        champion?: string
        title?: string
        map?: string
        mode?: string
        type: string
        customTag: string
        requiredPerk: string
        sortrank: string
        extensionPage: boolean
        customPanel: string
        customPanelCurrencyType?: string
        customPanelBuffCurrencyName?: string
        blocks: {
            type: string
            recMath: boolean
            recSteps?: boolean
            minSummonerLevel: number
            maxSummonerLevel: number
            showIfSummonerSpell: string
            hideIfSummonerSpell: string
            appendAfterSection?: string
            visibleWithAllOf?: string[]
            hiddenWithAnyOf?: string[]
            items: {
                id: string
                count: number
                hideCount: boolean
            }[]
        }[]
    }[]
}
export interface DDragonItemWrapperDTO extends DDragonDataWrapper<DDragonItemDTO> {
    basic: DDragonItemDTO
    groups: {
        id: string
        MaxGroupOwnable: string
    }[]
    tree: {
        header: string
        tags: string[]
    }[]
}
export interface DDragonItemDTO {
    name: string
    rune: {
        isrune: boolean
        tier: number
        type: string
    }
    gold: {
        base: number
        total: number
        sell: number
        purchasable: boolean
    }
    group: string
    description: string
    colloq: string
    plaintext: string
    consumed: boolean
    stacks: number
    depth: number
    consumeOnFull: boolean
    from: string[]
    into: string[]
    image: DDragonImageDTO
    specialRecipe: number
    inStore: boolean
    hideFromAll: boolean
    requiredChampion: string
    requiredAlly: string
    stats: {
        FlatHPPoolMod?: number
        rFlatHPModPerLevel?: number
        FlatMPPoolMod?: number
        rFlatMPModPerLevel?: number
        PercentHPPoolMod?: number
        PercentMPPoolMod?: number
        FlatHPRegenMod?: number
        rFlatHPRegenModPerLevel?: number
        PercentHPRegenMod?: number
        FlatMPRegenMod?: number
        rFlatMPRegenModPerLevel?: number
        PercentMPRegenMod?: number
        FlatArmorMod?: number
        rFlatArmorModPerLevel?: number
        PercentArmorMod?: number
        rFlatArmorPenetrationMod?: number
        rFlatArmorPenetrationModPerLevel?: number
        rPercentArmorPenetrationMod?: number
        rPercentArmorPenetrationModPerLevel?: number
        FlatPhysicalDamageMod?: number
        rFlatPhysicalDamageModPerLevel?: number
        PercentPhysicalDamageMod?: number
        FlatMagicDamageMod?: number
        rFlatMagicDamageModPerLevel?: number
        PercentMagicDamageMod?: number
        FlatMovementSpeedMod?: number
        rFlatMovementSpeedModPerLevel?: number
        PercentMovementSpeedMod?: number
        rPercentMovementSpeedModPerLevel?: number
        FlatAttackSpeedMod?: number
        PercentAttackSpeedMod?: number
        rPercentAttackSpeedModPerLevel?: number
        rFlatDodgeMod?: number
        rFlatDodgeModPerLevel?: number
        PercentDodgeMod?: number
        FlatCritChanceMod?: number
        rFlatCritChanceModPerLevel?: number
        PercentCritChanceMod?: number
        FlatCritDamageMod?: number
        rFlatCritDamageModPerLevel?: number
        PercentCritDamageMod?: number
        FlatBlockMod?: number
        PercentBlockMod?: number
        FlatSpellBlockMod?: number
        rFlatSpellBlockModPerLevel?: number
        PercentSpellBlockMod?: number
        FlatEXPBonus?: number
        PercentEXPBonus?: number
        rPercentCooldownMod?: number
        rPercentCooldownModPerLevel?: number
        rFlatTimeDeadMod?: number
        rFlatTimeDeadModPerLevel?: number
        rPercentTimeDeadMod?: number
        rPercentTimeDeadModPerLevel?: number
        rFlatGoldPer10Mod?: number
        rFlatMagicPenetrationMod?: number
        rFlatMagicPenetrationModPerLevel?: number
        rPercentMagicPenetrationMod?: number
        rPercentMagicPenetrationModPerLevel?: number
        FlatEnergyRegenMod?: number
        rFlatEnergyRegenModPerLevel?: number
        FlatEnergyPoolMod?: number
        rFlatEnergyModPerLevel?: number
        PercentLifeStealMod?: number
        PercentSpellVampMod?: number
    }
    tags: string[]
    maps: { [key: string]: boolean }
    effect?: { [key: string]: string }
}
export interface DDragonLanguageStringDTO extends DDragonDataWrapper<string> {
    tree: {
        searchKeyIgnore: string
        searchKeyRemap: string
    }
}
export interface DDragonMapDTO extends DDragonDataWrapper<DDragonMapDataDTO> {}
export interface DDragonMapDataDTO {
    MapName: string
    MapId: string
    image: DDragonImageDTO
}
export interface DDragonProfileIconDTO extends DDragonDataWrapper<DDragonImageDTO> {}
export interface DDragonRealmsDTO {
    n: {
        item: string
        rune: string
        mastery: string
        summoner: string
        champion: string
        profileicon: string
        map: string
        language: string
        sticker: string
    }
    v: string
    l: string
    cdn: string
    dd: string
    lg: string
    css: string
    profileiconmax: number
    store: null // This is just null on every server I checked. Always exists, but always null.
}
export interface DDragonSummonerSpellDTO extends DDragonDataWrapper<DDragonSummonerSpellDataDTO> {}
export interface DDragonSummonerSpellDataDTO extends DDragonSpellWrapper {
    costBurn: string
    key: string
    summonerLevel: number
    modes: string[]
}
