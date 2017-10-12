import URLHelper from '../Utils/URLHelper';
import RegionHelper from '../Utils/RegionHelper';
import RiotRatelimiter from 'riot-ratelimiter';

const limiter = new RiotRatelimiter();

function Request(config, serviceName, endpoint, method) {
  this.payload = {
    method: method || 'GET',
    serviceName,
    endpoint: endpoint || '',
    query: [],
    region: '',
  };
  this.config = config;
  this.retriesLeft = this.config.requestOptions.numberOfRetriesBeforeAbort;
}

Request.prototype.region = function(region) {
  if (region) this.payload.region = region;
  return this;
};

Request.prototype.query = function(obj) {
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
  const { debugOptions, requestOptions } = this.config;
  const debugURL =
    url + (debugOptions.showKey ? URLHelper.getAPIKey(url, token) : '');

  try {
    const res = await limiter.executing({ url, token });

    if (debugOptions.isEnabled) {
      console.log('200 @', debugURL);
    }

    try {
      const blob = JSON.parse(res);
      ok(blob)(cb);
    } catch (ex) {
      console.log(ex);
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

const shouldRetry = statusCode => statusCode === 500 || statusCode === 503;

const ok = blob => cb => cb(null, blob);
const error = statusCode => cb => cb(statusCode, null);

export default Request;
