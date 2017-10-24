import URLHelper from '../Utils/URLHelper';
import RegionHelper from '../Utils/RegionHelper';

require('babel-polyfill');

function Request(config, serviceName, endpoint, methodName, httpMethodType, limiter) {
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
  if (this.payload.region) throw new Error('Do not call Request.region twice.');
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
    self.callback((err, res) => (err ? innerReject(err) : innerResolve(res))),
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
    const debugURL =
      url + (debugOptions.showKey ? URLHelper.getAPIKey(url, token) : '');
    try {
      if (data) {
        if (debugOptions.isEnabled) {
          console.log('CACHE HIT @', debugURL);
        }
        ok(data)(cb);
      } else {
        const res = await this.limiter.executing({ url, token });

        if (debugOptions.isEnabled) {
          console.log('200 @', debugURL);
        }

        try {
          const blob = JSON.parse(res);
          cacheOptions &&
            cacheOptions.cache &&
            cacheOptions.cache.set(
              { key: url, ttl: cacheOptions.ttls[this.methodName] },
              blob,
            );
          ok(blob)(cb);
        } catch (ex) {
          console.log(ex);
        }
      }
    } catch ({ statusCode }) {
      if (debugOptions.isEnabled) {
        console.log(statusCode, '@', debugURL);
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
