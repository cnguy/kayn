import redis from 'redis'

// The set/get are pretty inefficient, but this will do for now.

class RedisCache {
    constructor(opts) {
        const options = Object.assign(
            {
                host: '127.0.0.1',
                port: 6379,
                keyPrefix: 'kayn-',
            },
            opts || {},
        )

        this.client = redis.createClient(options)

        // Should probably remove this...
        this.client.on('error', function(err) {
            console.log('Redis error:', err)
        })

        this.prefix = options.keyPrefix
    }

    get(args, cb) {
        this.client.get(this.prefix + args.key, (err, reply) => {
            reply ? cb(err, JSON.parse(reply)) : cb(err)
            return
        })
    }

    set(args, value) {
        this.client.setex(
            this.prefix + args.key,
            args.ttl,
            JSON.stringify(value),
        )
    }

    flushCache(cb) {
        this.client.flushdb(cb)
    }
}

export default RedisCache
