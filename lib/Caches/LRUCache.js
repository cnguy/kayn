import LRUCache from 'lru-cache'

class _LRUCache {
    constructor(opts) {
        const options = Object.assign(
            {
                max: 500,
                length: function(n, key) {
                    return 1
                },
                dispose: function(key, n) {},
                maxAge: 1000 * 10,
            },
            opts || {},
        )

        this.cache = LRUCache(options)
    }

    get(args, cb) {
        const blob = this.cache.get(args.key)
        return blob ? cb(null, blob) : cb("cache key doesn't exist", null)
    }

    set(args, value) {
        this.cache.set(args.key, value, args.ttl ? args.ttl : null)
    }

    flushCache(cb) {
        this.cache.reset()
        if (typeof cb === 'function') {
            cb(null, 'OK')
        }
    }
}

export default _LRUCache
