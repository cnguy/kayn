// @flow

import checkAll from './array-checkers'

// Limits should be of the following form:
// [[int,int],[int,int]]
const check = (l: any): boolean =>
    Array.isArray(l) && l.length !== 2 || !checkAll.int(l[0]) || l[0].length !== 2 || !checkAll.int(l[1]) || l[1].length !== 2

export default check