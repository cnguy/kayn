import request from 'request'

export const DDragonRequestTypes = {
    REALMS: 'realms',
    API: 'api',
    CDN: {
        DATA: 'cdn_data',
        IMAGE: 'cdn_img',
    },
}

// Not sure how I should handle realms, versions, and a regular URL in an easy-to-code way...
// As realm/version endpoints have different structures from cdn endpoints. We'll see!
// Committing this to just show my thought process for now.
const baseUrl = 'https://ddragon.leagueoflegends.com/'
const createRealmsUrl = endpoint => `${baseUrl}${endpoint}`
const createApiUrl = endpoint => `${baseUrl}/api/${endpoint}`
const createVersionUrl = createApiUrl('versions.json')
const createCdnUrl = (type, version, locale, endpoint) =>
    `${baseUrl}cdn/${version}/${type}/${locale}/${endpoint}`
const createDataUrl = (version, locale, endpoint) =>
    createCdnUrl('data', version, locale, endpoint)
const createImageUrl = (version, locale, endpoint) =>
    createCdnUrl('img', version, locale, endpoint)

const ddragonRequestTypeToUrl = (type, urlInformation) => {
    switch (type) {
        case DDragonRequestTypes.REALMS:
            return createRealmsUrl(urlInformation.endpoint)
        case DDragonRequestTypes.API:
            return createApiUrl(urlInformation.endpoint)
        case DDragonRequestTypes.CDN.DATA:
            return createDataUrl(
                urlInformation.version,
                urlInformation.locale,
                urlInformation.endpoint,
            )
        case DDragonRequestTypes.CDN.IMAGE:
            return createImageUrl(
                urlInformation.version,
                urlInformation.locale,
                urlInformation.endpoint,
            )
        default:
            throw new Error('Invalid DDragonRequestType.')
    }
}

function DDragonRequest(config, endpoint, requestType) {
    this.payload = {
        endpoint,
        locale: '',
        version: '',
        type: requestType,
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
    const { endpoint, locale, version, type } = this.payload

    const url = ddragonRequestTypeToUrl(type, { endpoint, locale, version })

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
