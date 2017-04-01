import REGIONS from '../constants/regions'

const check = region => {
  for (const r of Object.keys(REGIONS))
    if (REGIONS[r] === region) return true

  return false
}

export default check