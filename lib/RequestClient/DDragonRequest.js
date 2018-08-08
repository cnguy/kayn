function DDragonRequest(config, endpoint) {
    this.payload = {
        endpoint,
        locale: '',
        version: '',
    }
    this.config = config
    this.retriesLeft = this.config.requestOptions.numberOfRetriesBeforeAbort
}

Request.prototype.locale = function(locale) {
    if (this.payload.locale)
        throw new Error('Do not call DDragonRequest.locale twice.')
    // Add locale checker
    if (locale) this.payload.locale = locale
    return this
}

Request.prototype.version = function(version) {
    if (typeof obj !== 'string')
        throw new Error('DDragonRequest.version takes in a string.')
    if (version) this.payload.version = version
    return this
}

Request.prototype.then = function then(resolve, reject) {
    const self = this
    return new Promise((innerResolve, innerReject) =>
        self.callback(
            (err, res) => (err ? innerReject(err) : innerResolve(res)),
        ),
    ).then(resolve, reject)
}

Request.prototype.catch = callback => this.then(null, callback)

Request.prototype.callback = function(cb) {
    // TODO: Error checking for `version` and `locale`?
    const { endpoint, locale, version } = this.payload

    // TODO: DDragon endpoint creation. This does nothing right now of course.
    const createUrl = (endpoint, version, locale) => endpoint
    const url = createUrl(endpoint, version, locale)

    this.execute(url, this.retriesLeft, cb)
}

Request.prototype.execute = async function(url, retriesLeft, cb) {
    const { cacheOptions, debugOptions, requestOptions } = this.config
    const fn = async (err, data) => {
        const debugURL = url
        try {
            if (data) {
                if (debugOptions.isEnabled) {
                    debugOptions.loggers.cache.get(debugURL)
                }
                ok(data)(cb)
            } else {
                if (debugOptions.isEnabled) {
                    debugOptions.loggers.request.outgoing(url)
                }
                // TODO: Handle this in the future, of course.
                const makeRequest = () => new Promise(resolve => resolve(true))
                const res = await makeRequest()

                if (debugOptions.isEnabled) {
                    debugOptions.loggers.request.incoming.success(debugURL)
                }

                try {
                    const blob = JSON.parse(res)
                    if (
                        cacheOptions.cache &&
                        cacheOptions.ttls[this.methodName] > 0
                    ) {
                        cacheOptions.cache.set(
                            {
                                key: url,
                                ttl: 0, // TODO: Temporary number.
                            },
                            blob,
                        )
                        if (debugOptions.isEnabled) {
                            debugOptions.loggers.cache.set(`${url}`)
                        }
                    }
                    ok(blob)(cb)
                } catch (ex) {
                    console.log(ex)
                }
            }
        } catch (ex) {
            console.error(ex)
            error({
                ddragonErrorTemporary: ex,
            })(cb)
        }
    }
    if (cacheOptions.cache) {
        cacheOptions.cache.get({ key: url }, fn)
    } else {
        fn()
    }
}

const ok = blob => cb => cb(null, blob)
const error = blob => cb => cb(blob, null)

export default DDragonRequest
