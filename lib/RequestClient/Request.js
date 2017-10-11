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

Request.prototype.callback = async function(cb) {
  if (!this.payload.region) {
    this.payload.region = this.config.region;
  }

  try {
    const { endpoint, query, region, serviceName } = this.payload;
    const url = URLHelper.getURLWithQuery(
      RegionHelper.asPlatformID(region),
      serviceName,
      endpoint,
      query,
    );
    const { key: token } = this.config;
    const res = await limiter.executing({
      url,
      token,
    });

    try {
      const blob = JSON.parse(res);
      ok(blob)(cb);
    } catch (ex) {
      console.log(ex);
    }
  } catch ({ statusCode }) {
    error(statusCode)(cb);
  }
};

const ok = blob => cb => cb(null, blob);
const error = statusCode => cb => cb(statusCode, null);

export default Request;
