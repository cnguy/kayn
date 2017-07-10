// @flow
// $FlowFixMe
const XRegExp = require('xregexp')

// Not a good type ofc :p
const re: XRegExp = XRegExp('^[0-9\\p{L} _\\.]+$')

export default re