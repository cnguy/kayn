import METHOD_NAMES from './method-names'

/* temp */
const defaultTTLPerGroup = {
    CHAMPION_MASTERY: 1000,
    CHAMPION: 100000,
    LEAGUE: 10000,
    STATIC: 10000000,
    LOL_STATUS: 3000,
    MATCH: 99999,
    SPECTATOR: 0,
    SUMMONER: 9999,
    THIRD_PARTY_CODE: 0,
    TOURNAMENT_STUB: 0,
    TOURNAMENT: 0,
}

export const makeTTLsFromGroupedTTLs = obj => {
    const ttls = []
    Object.keys(obj).map(key => {
        Object.keys(METHOD_NAMES[key]).map(innerKey => {
            ttls.push({
                [innerKey]: obj[key],
            })
        })
    })
    return ttls
}

const defaults = makeTTLsFromGroupedTTLs(defaultTTLPerGroup)

export default defaults.reduce(
    (total, curr) => ({
        ...total,
        ...curr,
    }),
    {},
)
