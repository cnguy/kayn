import LRUCache from 'lru-cache'

class _LRUCache {
    constructor(opts) {
        const options = Object.assign(
            { max: 500
                , length: function (n, key) { return 1; }
                , dispose: function (key, n) { }
                , maxAge: 1000 * 10 },
            opts || {},
        )

        console.log(options)

        this.cache = LRUCache(options)
    }

    get(args, cb) {
        const blob = this.cache.get(args.key)
        console.log(blob)
        if (blob) {
            return cb(null, blob)
        }
        return cb("cache key doesn't exist", null)
    }

    set(args, value) {
        this.cache.set(args.key, value
        , args.ttl ? args.ttl : null)
    }

    setExp(date, secs) {
        // Must convert to milliseconds.
        return date + secs * 1000
    }

    flushCache() {
        this.client.reset()
    }
}

export default _LRUCache 
