(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('kindred-api', ['module', 'double-ended-queue', 'request', 'chalk', 'xregexp'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('double-ended-queue'), require('request'), require('chalk'), require('xregexp'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.doubleEndedQueue, global.request, global.chalk, global.xregexp);
    global.kindredApi = mod.exports;
  }
})(this, function (module, Deque, request, chalk, XRegExp) {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var RateLimit = function () {
    function RateLimit(allowedRequests, seconds) {
      _classCallCheck(this, RateLimit);

      this.allowedRequests = allowedRequests;
      this.seconds = seconds;
      this.madeRequests = new Deque();
    }

    _createClass(RateLimit, [{
      key: '__reload',
      value: function __reload() {
        var t = new Date().getTime();

        while (this.madeRequests.length > 0 && t - this.madeRequests.peekFront() >= this.seconds * 1000) {
          this.madeRequests.shift();
        }
      }
    }, {
      key: 'addRequest',
      value: function addRequest() {
        this.madeRequests.push(new Date().getTime() + this.seconds * 1000);
      }
    }, {
      key: 'requestAvailable',
      value: function requestAvailable() {
        this.__reload();
        return this.madeRequests.length < this.allowedRequests;
      }
    }]);

    return RateLimit;
  }();

  var platformIds = {
    BRAZIL: 'BR1',
    EUROPE: 'EUN1',
    EUROPE_WEST: 'EUW1',
    KOREA: 'KR',
    LATIN_AMERICA_NORTH: 'LA1',
    LATIN_AMERICA_SOUTH: 'LA2',
    NORTH_AMERICA: 'NA1',
    OCEANIA: 'OC1',
    RUSSIA: 'RU',
    TURKEY: 'TR1',
    JAPAN: 'JP1'
  };

  var regions = {
    BRAZIL: 'br',
    EUROPE: 'eune',
    EUROPE_WEST: 'euw',
    KOREA: 'kr',
    LATIN_AMERICA_NORTH: 'lan',
    LATIN_AMERICA_SOUTH: 'las',
    NORTH_AMERICA: 'na',
    OCEANIA: 'oce',
    RUSSIA: 'ru',
    TURKEY: 'tr',
    JAPAN: 'jp'
  };

  var regions$1 = {
    br: 'BRAZIL',
    eune: 'EUROPE',
    euw: 'EUROPE_WEST',
    kr: 'KOREA',
    lan: 'LATIN_AMERICA_NORTH',
    las: 'LATIN_AMERICA_SOUTH',
    na: 'NORTH_AMERICA',
    oce: 'OCEANIA',
    ru: 'RUSSIA',
    tr: 'TURKEY',
    jp: 'JAPAN'
  };

  var versions = {
    'CHAMPION': 1.2,
    'CURRENT_GAME': 1.0,
    'FEATURED_GAMES': 1.0,
    'GAME': 1.3,
    'LEAGUE': 2.5,
    'STATIC_DATA': 1.2,
    'STATUS': 1.0,
    'MATCH': 2.2,
    'MATCH_LIST': 2.2,
    'RUNES_MASTERIES': 1.4,
    'STATS': 1.3,
    'SUMMONER': 1.4
  };

  var checkAllHelpers = {
    int: function int(arr) {
      return arr.every(function (i) {
        return Number.isInteger(i);
      });
    },
    string: function string(arr) {
      return arr.every(function (i) {
        return typeof i === 'string';
      });
    }
  };

  var checkAll = {
    int: function int(arr) {
      return arr && Array.isArray(arr) && checkAllHelpers.int(arr) && arr.length > 0;
    },
    string: function string(arr) {
      return arr && Array.isArray(arr) && checkAllHelpers.string(arr) && arr.length > 0;
    }
  };

  var codes = {
    400: 'Bad Request',
    403: 'Forbidden',
    404: 'Not Found',
    415: 'Unsupported Media Type',
    429: 'Rate Limit Exceeded',
    500: 'Internal Service Error',
    503: 'Service Unavailable'
  };

  var getResponseMessage = function getResponseMessage(code) {
    var message = codes[code];
    if (!message) return;
    return message;
  };

  var re = XRegExp('^[0-9\\p{L} _\\.]+$');

  var Kindred$1 = function () {
    function Kindred$1(_ref) {
      var key = _ref.key,
          _ref$defaultRegion = _ref.defaultRegion,
          defaultRegion = _ref$defaultRegion === undefined ? regions.NORTH_AMERICA : _ref$defaultRegion,
          _ref$debug = _ref.debug,
          debug = _ref$debug === undefined ? false : _ref$debug,
          limits = _ref.limits;

      _classCallCheck(this, Kindred$1);

      this.key = key;

      var foundRegion = void 0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(regions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _region = _step.value;

          if (regions[_region] === defaultRegion) {
            foundRegion = true;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.defaultRegion = foundRegion ? defaultRegion : undefined;

      if (!this.defaultRegion) {
        console.log('' + chalk.red('Initialization of Kindred failed: ' + chalk.yellow(defaultRegion) + ' is an invalid region.'));
        console.log('' + chalk.red('Try importing ' + chalk.yellow("require('./dist/kindred-api').REGIONS") + ' and using one of those values instead.'));
        process.exit(1);
      }

      this.debug = debug;

      if (limits) {
        var invalid = (Array.isArray(limits) && limits.length !== 2 || !checkAll.int(limits[0]) || limits[0].length !== 2 || !checkAll.int(limits[1]) || limits[1].length !== 2) && limits !== 'dev' && limits !== 'prod';

        if (invalid) {
          console.log(chalk.red('Initialization of Kindred failed: Invalid ' + chalk.yellow('limits') + '. Valid examples: ' + chalk.yellow('[[10, 10], [500, 600]]')) + '.');
          console.log(chalk.red('You can also pass in one of these two strings:') + ' dev/prod ');
          console.log('' + chalk.red('and Kindred will set the limits appropriately.'));
          process.exit(1);
        }

        this.limits = {};

        if (limits === 'dev') limits = [[10, 10], [500, 600]];
        if (limits === 'prod') limits = [[3000, 10], [180000, 600]];

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.keys(regions)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var region = _step2.value;

            this.limits[regions[region]] = [new RateLimit(limits[0][0], limits[0][1]), new RateLimit(limits[1][0], limits[1][1])];
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }

    _createClass(Kindred$1, [{
      key: 'canMakeRequest',
      value: function canMakeRequest(region) {
        if (!this.limits[region][0].requestAvailable() || !this.limits[region][1].requestAvailable()) {
          return false;
        }

        return true;
      }
    }, {
      key: '_sanitizeName',
      value: function _sanitizeName(name) {
        if (this._validName(name)) {
          return name.replace(/\s/g, '').toLowerCase();
        } else {
          this._logError(this._validName.name, 'Name ' + chalk.yellow(name) + ' is not valid. Request failed.');
          process.exit(1);
        }
      }
    }, {
      key: '_validName',
      value: function _validName(name) {
        return re.test(name);
      }
    }, {
      key: '_makeUrl',
      value: function _makeUrl(query, region, staticReq, status, observerMode, championMastery) {
        var mid = staticReq ? '' : region + '/';
        var prefix = !status && !observerMode && !championMastery ? 'api/lol/' + mid : '';

        return 'https://' + region + '.api.riotgames.com/' + prefix + encodeURI(query) + '?api_key=' + this.key;
      }
    }, {
      key: '_baseRequest',
      value: function _baseRequest(_ref2, cb) {
        var _this = this;

        var endUrl = _ref2.endUrl,
            _ref2$region = _ref2.region,
            region = _ref2$region === undefined ? this.defaultRegion : _ref2$region,
            _ref2$status = _ref2.status,
            status = _ref2$status === undefined ? false : _ref2$status,
            _ref2$observerMode = _ref2.observerMode,
            observerMode = _ref2$observerMode === undefined ? false : _ref2$observerMode,
            _ref2$staticReq = _ref2.staticReq,
            staticReq = _ref2$staticReq === undefined ? false : _ref2$staticReq,
            _ref2$championMastery = _ref2.championMastery,
            championMastery = _ref2$championMastery === undefined ? false : _ref2$championMastery,
            _ref2$options = _ref2.options,
            options = _ref2$options === undefined ? {} : _ref2$options;

        return new Promise(function (resolve, reject) {
          var proxy = staticReq ? 'global' : region;
          var reqUrl = _this._makeUrl(endUrl, proxy, staticReq, status, observerMode, championMastery);

          if (_this.limits) {
            var self = _this;

            (function sendRequest(callback) {
              if (self.canMakeRequest(region)) {
                if (!staticReq) {
                  self.limits[region][0].addRequest();
                  self.limits[region][1].addRequest();
                }

                request({ url: reqUrl, qs: options }, function (error, response, body) {
                  if (response && body) {
                    var statusMessage = void 0;
                    var statusCode = response.statusCode;


                    if (statusCode >= 200 && statusCode < 300) statusMessage = chalk.green(statusCode);else if (statusCode >= 400 && statusCode < 500) statusMessage = chalk.red(statusCode + ' ' + getResponseMessage(statusCode));else if (statusCode >= 500) statusMessage = chalk.bold.red(statusCode + ' ' + getResponseMessage(statusCode));

                    if (self.debug) {
                      console.log(statusMessage, reqUrl);
                      console.log({
                        'x-app-rate-limit-count': response.headers['x-app-rate-limit-count'],
                        'x-method-rate-limit-count': response.headers['x-method-rate-limit-count'],
                        'x-rate-limit-count': response.headers['x-rate-limit-count'],
                        'retry-after': response.headers['retry-after']
                      });
                      console.log();
                    }

                    if (callback) {
                      if (statusCode >= 500) {
                        if (self.debug) console.log('!!! resending request !!!');
                        setTimeout(function () {
                          sendRequest.bind(self)(callback);
                        }, 1000);
                      }

                      if (statusCode === 429) {
                        if (self.debug) console.log('!!! resending request !!!');
                        setTimeout(function () {
                          sendRequest.bind(self)(callback);
                        }, response.headers['retry-after'] * 1000 + 50);
                      }

                      if (statusCode >= 400) return callback(statusMessage + ' : ' + chalk.yellow(reqUrl));else return callback(error, JSON.parse(body));
                    } else {
                      if (error) {
                        return reject('err:', error);
                      } else {
                        return resolve(JSON.parse(body));
                      }
                    }
                  } else {
                    console.log(error, reqUrl);
                  }
                });
              } else {
                setTimeout(function () {
                  sendRequest.bind(self)(callback);
                }, 1000);
              }
            })(cb);
          } else {
            request({ url: reqUrl, qs: options }, function (error, response, body) {
              if (response) {
                var statusMessage = void 0;
                var statusCode = response.statusCode;


                if (statusCode >= 200 && statusCode < 300) statusMessage = chalk.green(statusCode);else if (statusCode >= 400 && statusCode < 500) statusMessage = chalk.red(statusCode + ' ' + getResponseMessage(statusCode));else if (statusCode >= 500) statusMessage = chalk.bold.red(statusCode + ' ' + getResponseMessage(statusCode));

                if (_this.debug) {
                  console.log(response && statusMessage, reqUrl);
                  console.log({
                    'x-app-rate-limit-count': response.headers['x-app-rate-limit-count'],
                    'x-method-rate-limit-count': response.headers['x-method-rate-limit-count'],
                    'x-rate-limit-count': response.headers['x-rate-limit-count'],
                    'retry-after': response.headers['retry-after']
                  });
                }

                if (cb) {
                  if (statusCode >= 400) return cb(statusMessage + ' : ' + chalk.yellow(reqUrl));else return cb(error, JSON.parse(body));
                } else {
                  if (error) {
                    return reject('err:', error);
                  } else {
                    return resolve(JSON.parse(body));
                  }
                }
              } else {
                console.log(error, reqUrl);
              }
            });
          }
        });
      }
    }, {
      key: '_observerRequest',
      value: function _observerRequest(_ref3, cb) {
        var endUrl = _ref3.endUrl,
            region = _ref3.region;

        return this._baseRequest({
          endUrl: 'observer-mode/rest/' + endUrl,
          observerMode: true,
          region: region
        }, cb);
      }
    }, {
      key: '_championRequest',
      value: function _championRequest(_ref4, cb) {
        var endUrl = _ref4.endUrl,
            region = _ref4.region,
            options = _ref4.options;

        return this._baseRequest({
          endUrl: 'v' + versions.CHAMPION + '/' + endUrl,
          region: region, options: options
        }, cb);
      }
    }, {
      key: '_championMasteryRequest',
      value: function _championMasteryRequest(_ref5, cb) {
        var endUrl = _ref5.endUrl,
            region = _ref5.region,
            options = _ref5.options;

        return this._baseRequest({
          endUrl: 'championmastery/location/' + endUrl, options: options,
          championMastery: true
        }, cb);
      }
    }, {
      key: '_currentGameRequest',
      value: function _currentGameRequest(_ref6, cb) {
        var endUrl = _ref6.endUrl,
            region = _ref6.region,
            platformId = _ref6.platformId;

        return this._observerRequest({
          endUrl: 'consumer/getSpectatorGameInfo/' + platformId + '/' + endUrl,
          region: region
        }, cb);
      }
    }, {
      key: '_staticRequest',
      value: function _staticRequest(_ref7, cb) {
        var endUrl = _ref7.endUrl,
            _ref7$region = _ref7.region,
            region = _ref7$region === undefined ? this.defaultRegion : _ref7$region,
            options = _ref7.options;

        return this._baseRequest({
          endUrl: 'static-data/' + region + '/v' + versions.STATIC_DATA + '/' + endUrl,
          staticReq: true,
          region: region,
          options: options
        }, cb);
      }
    }, {
      key: '_statusRequest',
      value: function _statusRequest(_ref8, cb) {
        var endUrl = _ref8.endUrl,
            region = _ref8.region,
            options = _ref8.options;

        return this._baseRequest({
          endUrl: 'lol/status/v' + versions.STATUS + '/' + endUrl,
          status: true,
          options: options
        }, cb);
      }
    }, {
      key: '_gameRequest',
      value: function _gameRequest(_ref9, cb) {
        var endUrl = _ref9.endUrl,
            region = _ref9.region;

        return this._baseRequest({
          endUrl: 'v' + versions.GAME + '/game/' + endUrl, region: region
        }, cb);
      }
    }, {
      key: '_leagueRequest',
      value: function _leagueRequest(_ref10, cb) {
        var endUrl = _ref10.endUrl,
            region = _ref10.region,
            options = _ref10.options;

        return this._baseRequest({
          endUrl: 'v' + versions.LEAGUE + '/league/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_matchRequest',
      value: function _matchRequest(_ref11, cb) {
        var endUrl = _ref11.endUrl,
            region = _ref11.region,
            options = _ref11.options;

        return this._baseRequest({
          endUrl: 'v' + versions.MATCH + '/match/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_matchListRequest',
      value: function _matchListRequest(_ref12, cb) {
        var endUrl = _ref12.endUrl,
            region = _ref12.region,
            options = _ref12.options;

        return this._baseRequest({
          endUrl: 'v' + versions.MATCH_LIST + '/matchlist/by-summoner/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_runesMasteriesRequest',
      value: function _runesMasteriesRequest(_ref13, cb) {
        var endUrl = _ref13.endUrl,
            region = _ref13.region;

        return this._summonerRequest({ endUrl: endUrl, region: region }, cb);
      }
    }, {
      key: '_statsRequest',
      value: function _statsRequest(_ref14, cb) {
        var endUrl = _ref14.endUrl,
            region = _ref14.region,
            options = _ref14.options;

        return this._baseRequest({
          endUrl: 'v' + versions.STATS + '/stats/by-summoner/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_summonerRequest',
      value: function _summonerRequest(_ref15, cb) {
        var endUrl = _ref15.endUrl,
            region = _ref15.region;

        return this._baseRequest({
          endUrl: 'v' + versions.SUMMONER + '/summoner/' + endUrl, region: region
        }, cb);
      }
    }, {
      key: '_logError',
      value: function _logError(message, expected) {
        console.log(chalk.bold.yellow(message), chalk.red('request'), chalk.bold.red('FAILED') + chalk.red('; ' + expected));
      }
    }, {
      key: 'setRegion',
      value: function setRegion(region) {
        this.defaultRegion = region;
      }
    }, {
      key: 'getChamps',
      value: function getChamps(_ref16, cb) {
        var region = _ref16.region,
            options = _ref16.options;

        return this._championRequest({
          endUrl: 'champion', region: region, options: options
        }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getChamp',
      value: function getChamp(_ref17, cb) {
        var region = _ref17.region,
            id = _ref17.id,
            championID = _ref17.championID;

        if (Number.isInteger(id) || Number.isInteger(championID)) {
          return this._championRequest({
            endUrl: 'champion/' + (id || championID),
            region: region
          }, cb);
        } else {
          return this._logError(this.getChamp.name, 'required params ' + chalk.yellow('`id/championID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getChampMastery',
      value: function getChampMastery() {
        var _ref18 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref18$region = _ref18.region,
            region = _ref18$region === undefined ? this.defaultRegion : _ref18$region,
            playerID = _ref18.playerID,
            championID = _ref18.championID,
            options = _ref18.options;

        var cb = arguments[1];

        if (Number.isInteger(playerID) && Number.isInteger(championID)) {
          var location = platformIds[regions$1[region]];

          return this._championMasteryRequest({
            endUrl: location + '/player/' + playerID + '/champion/' + championID, region: region, options: options
          }, cb);
        } else {
          return this._logError(this.getChampMastery.name, 'required params ' + chalk.yellow('`playerID` (int) AND `championID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getChampMasteries',
      value: function getChampMasteries() {
        var _this2 = this;

        var _ref19 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref19$region = _ref19.region,
            region = _ref19$region === undefined ? this.defaultRegion : _ref19$region,
            id = _ref19.id,
            summonerID = _ref19.summonerID,
            playerID = _ref19.playerID,
            name = _ref19.name,
            options = _ref19.options;

        var cb = arguments[1];

        if (Number.isInteger(id || summonerID || playerID)) {
          var location = platformIds[regions$1[region]];

          return this._championMasteryRequest({
            endUrl: location + '/player/' + (id || summonerID || playerID) + '/champions', region: region, options: options
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          var _location = platformIds[regions$1[region]];

          return this.getSummoner({ name: name, region: region }, function (err, data) {
            if (err) return cb(err);
            return _this2._championMasteryRequest({
              endUrl: _location + '/player/' + data[_this2._sanitizeName(name)].id + '/champions',
              region: region
            }, cb);
          });
        } else {
          return this._logError(this.getChampMasteries.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ' or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getTotalChampMasteryScore',
      value: function getTotalChampMasteryScore() {
        var _this3 = this;

        var _ref20 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref20$region = _ref20.region,
            region = _ref20$region === undefined ? this.defaultRegion : _ref20$region,
            id = _ref20.id,
            summonerID = _ref20.summonerID,
            playerID = _ref20.playerID,
            name = _ref20.name,
            options = _ref20.options;

        var cb = arguments[1];

        if (Number.isInteger(id || summonerID || playerID)) {
          var location = platformIds[regions$1[region]];

          return this._championMasteryRequest({
            endUrl: location + '/player/' + (id || summonerID || playerID) + '/score', region: region, options: options
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          var _location2 = platformIds[regions$1[region]];

          return this.getSummoner({ name: name, region: region }, function (err, data) {
            if (err) return cb(err);
            return _this3._championMasteryRequest({
              endUrl: _location2 + '/player/' + data[_this3._sanitizeName(name)].id + '/score',
              region: region
            }, cb);
          });
        } else {
          return this._logError(this.getTotalChampMasteryScore.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ' or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getTopChamps',
      value: function getTopChamps() {
        var _this4 = this;

        var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref21$region = _ref21.region,
            region = _ref21$region === undefined ? this.defaultRegion : _ref21$region,
            id = _ref21.id,
            summonerID = _ref21.summonerID,
            playerID = _ref21.playerID,
            name = _ref21.name,
            options = _ref21.options;

        var cb = arguments[1];

        if (Number.isInteger(id || summonerID || playerID)) {
          var location = platformIds[regions$1[region]];

          return this._championMasteryRequest({
            endUrl: location + '/player/' + (id || summonerID || playerID) + '/topchampions', region: region, options: options
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          var _location3 = platformIds[regions$1[region]];

          return this.getSummoner({ name: name, region: region }, function (err, data) {
            if (err) return cb(err);
            return _this4._championMasteryRequest({
              endUrl: _location3 + '/player/' + data[_this4._sanitizeName(name)].id + '/topchampions',
              region: region
            }, cb);
          });
        } else {
          return this._logError(this.getTopChamps.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ' or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getCurrentGame',
      value: function getCurrentGame() {
        var _this5 = this;

        var _ref22 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref22$region = _ref22.region,
            region = _ref22$region === undefined ? this.defaultRegion : _ref22$region,
            id = _ref22.id,
            summonerID = _ref22.summonerID,
            playerID = _ref22.playerID,
            name = _ref22.name;

        var cb = arguments[1];

        var platformId = platformIds[regions$1[region]];

        if (Number.isInteger(id || summonerID || playerID)) {
          return this._currentGameRequest({
            endUrl: '' + (id || summonerID || playerID),
            platformId: platformId, region: region
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            if (err) return cb(err);
            return _this5._currentGameRequest({
              endUrl: '' + data[_this5._sanitizeName(name)].id, platformId: platformId, region: region
            }, cb);
          });
        } else {
          return this._logError(this.getCurrentGame.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getFeaturedGames',
      value: function getFeaturedGames() {
        var _ref23 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref23.region;

        var cb = arguments[1];

        return this._observerRequest({
          endUrl: 'featured',
          region: region
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getRecentGames',
      value: function getRecentGames() {
        var _this6 = this;

        var _ref24 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref24.region,
            id = _ref24.id,
            summonerID = _ref24.summonerID,
            playerID = _ref24.playerID,
            name = _ref24.name;

        var cb = arguments[1];

        if (Number.isInteger(id || summonerID || playerID)) {
          return this._gameRequest({
            endUrl: 'by-summoner/' + (id || summonerID || playerID) + '/recent',
            region: region
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            if (err) return cb(err);
            return _this6._gameRequest({
              endUrl: 'by-summoner/' + data[_this6._sanitizeName(name)].id + '/recent', region: region
            }, cb);
          });
        } else {
          return this._logError(this.getRecentGames.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getLeagues',
      value: function getLeagues() {
        var _this7 = this;

        var _ref25 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref25.region,
            ids = _ref25.ids,
            id = _ref25.id,
            summonerIDs = _ref25.summonerIDs,
            summonerID = _ref25.summonerID,
            playerIDs = _ref25.playerIDs,
            playerID = _ref25.playerID,
            names = _ref25.names,
            name = _ref25.name;

        var cb = arguments[1];

        if (checkAll.int(ids || summonerIDs || playerIDs)) {
          return this._leagueRequest({
            endUrl: 'by-summoner/' + (ids || summonerIDs || playerIDs).join(','),
            region: region
          }, cb);
        } else if (Number.isInteger(ids || id || summonerIDs || summonerID || playerIDs || playerID)) {
          return this._leagueRequest({
            endUrl: 'by-summoner/' + (ids || id || summonerIDs || summonerID || playerIDs || playerID),
            region: region
          }, cb);
        } else if (checkAll.string(names)) {
          return this.getSummoners({ names: names, region: region }, function (err, data) {
            if (err) return cb(err);

            var args = [];

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = names[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _name = _step3.value;

                args.push(data[_this7._sanitizeName(_name)].id);
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            return _this7._leagueRequest({ endUrl: 'by-summoner/' + args.join(','), region: region }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            if (err) return cb(err);

            return _this7._leagueRequest({
              endUrl: 'by-summoner/' + data[_this7._sanitizeName(names || name)].id,
              region: region
            }, cb);
          });
        } else {
          return this._logError(this.getLeagues.name, 'required params ' + chalk.yellow('`ids/summonerIDs/playerIDs` ([int]/int)') + ', ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`names` ([str]/str)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getLeagueEntries',
      value: function getLeagueEntries() {
        var _this8 = this;

        var _ref26 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref26.region,
            ids = _ref26.ids,
            id = _ref26.id,
            summonerIDs = _ref26.summonerIDs,
            summonerID = _ref26.summonerID,
            playerIDs = _ref26.playerIDs,
            playerID = _ref26.playerID,
            names = _ref26.names,
            name = _ref26.name;

        var cb = arguments[1];

        if (checkAll.int(ids || summonerIDs || playerIDs)) {
          return this._leagueRequest({
            endUrl: 'by-summoner/' + (ids || summonerIDs || playerIDs).join(',') + '/entry',
            region: region
          }, cb);
        } else if (Number.isInteger(ids || id || summonerIDs || summonerID || playerIDs || playerID)) {
          return this._leagueRequest({
            endUrl: 'by-summoner/' + (ids || id || summonerIDs || summonerID || playerIDs || playerID) + '/entry',
            region: region
          }, cb);
        } else if (checkAll.string(names)) {
          return this.getSummoners({ names: names, region: region }, function (err, data) {
            if (err) return cb(err);

            var args = [];

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = names[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _name2 = _step4.value;

                args.push(data[_this8._sanitizeName(_name2)].id);
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }

            return _this8._leagueRequest({ endUrl: 'by-summoner/' + args.join(',') + '/entry', region: region }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            if (err) return cb(err);
            return _this8._leagueRequest({
              endUrl: 'by-summoner/' + data[_this8._sanitizeName(names || name)].id + '/entry',
              region: region
            }, cb);
          });
        } else {
          this._logError(this.getLeagueEntries.name, 'required params ' + chalk.yellow('`ids/summonerIDs/playerIDs` ([int]/int)') + ', ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`names` ([str]/str)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getChallengers',
      value: function getChallengers() {
        var _ref27 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref27.region,
            _ref27$options = _ref27.options,
            options = _ref27$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref27$options;

        var cb = arguments[1];

        return this._leagueRequest({
          endUrl: 'challenger', region: region, options: options
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMasters',
      value: function getMasters() {
        var _ref28 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref28.region,
            _ref28$options = _ref28.options,
            options = _ref28$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref28$options;

        var cb = arguments[1];

        return this._leagueRequest({
          endUrl: 'master', region: region, options: options
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getChampionList',
      value: function getChampionList() {
        var _ref29 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref29.region,
            options = _ref29.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'champion', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getChampion',
      value: function getChampion() {
        var _ref30 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref30.region,
            id = _ref30.id,
            championID = _ref30.championID,
            options = _ref30.options;

        var cb = arguments[1];

        if (Number.isInteger(id || championID)) {
          return this._staticRequest({ endUrl: 'champion/' + (id || championID), region: region, options: options }, cb);
        } else {
          return this._logError(this.getChampion.name, 'required params ' + chalk.yellow('`id/championID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getItems',
      value: function getItems() {
        var _ref31 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref31.region,
            options = _ref31.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'item', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getItem',
      value: function getItem() {
        var _ref32 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref32.region,
            id = _ref32.id,
            itemID = _ref32.itemID,
            options = _ref32.options;

        var cb = arguments[1];

        if (Number.isInteger(id || itemID)) {
          return this._staticRequest({ endUrl: 'item/' + (id || itemID), region: region, options: options }, cb);
        } else {
          return this._logError(this.getItem.name, 'required params ' + chalk.yellow('`id/itemID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getLanguageStrings',
      value: function getLanguageStrings() {
        var _ref33 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref33.region,
            options = _ref33.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'language-strings', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getLanguages',
      value: function getLanguages() {
        var _ref34 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref34.region;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'languages', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMap',
      value: function getMap() {
        var _ref35 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref35.region,
            options = _ref35.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'map', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getMasteryList',
      value: function getMasteryList() {
        var _ref36 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref36.region,
            options = _ref36.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'mastery', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getMastery',
      value: function getMastery() {
        var _ref37 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref37.region,
            id = _ref37.id,
            masteryID = _ref37.masteryID,
            options = _ref37.options;

        var cb = arguments[1];

        if (Number.isInteger(id || masteryID)) {
          return this._staticRequest({
            endUrl: 'mastery/' + (id || masteryID),
            region: region, options: options
          }, cb);
        } else {
          return this._logError(this.getMastery.name, 'required params ' + chalk.yellow('`id/masteryID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getRealmData',
      value: function getRealmData() {
        var _ref38 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref38.region;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'realm', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getRuneList',
      value: function getRuneList() {
        var _ref39 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref39.region,
            options = _ref39.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'rune', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getRune',
      value: function getRune() {
        var _ref40 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref40.region,
            id = _ref40.id,
            runeID = _ref40.runeID,
            options = _ref40.options;

        var cb = arguments[1];

        if (Number.isInteger(id || runeID)) {
          return this._staticRequest({ endUrl: 'rune/' + (id || runeID), region: region, options: options }, cb);
        } else {
          return this._logError(this.getRune.name, 'required params ' + chalk.yellow('`id/runeID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummonerSpells',
      value: function getSummonerSpells() {
        var _ref41 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref41.region,
            options = _ref41.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'summoner-spell', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getSummonerSpell',
      value: function getSummonerSpell() {
        var _ref42 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref42.region,
            id = _ref42.id,
            spellID = _ref42.spellID,
            summonerSpellID = _ref42.summonerSpellID,
            options = _ref42.options;

        var cb = arguments[1];

        if (Number.isInteger(id || spellID || summonerSpellID)) {
          return this._staticRequest({
            endUrl: 'summoner-spell/' + (id || spellID || summonerSpellID),
            region: region, options: options
          }, cb);
        } else {
          return this._logError(this.getSummonerSpell.name, 'required params ' + chalk.yellow('`id/spellID/summonerSpellID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getVersionData',
      value: function getVersionData() {
        var _ref43 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref43.region,
            options = _ref43.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'versions', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getShardStatus',
      value: function getShardStatus() {
        var _ref44 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref44.region;

        var cb = arguments[1];

        return this._statusRequest({ endUrl: 'shard', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getShardList',
      value: function getShardList() {
        var _ref45 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref45.region;

        var cb = arguments[1];

        return this._statusRequest({ endUrl: 'shards', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMatch',
      value: function getMatch() {
        var _ref46 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref46.region,
            id = _ref46.id,
            matchID = _ref46.matchID,
            _ref46$options = _ref46.options,
            options = _ref46$options === undefined ? { includeTimeline: true } : _ref46$options;

        var cb = arguments[1];

        if (Number.isInteger(id || matchID)) {
          return this._matchRequest({ endUrl: '' + (id || matchID), region: region, options: options }, cb);
        } else {
          return this._logError(this.getMatch.name, 'required params ' + chalk.yellow('`id/matchID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getMatchList',
      value: function getMatchList() {
        var _this9 = this;

        var _ref47 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref47.region,
            id = _ref47.id,
            summonerID = _ref47.summonerID,
            playerID = _ref47.playerID,
            name = _ref47.name,
            _ref47$options = _ref47.options,
            options = _ref47$options === undefined ? { rankedQueues: 'RANKED_SOLO_5x5' } : _ref47$options;

        var cb = arguments[1];

        if (Number.isInteger(id || summonerID || playerID)) {
          return this._matchListRequest({
            endUrl: '' + (id || summonerID || playerID),
            region: region, options: options
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            if (err) return cb(err);
            return _this9._matchListRequest({
              endUrl: '' + data[_this9._sanitizeName(name)].id,
              region: region, options: options
            }, cb);
          });
        } else {
          return this._logError(this.getMatchList.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ' or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getRunes',
      value: function getRunes() {
        var _this10 = this;

        var _ref48 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref48.region,
            ids = _ref48.ids,
            id = _ref48.id,
            summonerIDs = _ref48.summonerIDs,
            summonerID = _ref48.summonerID,
            playerIDs = _ref48.playerIDs,
            playerID = _ref48.playerID,
            names = _ref48.names,
            name = _ref48.name;

        var cb = arguments[1];

        if (checkAll.int(ids || summonerIDs || playerIDs)) {
          return this._runesMasteriesRequest({
            endUrl: (ids || summonerIDs || playerIDs).join() + '/runes',
            region: region
          }, cb);
        } else if (Number.isInteger(ids || id || summonerIDs || summonerID || playerIDs || playerID)) {
          return this._runesMasteriesRequest({
            endUrl: (ids || id || summonerIDs || summonerID || playerIDs || playerID) + '/runes',
            region: region
          }, cb);
        } else if (checkAll.string(names)) {
          return this.getSummoners({ names: names, region: region }, function (err, data) {
            if (err) return cb(err);

            var args = [];

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = names[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var _name3 = _step5.value;

                args.push(data[_this10._sanitizeName(_name3)].id);
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }

            return _this10._runesMasteriesRequest({
              endUrl: args.join(',') + '/runes',
              region: region
            }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            if (err) return cb(err);
            return _this10._runesMasteriesRequest({
              endUrl: data[_this10._sanitizeName(names || name)].id + '/runes',
              region: region
            }, cb);
          });
        } else {
          return this._logError(this.getRunes.name, 'required params ' + chalk.yellow('`ids/summonerIDs/playerIDs` ([int]/int)') + ', ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`names` ([str]/str)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getMasteries',
      value: function getMasteries() {
        var _this11 = this;

        var _ref49 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref49.region,
            ids = _ref49.ids,
            id = _ref49.id,
            summonerIDs = _ref49.summonerIDs,
            summonerID = _ref49.summonerID,
            playerIDs = _ref49.playerIDs,
            playerID = _ref49.playerID,
            names = _ref49.names,
            name = _ref49.name;

        var cb = arguments[1];

        if (checkAll.int(ids || summonerIDs || playerIDs)) {
          return this._runesMasteriesRequest({
            endUrl: (ids || summonerIDs || playerIDs).join() + '/masteries',
            region: region
          }, cb);
        } else if (Number.isInteger(ids || id || summonerIDs || summonerID || playerIDs || playerID)) {
          return this._runesMasteriesRequest({
            endUrl: (ids || id || summonerIDs || summonerID || playerIDs || playerID) + '/masteries',
            region: region
          }, cb);
        } else if (checkAll.string(names)) {
          return this.getSummoners({ names: names, region: region }, function (err, data) {
            if (err) return cb(err);

            var args = [];

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = names[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var _name4 = _step6.value;

                args.push(data[_this11._sanitizeName(_name4)].id);
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }

            return _this11._runesMasteriesRequest({
              endUrl: args.join(',') + '/masteries',
              region: region
            }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            if (err) return cb(err);
            return _this11._runesMasteriesRequest({
              endUrl: data[_this11._sanitizeName(names || name)].id + '/masteries',
              region: region
            }, cb);
          });
        } else {
          return this._logError(this.getMasteries.name, 'required params ' + chalk.yellow('`ids/summonerIDs/playerIDs` ([int]/int)') + ', ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`names` ([str]/str)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getRankedStats',
      value: function getRankedStats() {
        var _this12 = this;

        var _ref50 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref50.region,
            id = _ref50.id,
            summonerID = _ref50.summonerID,
            playerID = _ref50.playerID,
            name = _ref50.name,
            options = _ref50.options;

        var cb = arguments[1];

        if (Number.isInteger(id || summonerID || playerID)) {
          return this._statsRequest({
            endUrl: (id || summonerID || playerID) + '/ranked',
            region: region, options: options
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            if (err) return cb(err);
            return _this12._statsRequest({
              endUrl: data[_this12._sanitizeName(name)].id + '/ranked',
              region: region, options: options
            }, cb);
          });
        } else {
          this._logError(this.getRankedStats.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getStatsSummary',
      value: function getStatsSummary() {
        var _this13 = this;

        var _ref51 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref51.region,
            id = _ref51.id,
            summonerID = _ref51.summonerID,
            playerID = _ref51.playerID,
            name = _ref51.name,
            options = _ref51.options;

        var cb = arguments[1];

        if (Number.isInteger(id || summonerID || playerID)) {
          return this._statsRequest({
            endUrl: (id || summonerID || playerID) + '/summary',
            region: region, options: options
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            if (err) return cb(err);
            return _this13._statsRequest({
              endUrl: data[_this13._sanitizeName(name)].id + '/summary',
              region: region, options: options
            }, cb);
          });
        } else {
          this._logError(this.getRankedStats.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummoners',
      value: function getSummoners() {
        var _this14 = this;

        var _ref52 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref52.region,
            ids = _ref52.ids,
            id = _ref52.id,
            summonerIDs = _ref52.summonerIDs,
            summonerID = _ref52.summonerID,
            playerIDs = _ref52.playerIDs,
            playerID = _ref52.playerID,
            names = _ref52.names,
            name = _ref52.name;

        var cb = arguments[1];

        if (checkAll.int(ids || summonerIDs || playerIDs)) {
          return this._summonerRequest({
            endUrl: '' + (ids || summonerIDs || playerIDs).join(','),
            region: region
          }, cb);
        } else if (Number.isInteger(ids || id || summonerIDs || summonerID || playerIDs || playerID)) {
          return this._summonerRequest({
            endUrl: '' + (ids || id || summonerIDs || summonerID || playerIDs || playerID),
            region: region
          }, cb);
        } else if (checkAll.string(names)) {
          return this._summonerRequest({
            endUrl: 'by-name/' + names.map(function (name) {
              return _this14._sanitizeName(name);
            }).join(','),
            region: region
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this._summonerRequest({
            endUrl: 'by-name/' + this._sanitizeName(names || name),
            region: region
          }, cb);
        } else {
          this._logError(this.getSummoners.name, 'required params ' + chalk.yellow('`ids/summonerIDs/playerIDs` ([int]/int)') + ', ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`names` ([str]/str)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummoner',
      value: function getSummoner() {
        var _ref53 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref53.region,
            id = _ref53.id,
            summonerID = _ref53.summonerID,
            playerID = _ref53.playerID,
            name = _ref53.name;

        var cb = arguments[1];

        if (Number.isInteger(id || summonerID || playerID)) {
          return this.getSummoners({ region: region, ids: [id || summonerID || playerID] }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this.getSummoners({ region: region, names: [name] }, cb);
        } else {
          return this._logError(this.getSummoner.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummonerNames',
      value: function getSummonerNames() {
        var _ref54 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref54.region,
            ids = _ref54.ids,
            id = _ref54.id,
            summonerIDs = _ref54.summonerIDs,
            summonerID = _ref54.summonerID,
            playerIDs = _ref54.playerIDs,
            playerID = _ref54.playerID;

        var cb = arguments[1];

        if (checkAll.int(ids || summonerIDs || playerIDs)) {
          return this._summonerRequest({
            endUrl: (ids || summonerIDs || playerIDs).join(',') + '/name',
            region: region
          }, cb);
        } else if (Number.isInteger(ids || id || summonerIDs || summonerID || playerIDs || playerID)) {
          return this._summonerRequest({
            endUrl: (ids || id || summonerIDs || summonerID || playerIDs || playerID) + '/name',
            region: region
          }, cb);
        } else {
          this._logError(this.getSummonerNames.name, 'required params ' + chalk.yellow('required params `ids/summonerIDs/playerIDs` ([int]/int)') + ' or ' + chalk.yellow('`id/summonerID/playerID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummonerName',
      value: function getSummonerName() {
        var _ref55 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref55.region,
            id = _ref55.id,
            summonerID = _ref55.summonerID,
            playerID = _ref55.playerID;

        var cb = arguments[1];

        if (Number.isInteger(id)) {
          return this.getSummonerNames({ region: region, id: id || summonerID || playerID }, cb);
        } else {
          this._logError(this.getSummonerName.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ' not passed in');
        }
      }
    }]);

    return Kindred$1;
  }();

  var Kindred$2 = {
    Kindred: Kindred$1,
    REGIONS: regions
  };

  module.exports = Kindred$2;
});