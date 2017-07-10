// @flow

import type { callback } from '../constants/flow-types'

class InMemoryCache {
  cache: any

  constructor() {
    this.cache = {}
  }

  get(args: { key: string }, cb: callback): void {
    if (this.cache[args.key]) {
      if (Date.now() > this.cache[args.key].expires) {
        delete this.cache[args.key]
        return cb('expired cache key')
      } else {
        return cb(null, this.cache[args.key].value)
      }
    }
    return cb('cache key doesn\'t exist')
  }

  set(args: { key: string, ttl: number }, value: any): void {
    this.cache[args.key] = {
      expires: args.ttl ? this.setExp(Date.now(), args.ttl) : null,
      value: value
    }
  }

  setExp(date: number, secs: number): number  {
    // Must convert to milliseconds.
    return date + secs * 1000
  }
}

export default InMemoryCache