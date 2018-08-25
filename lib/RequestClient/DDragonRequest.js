import request from 'request'

export const DDragonRequestTypes = {
    REALMS: 'realms',
    API: 'api',
    CDN: {
        BASE: 'cdn', // for just /cdn/endpoint
        TARBALL: 'tarball', // requires own case because the endpoint contains version information, which the Endpoint manager doesn't know of
        DATA: 'cdn_data',
        IMAGE: {
            WITH_VERSION: 'cdn_img_with_version',
            STATIC: 'cdn_img_static',
        },
    },
}

// Not sure how I should handle realms, versions, and a regular URL in an easy-to-code way...
// As realm/version endpoints have different structures from cdn endpoints. We'll see!
// Committing this to just show my thought process for now.
const baseUrl = 'https://ddragon.leagueoflegends.com/'
const createRealmsUrl = endpoint => `${baseUrl}realms/${endpoint}`
const createApiUrl = endpoint => `${baseUrl}api/${endpoint}`
// Note that this function has optional arguments. Be careful!
const createBaseCdnUrl = endpoint => `${baseUrl}cdn/${endpoint}`
const createCdnUrl = (type, version, locale, endpoint) =>
    createBaseCdnUrl(
        `${version ? version + '/' : ''}${type}/${
            locale ? locale + '/' : ''
        }${endpoint}`,
    )
const createDataUrl = (version, locale, endpoint) =>
    createCdnUrl('data', version, locale, endpoint)
const createImageUrl = (version, endpoint) =>
    createCdnUrl('img', version, null, endpoint)

export const ddragonRequestTypeToUrl = (type, urlInformation) => {
    switch (type) {
        case DDragonRequestTypes.REALMS:
            return createRealmsUrl(urlInformation.endpoint)
        case DDragonRequestTypes.API:
            return createApiUrl(urlInformation.endpoint)
        case DDragonRequestTypes.CDN.BASE:
            return createBaseCdnUrl(urlInformation.endpoint)
        case DDragonRequestTypes.CDN.TARBALL:
            return createBaseCdnUrl(`dragontail-${urlInformation.version}.tgz`)
        case DDragonRequestTypes.CDN.DATA:
            return createDataUrl(
                urlInformation.version,
                urlInformation.locale,
                urlInformation.endpoint,
            )
        case DDragonRequestTypes.CDN.IMAGE.WITH_VERSION:
            return createImageUrl(
                urlInformation.version,
                urlInformation.endpoint,
            )
        case DDragonRequestTypes.CDN.IMAGE.STATIC:
            return createImageUrl(null, urlInformation.endpoint)
        default:
            throw new Error('Invalid DDragonRequestType.')
    }
}

function DDragonRequest(config, endpoint, requestType, methodName) {
    this.payload = {
        endpoint,
        locale: '',
        version: '',
        type: requestType,
    }
    this.config = config
    this.methodName = methodName
}

DDragonRequest.prototype.locale = function(locale) {
    if (this.payload.locale)
        throw new Error('Do not call DDragonRequest.locale twice.')
    // Add locale checker
    if (locale) this.payload.locale = locale
    return this
}

DDragonRequest.prototype.version = function(version) {
    if (typeof version !== 'string')
        throw new Error('DDragonRequest.version takes in a string.')
    if (version) this.payload.version = version
    return this
}

DDragonRequest.prototype.then = function then(resolve, reject) {
    const self = this
    return new Promise((innerResolve, innerReject) =>
        self.callback(
            (err, res) => (err ? innerReject(err) : innerResolve(res)),
        ),
    ).then(resolve, reject)
}

DDragonRequest.prototype.catch = callback => this.then(null, callback)

DDragonRequest.prototype.callback = function(cb) {
    if (!this.payload.locale) this.payload.locale = this.config.locale
    const { endpoint, locale, version, type } = this.payload
    const url = ddragonRequestTypeToUrl(type, { endpoint, locale, version })
    this.execute(url, cb)
}

const makeRequest = (url, opts) =>
    new Promise((resolve, reject) => {
        request.get(url, (err, res) => {
            if (err) reject(err)
            else resolve(res)
        })
    })

DDragonRequest.prototype.execute = async function(url, cb) {
    const { cacheOptions, debugOptions } = this.config
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
                const { body: res, statusCode } = await makeRequest(url)

                if (debugOptions.isEnabled) {
                    debugOptions.loggers.request.incoming.success(debugURL)
                }

                try {
                    // `request` is making a JSON request, while this is an XML page,
                    // so it doesn't recognize this error within the `catch` block (I think).
                    if (statusCode >= 300) error({ statusCode, url })(cb)
                    const blob = JSON.parse(res)
                    if (
                        cacheOptions.cache &&
                        cacheOptions.ttls[this.methodName] > 0
                    ) {
                        cacheOptions.cache.set(
                            {
                                key: url,
                                ttl: cacheOptions.ttls[this.methodName],
                            },
                            blob,
                        )
                        if (debugOptions.isEnabled) {
                            debugOptions.loggers.cache.set(`${url}`)
                        }
                    }
                    ok(blob)(cb)
                } catch (ex) {
                    // Don't think this is useful?
                    error({ statusCode: ex.statusCode, url, error: ex })(cb)
                }
            }
        } catch (ex) {
            // Don't think this is useful?
            error({
                statusCode: ex.statusCode,
                url,
                error: ex,
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
