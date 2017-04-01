const XRegExp = require('xregexp')

const re = XRegExp('^[0-9\\p{L} _\\.]+$')

export default re