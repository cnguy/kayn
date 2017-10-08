import request from 'superagent';
import URLHelper from '../Utils/URLHelper';
import RegionHelper from '../Utils/RegionHelper';
import RiotRatelimiter from 'riot-ratelimiter';

const limiter = new RiotRatelimiter();

function Request(config, resourceName, endpoint, method) {
  this.payload = {
    method: method || 'GET',
    resourceName,
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
  var self = this;
  this.promise = new Promise(function(innerResolve, innerReject) {
    self.callback((err, res) => {
      if (err) {
        innerReject(err);
      } else {
        innerResolve(res);
      }
    });
  });
  return this.promise.then(resolve, reject);
};

Request.prototype.catch = callback => this.then(null, callback);

Request.prototype.callback = async function(cb) {
  if (!this.payload.region) {
    this.payload.region = this.config.region;
  }
  const { region } = this.payload;

  try {
    const { endpoint, query, resourceName } = this.payload;
    const url = URLHelper.getURLWithQuery(
      RegionHelper.asPlatformID(region),
      resourceName,
      endpoint,
      query,
    );
    const token = this.config.key;
    const res = await limiter.executing({
      url,
      token,
    });

    try {
      const blob = JSON.parse(res);
      cb(null, blob);
    } catch (ex) {
      console.log(ex);
    }
  } catch ({ statusCode }) {
    cb(statusCode, null);
  }
};

export default Request;
