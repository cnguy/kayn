import URLHelper from '../Utils/URLHelper';
import RegionHelper from '../Utils/RegionHelper';

function Request(
    config,
    serviceName,
    endpoint,
    methodName,
    httpMethodType,
    limiter,
) {
    this.payload = {
        method: httpMethodType || 'GET',
        serviceName,
        endpoint,
        query: [],
        region: '',
    };
    this.config = config;
    this.retriesLeft = this.config.requestOptions.numberOfRetriesBeforeAbort;
    this.methodName = methodName;
    this.limiter = limiter;
}

Request.prototype.region = function(region) {
    if (this.payload.region)
        throw new Error('Do not call Request.region twice.');
    if (!RegionHelper.isValidRegion(region))
        throw new Error('Bad region value in Request.region');
    if (region) this.payload.region = region;
    return this;
};

Request.prototype.query = function(obj) {
    if (typeof obj !== 'object')
        throw new Error('Request.query takes in an object');
    if (obj) this.payload.query.push(obj);
    return this;
};

Request.prototype.then = function then(resolve, reject) {
    const self = this;
    return new Promise((innerResolve, innerReject) =>
        self.callback(
            (err, res) => (err ? innerReject(err) : innerResolve(res)),
        ),
    ).then(resolve, reject);
};

Request.prototype.catch = callback => this.then(null, callback);

Request.prototype.callback = function(cb) {
    if (!this.payload.region) {
        this.payload.region = this.config.region;
    }

    const { endpoint, query, region, serviceName } = this.payload;
    const url = URLHelper.getURLWithQuery(
        RegionHelper.asPlatformID(region),
        serviceName,
        endpoint,
        query,
    );
    const { key: token } = this.config;

    this.execute(url, token, this.retriesLeft, cb);
};

Request.prototype.execute = async function(url, token, retriesLeft, cb) {
    const { cacheOptions, debugOptions, requestOptions } = this.config;
    const fn = async (err, data) => {
        const debugURL = `${url}${debugOptions.showKey
            ? URLHelper.getAPIKey(url, token)
            : ''}`;
        try {
            if (data) {
                if (debugOptions.isEnabled) {
                    debugOptions.loggers.cache.get(debugURL);
                }
                ok(data)(cb);
            } else {
                if (debugOptions.isEnabled) {
                    debugOptions.loggers.request.outgoing(`=> ${debugURL}`);
                }
                const res = await this.limiter.executing({ url, token });

                if (debugOptions.isEnabled) {
                    debugOptions.loggers.request.incoming.success(debugURL);
                }

                try {
                    const blob = JSON.parse(res);
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
                        );
                        if (debugOptions.isEnabled) {
                            debugOptions.loggers.cache.set(`${url}`);
                        }
                    }
                    ok(blob)(cb);
                } catch (ex) {
                    console.log(ex);
                }
            }
        } catch ({ statusCode }) {
            console.log(statusCode);
            if (debugOptions.isEnabled) {
                debugOptions.loggers.request.incoming.failure(
                    `[${statusCode}] ${debugURL}`,
                );
            }
            if (requestOptions.shouldRetry && shouldRetry(statusCode)) {
                if (retriesLeft > 0) {
                    return setTimeout(
                        () => this.execute(url, token, retriesLeft - 1, cb),
                        requestOptions.delayBeforeRetry,
                    );
                }
            }
            error(statusCode)(cb);
        }
    };
    if (cacheOptions.cache) {
        cacheOptions.cache.get({ key: url }, fn);
    } else {
        fn();
    }
};

const shouldRetry = statusCode => statusCode === 500 || statusCode === 503;

const ok = blob => cb => cb(null, blob);
const error = statusCode => cb => cb(statusCode, null);

export default Request;
