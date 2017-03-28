(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('kindred-api', ['module', 'double-ended-queue', 'request', 'chalk'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('double-ended-queue'), require('request'), require('chalk'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.doubleEndedQueue, global.request, global.chalk);
    global.kindredApi = mod.exports;
  }
})(this, function (module, Deque, request, chalk) {
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
        this.madeRequests.push(new Date().getTime() + (this.seconds * 1000 + this.seconds * 1000 / 75));
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
      this.defaultRegion = defaultRegion;
      this.debug = debug;

      if (limits) {
        this.limits = [new RateLimit(limits[0][0], limits[0][1]), new RateLimit(limits[1][0], limits[1][1])];
      }
    }

    _createClass(Kindred$1, [{
      key: 'canMakeRequest',
      value: function canMakeRequest() {
        if (!this.limits[0].requestAvailable() || !this.limits[1].requestAvailable()) {
          return false;
        }

        return true;
      }
    }, {
      key: '_sanitizeName',
      value: function _sanitizeName(name) {
        return name.replace(/\s/g, '').toLowerCase();
      }
    }, {
      key: '_validName',
      value: function _validName(name) {
        return (/^[ \.0-9L\\_p\{\}]+$/.test(name)
        );
      }
    }, {
      key: '_makeUrl',
      value: function _makeUrl(query, region, statusReq, status, observerMode) {
        var mid = statusReq ? '' : region + '/';
        var prefix = !status && !observerMode ? 'api/lol/' + mid : observerMode ? '' : 'lol/status/';

        return 'https://' + region + '.api.riotgames.com/' + prefix + encodeURI(query) + '?api_key=' + this.key;
      }
    }, {
      key: '_baseRequest',
      value: function _baseRequest(_ref2, cb) {
        var _this2 = this;

        var endUrl = _ref2.endUrl,
            _ref2$region = _ref2.region,
            region = _ref2$region === undefined ? this.defaultRegion : _ref2$region,
            _ref2$status = _ref2.status,
            status = _ref2$status === undefined ? false : _ref2$status,
            _ref2$observerMode = _ref2.observerMode,
            observerMode = _ref2$observerMode === undefined ? false : _ref2$observerMode,
            _ref2$staticReq = _ref2.staticReq,
            staticReq = _ref2$staticReq === undefined ? false : _ref2$staticReq,
            _ref2$options = _ref2.options,
            options = _ref2$options === undefined ? {} : _ref2$options;

        var proxy = staticReq ? 'global' : region;
        var reqUrl = this._makeUrl(endUrl, proxy, staticReq, status, observerMode);

        if (!cb) {
          console.log(chalk.red('error: No callback passed in for the method call regarding `' + chalk.yellow(reqUrl) + '`'));
        }

        if (this.limits) {
          (function sendRequest() {
            var _this = this;

            if (this.canMakeRequest()) {
              this.limits[0].addRequest();
              this.limits[1].addRequest();
              request({ url: reqUrl, qs: options }, function (error, response, body) {
                var statusMessage = void 0;
                var statusCode = response.statusCode;


                if (statusCode >= 200 && statusCode < 300) statusMessage = chalk.green(statusCode);else if (statusCode >= 400 && statusCode < 500) statusMessage = chalk.red(statusCode);else if (statusCode >= 500) statusMessage = chalk.bold.red(statusCode);

                if (_this.debug) {
                  console.log(response && statusMessage, reqUrl);
                  console.log({
                    'x-app-rate-limit-count': response.headers['x-app-rate-limit-count'],
                    'x-method-rate-limit-count': response.headers['x-method-rate-limit-count'],
                    'x-rate-limit-count': response.headers['x-rate-limit-count'],
                    'retry-after': response.headers['retry-after']
                  });
                }

                if (statusCode >= 500 && _this.limits) {
                  if (_this.debug) console.log('!!! resending request !!!');
                  setTimeout(sendRequest.bind(_this), 1000);
                }

                if (statusCode >= 400) return cb(response && statusMessage);else return cb(error, JSON.parse(body));
              });
            } else {
              setTimeout(sendRequest.bind(this), 1000);
            }
          }).bind(this)(reqUrl, options);
        } else {
          request({ url: reqUrl, qs: options }, function (error, response, body) {
            var statusMessage = void 0;
            var statusCode = response.statusCode;


            if (statusCode >= 200 && statusCode < 300) statusMessage = chalk.green(statusCode);else if (statusCode >= 400 && statusCode < 500) statusMessage = chalk.red(statusCode);else if (statusCode >= 500) statusMessage = chalk.bold.red(statusCode);

            if (_this2.debug) {
              console.log(response && statusMessage, reqUrl);
              console.log({
                'x-app-rate-limit-count': response.headers['x-app-rate-limit-count'],
                'x-method-rate-limit-count': response.headers['x-method-rate-limit-count'],
                'x-rate-limit-count': response.headers['x-rate-limit-count'],
                'retry-after': response.headers['retry-after']
              });
            }

            if (statusCode >= 500 && _this2.limits) {
              if (_this2.debug) console.log('!!! resending request !!!');
              setTimeout(sendRequest.bind(_this2), 1000);
            }

            if (statusCode >= 400) return cb(response && statusMessage);else return cb(error, JSON.parse(body));
          });
        }
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
            region = _ref4.region;

        return this._baseRequest({
          endUrl: 'v' + versions.CHAMPION + '/' + endUrl,
          region: region
        }, cb);
      }
    }, {
      key: '_currentGameRequest',
      value: function _currentGameRequest(_ref5, cb) {
        var endUrl = _ref5.endUrl,
            region = _ref5.region,
            platformId = _ref5.platformId;

        return this._observerRequest({
          endUrl: 'consumer/getSpectatorGameInfo/' + platformId + '/' + endUrl,
          region: region
        }, cb);
      }
    }, {
      key: '_staticRequest',
      value: function _staticRequest(_ref6, cb) {
        var endUrl = _ref6.endUrl,
            _ref6$region = _ref6.region,
            region = _ref6$region === undefined ? this.defaultRegion : _ref6$region,
            options = _ref6.options;

        return this._baseRequest({
          endUrl: 'static-data/' + region + '/v' + versions.STATIC_DATA + '/' + endUrl,
          staticReq: true,
          region: region,
          options: options
        }, cb);
      }
    }, {
      key: '_gameRequest',
      value: function _gameRequest(_ref7, cb) {
        var endUrl = _ref7.endUrl,
            region = _ref7.region;

        return this._baseRequest({
          endUrl: 'v' + versions.GAME + '/game/' + endUrl, region: region
        }, cb);
      }
    }, {
      key: '_leagueRequest',
      value: function _leagueRequest(_ref8, cb) {
        var endUrl = _ref8.endUrl,
            region = _ref8.region,
            options = _ref8.options;

        return this._baseRequest({
          endUrl: 'v' + versions.LEAGUE + '/league/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_statusRequest',
      value: function _statusRequest(_ref9, cb) {
        var endUrl = _ref9.endUrl,
            region = _ref9.region;

        return this._baseRequest({ endUrl: 'v' + versions.STATUS + '/' + endUrl, region: region, status: true }, cb);
      }
    }, {
      key: '_matchRequest',
      value: function _matchRequest(_ref10, cb) {
        var endUrl = _ref10.endUrl,
            region = _ref10.region,
            options = _ref10.options;

        return this._baseRequest({
          endUrl: 'v' + versions.MATCH + '/match/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_matchListRequest',
      value: function _matchListRequest(_ref11, cb) {
        var endUrl = _ref11.endUrl,
            region = _ref11.region,
            options = _ref11.options;

        return this._baseRequest({
          endUrl: 'v' + versions.MATCH_LIST + '/matchlist/by-summoner/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_runesMasteriesRequest',
      value: function _runesMasteriesRequest(_ref12, cb) {
        var endUrl = _ref12.endUrl,
            region = _ref12.region;

        return this._summonerRequest({ endUrl: endUrl, region: region }, cb);
      }
    }, {
      key: '_statsRequest',
      value: function _statsRequest(_ref13, cb) {
        var endUrl = _ref13.endUrl,
            region = _ref13.region,
            options = _ref13.options;

        return this._baseRequest({
          endUrl: 'v' + versions.STATS + '/stats/by-summoner/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_summonerRequest',
      value: function _summonerRequest(_ref14, cb) {
        var endUrl = _ref14.endUrl,
            region = _ref14.region;

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
      key: 'getCurrentGame',
      value: function getCurrentGame() {
        var _this3 = this;

        var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref15$region = _ref15.region,
            region = _ref15$region === undefined ? this.defaultRegion : _ref15$region,
            id = _ref15.id,
            name = _ref15.name;

        var cb = arguments[1];

        if (_typeof(arguments[0]) !== 'object' || (!id || !Number.isInteger(id)) && !name) return this._logError(this.getCurrentGame.name, 'required params ' + chalk.yellow('`id` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');

        var platformId = platformIds[regions$1[region]];

        if (!id && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            console.log(data);
            if (!err) return _this3._currentGameRequest({ endUrl: '' + data[_this3._sanitizeName(name)].id, platformId: platformId, region: region }, cb);
          });
        }

        return this._currentGameRequest({ endUrl: '' + id, platformId: platformId, region: region }, cb);
      }
    }, {
      key: 'getFeaturedGames',
      value: function getFeaturedGames() {
        var _ref16 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref16.region;

        var cb = arguments[1];

        return this._observerRequest({
          endUrl: 'featured',
          region: region
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getRecentGames',
      value: function getRecentGames() {
        var _this4 = this;

        var _ref17 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref17.region,
            id = _ref17.id,
            name = _ref17.name;

        var cb = arguments[1];

        if (id && Number.isInteger(id)) {
          return this._gameRequest({ endUrl: 'by-summoner/' + id + '/recent', region: region }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            if (data) return _this4._gameRequest({
              endUrl: 'by-summoner/' + data[_this4._sanitizeName(name)].id + '/recent', region: region
            }, cb);
          });
        } else {
          return this._logError(this.getRecentGames.name, 'required params ' + chalk.yellow('`id` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getLeagues',
      value: function getLeagues() {
        var _this5 = this;

        var _ref18 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref18.region,
            ids = _ref18.ids,
            id = _ref18.id,
            names = _ref18.names,
            name = _ref18.name;

        var cb = arguments[1];

        if (checkAll.int(ids)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + ids.join(','), region: region }, cb);
        } else if (Number.isInteger(ids) || Number.isInteger(id)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + (ids || id), region: region }, cb);
        } else if (checkAll.string(names)) {
          return this.getSummoners({ names: names, region: region }, function (err, data) {
            if (data) {
              var args = [];

              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var _name = _step.value;

                  args.push(data[_this5._sanitizeName(_name)].id);
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

              return _this5._leagueRequest({ endUrl: 'by-summoner/' + args.join(','), region: region }, cb);
            }
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            if (data) return _this5._leagueRequest({
              endUrl: 'by-summoner/' + data[_this5._sanitizeName(names || name)].id,
              region: region
            }, cb);
          });
        } else {
          return this._logError(this.getLeagues.name, 'required params ' + chalk.yellow('`ids` (array of ints)') + ', ' + chalk.yellow('`id` (int)') + ', ' + chalk.yellow('`names` (array of strings)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getLeagueEntries',
      value: function getLeagueEntries() {
        var _this6 = this;

        var _ref19 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref19.region,
            ids = _ref19.ids,
            id = _ref19.id,
            names = _ref19.names,
            name = _ref19.name;

        var cb = arguments[1];

        if (checkAll.int(ids)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + ids.join(',') + '/entry', region: region }, cb);
        } else if (Number.isInteger(ids) || Number.isInteger(id)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + (ids || id) + '/entry', region: region }, cb);
        } else if (checkAll.string(names)) {
          return this.getSummoners({ names: names, region: region }, function (err, data) {
            var args = [];

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = names[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _name2 = _step2.value;

                args.push(data[_this6._sanitizeName(_name2)].id);
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

            return _this6._leagueRequest({ endUrl: 'by-summoner/' + args.join(',') + '/entry', region: region }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            return _this6._leagueRequest({
              endUrl: 'by-summoner/' + data[_this6._sanitizeName(names || name)].id + '/entry',
              region: region
            }, cb);
          });
        } else {
          this._logError(this.getLeagueEntries.name, 'required params ' + chalk.yellow('`ids` (array of ints)') + ', ' + chalk.yellow('`id` (int)') + ', ' + chalk.yellow('`names` (array of strings)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getChallengers',
      value: function getChallengers() {
        var _ref20 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref20.region,
            _ref20$options = _ref20.options,
            options = _ref20$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref20$options;

        var cb = arguments[1];

        return this._leagueRequest({
          endUrl: 'challenger', region: region, options: options
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMasters',
      value: function getMasters() {
        var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref21.region,
            _ref21$options = _ref21.options,
            options = _ref21$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref21$options;

        var cb = arguments[1];

        return this._leagueRequest({
          endUrl: 'master', region: region, options: options
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getSummoners',
      value: function getSummoners() {
        var _this7 = this;

        var _ref22 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref22.region,
            ids = _ref22.ids,
            id = _ref22.id,
            names = _ref22.names,
            name = _ref22.name;

        var cb = arguments[1];

        if (checkAll.int(ids)) {
          return this._summonerRequest({
            endUrl: '' + ids.join(','),
            region: region
          }, cb);
        } else if (Number.isInteger(ids) || Number.isInteger(id)) {
          return this._summonerRequest({
            endUrl: '' + (ids || id),
            region: region
          }, cb);
        } else if (checkAll.string(names)) {
          return this._summonerRequest({
            endUrl: 'by-name/' + names.map(function (name) {
              return _this7._sanitizeName(name);
            }).join(','),
            region: region
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this._summonerRequest({
            endUrl: 'by-name/' + (names || name),
            region: region
          }, cb);
        } else {
          this._logError(this.getSummoners.name, 'required params ' + chalk.yellow('`ids` (array of ints)') + ', ' + chalk.yellow('`id` (int)') + ', ' + chalk.yellow('`names` (array of strings)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummoner',
      value: function getSummoner() {
        var _ref23 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref23.region,
            id = _ref23.id,
            name = _ref23.name;

        var cb = arguments[1];

        if (Number.isInteger(id)) {
          return this.getSummoners({ region: region, ids: [id] }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this.getSummoners({ region: region, names: [name] }, cb);
        } else {
          return this._logError(this.getSummoner.name, 'required params ' + chalk.yellow('`id` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummonerNames',
      value: function getSummonerNames() {
        var _ref24 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref24.region,
            ids = _ref24.ids,
            id = _ref24.id;

        var cb = arguments[1];

        if (checkAll.int(ids)) {
          return this._summonerRequest({
            endUrl: ids.join(',') + '/name',
            region: region
          }, cb);
        } else if (Number.isInteger(ids) || Number.isInteger(id)) {
          return this._summonerRequest({
            endUrl: (ids || id) + '/name',
            region: region
          }, cb);
        } else {
          this._logError(this.getSummonerNames.name, 'required params ' + chalk.yellow('required params `ids` (array of ints)') + ' or ' + chalk.yellow('`id` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummonerName',
      value: function getSummonerName() {
        var _ref25 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref25.region,
            id = _ref25.id;

        var cb = arguments[1];

        if (Number.isInteger(id)) {
          return this.getSummonerNames({ region: region, id: id }, cb);
        } else {
          this._logError(this.getSummonerName.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getRankedStats',
      value: function getRankedStats() {
        var _this8 = this;

        var _ref26 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref26.region,
            id = _ref26.id,
            name = _ref26.name,
            options = _ref26.options;

        var cb = arguments[1];

        if (Number.isInteger(id)) {
          return this._statsRequest({ endUrl: id + '/ranked', region: region, options: options }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            if (data) return _this8._statsRequest({
              endUrl: data[_this8._sanitizeName(name)].id + '/ranked',
              region: region, options: options
            }, cb);
          });
        } else {
          this._logError(this.getRankedStats.name, 'required params ' + chalk.yellow('`id` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getStatsSummary',
      value: function getStatsSummary() {
        var _this9 = this;

        var _ref27 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref27.region,
            id = _ref27.id,
            name = _ref27.name,
            options = _ref27.options;

        var cb = arguments[1];

        if (Number.isInteger(id)) {
          return this._statsRequest({ endUrl: id + '/summary', region: region, options: options }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            console.log(data);
            return _this9._statsRequest({
              endUrl: data[_this9._sanitizeName(name)].id + '/summary',
              region: region, options: options
            }, cb);
          });
        } else {
          this._logError(this.getRankedStats.name, 'required params ' + chalk.yellow('`id` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getShardStatus',
      value: function getShardStatus() {
        var _ref28 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref28.region;

        var cb = arguments[1];

        return this._statusRequest({ endUrl: 'shard', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getShardList',
      value: function getShardList() {
        var _ref29 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref29.region;

        var cb = arguments[1];

        return this._statusRequest({ endUrl: 'shards', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMatch',
      value: function getMatch() {
        var _ref30 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref30.region,
            id = _ref30.id,
            _ref30$options = _ref30.options,
            options = _ref30$options === undefined ? { includeTimeline: true } : _ref30$options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getMatch.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._matchRequest({ endUrl: '' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getMatchList',
      value: function getMatchList() {
        var _ref31 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref31.region,
            id = _ref31.id,
            _ref31$options = _ref31.options,
            options = _ref31$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref31$options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getMatchList.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._matchListRequest({ endUrl: '' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getChampionList',
      value: function getChampionList() {
        var _ref32 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref32.region,
            options = _ref32.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'champion', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getChampion',
      value: function getChampion() {
        var _ref33 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref33.region,
            id = _ref33.id,
            options = _ref33.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getChampion.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'champion/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getItems',
      value: function getItems() {
        var _ref34 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref34.region,
            options = _ref34.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'item', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getItem',
      value: function getItem() {
        var _ref35 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref35.region,
            id = _ref35.id,
            options = _ref35.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getItem.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'item/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getLanguageStrings',
      value: function getLanguageStrings() {
        var _ref36 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref36.region,
            options = _ref36.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'language-strings', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getLanguages',
      value: function getLanguages() {
        var _ref37 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref37.region;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'languages', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMap',
      value: function getMap() {
        var _ref38 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref38.region,
            options = _ref38.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'map', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getMasteryList',
      value: function getMasteryList() {
        var _ref39 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref39.region,
            options = _ref39.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'mastery', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getMastery',
      value: function getMastery() {
        var _ref40 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref40.region,
            id = _ref40.id,
            options = _ref40.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getMastery.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'mastery/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getRealmData',
      value: function getRealmData() {
        var _ref41 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref41.region;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'realm', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getRuneList',
      value: function getRuneList() {
        var _ref42 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref42.region,
            options = _ref42.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'rune', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getRune',
      value: function getRune() {
        var _ref43 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref43.region,
            id = _ref43.id,
            options = _ref43.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getRune.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'rune/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getSummonerSpellsList',
      value: function getSummonerSpellsList() {
        var _ref44 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref44.region,
            options = _ref44.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'summoner-spell', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getSummonerSpell',
      value: function getSummonerSpell() {
        var _ref45 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref45.region,
            id = _ref45.id,
            options = _ref45.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getSummonerSpell.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'summoner-spell/${id}', region: region, options: options }, cb);
      }
    }, {
      key: 'getVersionData',
      value: function getVersionData() {
        var _ref46 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref46.region,
            options = _ref46.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'versions', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getRunes',
      value: function getRunes() {
        var _this10 = this;

        var _ref47 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref47.region,
            ids = _ref47.ids,
            id = _ref47.id,
            names = _ref47.names,
            name = _ref47.name;

        var cb = arguments[1];

        if (checkAll.int(ids)) {
          return this._runesMasteriesRequest({
            endUrl: ids.join() + '/runes',
            region: region
          }, cb);
        } else if (Number.isInteger(ids) || Number.isInteger(id)) {
          return this._runesMasteriesRequest({
            endUrl: (ids || id) + '/runes',
            region: region
          }, cb);
        } else if (checkAll.string(names)) {
          return this.getSummoners({ names: names, region: region }, function (err, data) {
            var args = [];

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = names[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _name3 = _step3.value;

                args.push(data[_this10._sanitizeName(_name3)].id);
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

            return _this10._runesMasteriesRequest({
              endUrl: args.join(',') + '/runes',
              region: region
            }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            if (data) return _this10._runesMasteriesRequest({
              endUrl: data[_this10._sanitizeName(names || name)].id + '/runes',
              region: region
            }, cb);
          });
        } else {
          return this._logError(this.getRunes.name, 'required params ' + chalk.yellow('`ids` (array of ints)') + ', ' + chalk.yellow('`id` (int)') + ', ' + chalk.yellow('`names` (array of strings)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getMasteries',
      value: function getMasteries() {
        var _this11 = this;

        var _ref48 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref48.region,
            ids = _ref48.ids,
            id = _ref48.id,
            names = _ref48.names,
            name = _ref48.name;

        var cb = arguments[1];

        if (checkAll.int(ids)) {
          return this._runesMasteriesRequest({
            endUrl: ids.join() + '/masteries',
            region: region
          }, cb);
        } else if (Number.isInteger(ids) || Number.isInteger(id)) {
          return this._runesMasteriesRequest({
            endUrl: (ids || id) + '/masteries',
            region: region
          }, cb);
        } else if (checkAll.string(names)) {
          return this.getSummoners({ names: names, region: region }, function (err, data) {
            var args = [];

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = names[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _name4 = _step4.value;

                args.push(data[_this11._sanitizeName(_name4)].id);
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

            return _this11._runesMasteriesRequest({
              endUrl: args.join(',') + '/masteries',
              region: region
            }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            return _this11._runesMasteriesRequest({
              endUrl: data[_this11._sanitizeName(names || name)].id + '/masteries',
              region: region
            }, cb);
          });
        } else {
          return this._logError(this.getMasteries.name, 'required params ' + chalk.yellow('`ids` (array of ints)') + ', ' + chalk.yellow('`id` (int)') + ', ' + chalk.yellow('`names` (array of strings)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }]);

    return Kindred$1;
  }();

  module.exports = Kindred$1;
});