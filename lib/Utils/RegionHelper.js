import regions from 'Enums/regions'
import platformIDs from 'Enums/platform-ids'

const regionKeys = Object.keys(regions)
const asPlatformID = regionAbbr => platformIDs[regionKeys.find(eq(regionAbbr))]
const isValidRegion = val => regionKeys.some(eq(val))

const RegionHelper = {
    asPlatformID,
    isValidRegion,
}

const eq = v => k => regions[k] === v

export default RegionHelper
