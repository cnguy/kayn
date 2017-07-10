// @flow

const validTTL = (ttl: any): boolean =>
    Number.isInteger(ttl) && ttl > 0

export default validTTL