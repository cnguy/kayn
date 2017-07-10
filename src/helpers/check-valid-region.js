// @flow

import RGS from '../constants/regions'

const check = (region: string): boolean =>
  Object.keys(RGS).some(key => RGS[key] === region)

export default check