// @flow
// $FlowFixMe
const redis = require('redis')

import type { callback } from '../constants/flow-types'


class RedisCache {
  client: any
  prefix: string

  constructor(opts: {
    host: string,
    port: number,
    keyPrefix: string
  }) {
    const options = Object.assign({}, opts || {}, {
      host: '127.0.0.1',
      port: 6379,
      keyPrefix: 'kindredAPI-'
    })

    this.client = redis.createClient(options.port, options.host)
    this.client.on('error', function (err) {
      console.log('Redis error:', err)
    })

    this.prefix = options.keyPrefix
  }

  get(args: { key: string }, cb: callback): void {
    this.client.get(this.prefix + args.key, (err, reply) => {
      reply ? cb(err, reply) : cb(err)
      return
    })
  }

  set(args: { key: string, ttl: number }, value: any): void {
    this.client.setex(this.prefix + args.key, args.ttl, value)
  }
}

export default RedisCache