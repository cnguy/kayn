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
            },
            opts || {},
        )

        if (options.maxAge) {
            console.error(
                "[kayn] Do not use options.maxAge. It will not do anything. Rely on ttl's instead.",
            )
        }

        this.cache = new LRUCache(options)
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
