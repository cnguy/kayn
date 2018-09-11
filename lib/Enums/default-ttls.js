import METHOD_NAMES from './method-names'

const defaultTTLPerGroup = {
    CHAMPION_MASTERY: 60 * 60, // 1 hr
    CHAMPION: 60 * 60 * 24 * 7, // 7 days
    DDRAGON: 60 * 60 * 24 * 30, // 30 days
    LEAGUE: 60 * 60 * 12, // 12 hrs
    LOL_STATUS: 0,
    MATCH: 60 * 60 * 24 * 7, // 7 days,
    SPECTATOR: 0,
    SUMMONER: 60 * 60 * 24 * 7, // 7 days
    THIRD_PARTY_CODE: 0,
    TOURNAMENT_STUB: 0,
    TOURNAMENT: 0,
}

export const makeTTLsFromGroupedTTLs = obj => {
    const ttls = []
    Object.keys(obj).map(key => {
        Object.keys(METHOD_NAMES[key]).map(innerKey => {
            ttls.push({
                [METHOD_NAMES[key][innerKey]]: obj[key],
            })
        })
    })
    return ttls.reduce((total, curr) => ({ ...total, ...curr }), {})
}

const defaults = makeTTLsFromGroupedTTLs(defaultTTLPerGroup)

export default defaults
