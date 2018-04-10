class BasicJSCache {
    constructor() {
        this.cache = {}
    }

    get(args, cb) {
        if (this.cache[args.key]) {
            if (Date.now() > this.cache[args.key].expires) {
                delete this.cache[args.key]
                return cb('expired cache key', null)
            } else {
                return cb(null, this.cache[args.key].value)
            }
        }
        return cb("cache key doesn't exist", null)
    }

    set(args, value) {
        this.cache[args.key] = {
            expires: args.ttl ? this.setExp(Date.now(), args.ttl) : null,
            value: value,
        }
    }

    setExp(date, ms) {
        return date + ms
    }

    flushCache(cb) {
        this.cache = {}
        // Promise/await compatibility.
        if (typeof cb === 'function') {
            cb(null, 'OK')
        }
    }
}

export default BasicJSCache
