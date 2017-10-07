'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _URLHelper = require('../Utils/URLHelper');

var _URLHelper2 = _interopRequireDefault(_URLHelper);

var _RegionHelper = require('../Utils/RegionHelper');

var _RegionHelper2 = _interopRequireDefault(_RegionHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function Request(config, resourceName, endpoint, method) {
  this.payload = {
    method: method || 'GET',
    resourceName: resourceName,
    endpoint: endpoint || '',
    query: [],
    region: ''
  };
  this.config = config;
}

Request.prototype.region = function (region) {
  if (region) this.payload.region = region;
  return this;
};

Request.prototype.query = function (obj) {
  if (obj) this.payload.query.push(obj);
  return this;
};

Request.prototype.then = function then(resolve, reject) {
  var self = this;
  this.promise = new Promise(function (innerResolve, innerReject) {
    self.callback(function (err, res) {
      console.log('err:', err);
      if (err) {
        innerReject(err);
      } else {
        innerResolve(res);
      }
    });
  });
  return this.promise.then(resolve, reject);
};

Request.prototype.catch = function (callback) {
  return undefined.then(null, callback);
};

Request.prototype.callback = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(cb) {
    var region, req, status;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!this.payload.region) {
              this.payload.region = this.config.region;
            }
            region = this.payload.region;
            _context.prev = 2;
            _context.next = 5;
            return _superagent2.default.get(_URLHelper2.default.createFullURL(_RegionHelper2.default.asPlatformID(region), this.payload.resourceName, this.payload.endpoint, this.config.key));

          case 5:
            req = _context.sent;


            cb(null, req.body);
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](2);
            status = _context.t0.status;

            cb(status, null);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 9]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = Request;