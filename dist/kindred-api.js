(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('kindred-api', ['module', 'request', 'chalk'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('request'), require('chalk'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.request, global.chalk);
    global.kindredApi = mod.exports;
  }
})(this, function (module, request, chalk) {
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
          debug = _ref$debug === undefined ? false : _ref$debug;

      _classCallCheck(this, Kindred$1);

      this.key = key;
      this.defaultRegion = defaultRegion;
      this.debug = debug;
    }

    _createClass(Kindred$1, [{
      key: '_sanitizeName',
      value: function _sanitizeName(name) {
        return name.replace(/\s/g, '').toLowerCase();
      }
    }, {
      key: '_validName',
      value: function _validName(name) {
        return RegExp('^[0-9\\p{L} _\\.]+$').test(name);
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
            _ref2$options = _ref2.options,
            options = _ref2$options === undefined ? {} : _ref2$options;

        var proxy = staticReq ? 'global' : region;
        var reqUrl = this._makeUrl(endUrl, proxy, staticReq, status, observerMode);

        if (!cb) console.log(chalk.red('error: No callback passed in for the method call regarding `' + chalk.yellow(reqUrl) + '`'));

        request({ url: reqUrl, qs: options }, function (error, response, body) {
          var statusMessage = void 0;
          var statusCode = response.statusCode;


          if (statusCode >= 200 && statusCode < 300) statusMessage = chalk.green(statusCode);else if (statusCode >= 400 && statusCode < 500) statusMessage = chalk.red(statusCode);else if (statusCode >= 500) statusMessage = chalk.bold.red(statusCode);

          if (_this.debug) {
            console.log(response && statusMessage, reqUrl);
            console.log('x-app-rate-limit-count', response.headers['x-app-rate-limit-count']);
            console.log('x-method-rate-limit-count', response.headers['x-method-rate-limit-count']);
            console.log('x-rate-limit-count', response.headers['x-rate-limit-count']);
            console.log('retry-after', response.headers['retry-after']);
          }

          if (error) return cb(error);else return cb(error, JSON.parse(body));
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
      key: '_currentGameRequest',
      value: function _currentGameRequest(_ref4, cb) {
        var endUrl = _ref4.endUrl,
            region = _ref4.region,
            platformId = _ref4.platformId;

        return this._observerRequest({
          endUrl: 'consumer/getSpectatorGameInfo/' + platformId + '/' + endUrl,
          region: region
        }, cb);
      }
    }, {
      key: '_staticRequest',
      value: function _staticRequest(_ref5, cb) {
        var endUrl = _ref5.endUrl,
            _ref5$region = _ref5.region,
            region = _ref5$region === undefined ? this.defaultRegion : _ref5$region,
            options = _ref5.options;

        return this._baseRequest({
          endUrl: 'static-data/' + region + '/v' + versions.STATIC_DATA + '/' + endUrl,
          staticReq: true,
          region: region,
          options: options
        }, cb);
      }
    }, {
      key: '_gameRequest',
      value: function _gameRequest(_ref6, cb) {
        var endUrl = _ref6.endUrl,
            region = _ref6.region;

        return this._baseRequest({
          endUrl: 'v' + versions.GAME + '/game/' + endUrl, region: region
        }, cb);
      }
    }, {
      key: '_leagueRequest',
      value: function _leagueRequest(_ref7, cb) {
        var endUrl = _ref7.endUrl,
            region = _ref7.region,
            options = _ref7.options;

        return this._baseRequest({
          endUrl: 'v' + versions.LEAGUE + '/league/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_statusRequest',
      value: function _statusRequest(_ref8, cb) {
        var endUrl = _ref8.endUrl,
            region = _ref8.region;

        return this._baseRequest({ endUrl: 'v' + versions.STATUS + '/' + endUrl, region: region, status: true }, cb);
      }
    }, {
      key: '_matchRequest',
      value: function _matchRequest(_ref9, cb) {
        var endUrl = _ref9.endUrl,
            region = _ref9.region,
            options = _ref9.options;

        return this._baseRequest({
          endUrl: 'v' + versions.MATCH + '/match/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_matchListRequest',
      value: function _matchListRequest(_ref10, cb) {
        var endUrl = _ref10.endUrl,
            region = _ref10.region,
            options = _ref10.options;

        return this._baseRequest({
          endUrl: 'v' + versions.MATCH_LIST + '/matchlist/by-summoner/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_runesMasteriesRequest',
      value: function _runesMasteriesRequest(_ref11, cb) {
        var endUrl = _ref11.endUrl,
            region = _ref11.region;

        return this._summonerRequest({ endUrl: endUrl, region: region }, cb);
      }
    }, {
      key: '_statsRequest',
      value: function _statsRequest(_ref12, cb) {
        var endUrl = _ref12.endUrl,
            region = _ref12.region,
            options = _ref12.options;

        return this._baseRequest({
          endUrl: 'v' + versions.STATS + '/stats/by-summoner/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_summonerRequest',
      value: function _summonerRequest(_ref13, cb) {
        var endUrl = _ref13.endUrl,
            region = _ref13.region;

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
        var _this2 = this;

        var _ref14 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref14$region = _ref14.region,
            region = _ref14$region === undefined ? this.defaultRegion : _ref14$region,
            id = _ref14.id,
            name = _ref14.name;

        var cb = arguments[1];

        if (_typeof(arguments[0]) !== 'object' || (!id || !Number.isInteger(id)) && !name) return this._logError(this.getCurrentGame.name, 'required params ' + chalk.yellow('`id` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');

        var platformId = platformIds[regions$1[region]];

        if (!id && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            console.log(data);
            if (!err) return _this2._currentGameRequest({ endUrl: '' + data[_this2._sanitizeName(name)].id, platformId: platformId, region: region }, cb);
          });
        }

        return this._currentGameRequest({ endUrl: '' + id, platformId: platformId, region: region }, cb);
      }
    }, {
      key: 'getFeaturedGames',
      value: function getFeaturedGames() {
        var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref15.region;

        var cb = arguments[1];

        return this._observerRequest({
          endUrl: 'featured',
          region: region
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getRecentGames',
      value: function getRecentGames() {
        var _this3 = this;

        var _ref16 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref16.region,
            id = _ref16.id,
            name = _ref16.name;

        var cb = arguments[1];

        if (id && Number.isInteger(id)) {
          return this._gameRequest({ endUrl: 'by-summoner/' + id + '/recent', region: region }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            return _this3._gameRequest({
              endUrl: 'by-summoner/' + data[_this3._sanitizeName(name)].id + '/recent', region: region
            }, cb);
          });
        } else {
          return this._logError(this.getRecentGames.name, 'required params ' + chalk.yellow('`id` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getLeagues',
      value: function getLeagues() {
        var _this4 = this;

        var _ref17 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref17.region,
            ids = _ref17.ids,
            id = _ref17.id,
            names = _ref17.names,
            name = _ref17.name;

        var cb = arguments[1];

        console.log(name);
        if (checkAll.int(ids)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + ids.join(','), region: region }, cb);
        } else if (Number.isInteger(ids) || Number.isInteger(id)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + (ids || id), region: region }, cb);
        } else if (checkAll.string(names)) {
          return this.getSummoners({ names: names, region: region }, function (err, data) {
            var args = [];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _name = _step.value;

                args.push(data[_this4._sanitizeName(_name)].id);
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

            return _this4._leagueRequest({ endUrl: 'by-summoner/' + args.join(','), region: region }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            return _this4._leagueRequest({
              endUrl: 'by-summoner/' + data[_this4._sanitizeName(names || name)].id,
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
        var _this5 = this;

        var _ref18 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref18.region,
            ids = _ref18.ids,
            id = _ref18.id,
            names = _ref18.names,
            name = _ref18.name;

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

                args.push(data[_this5._sanitizeName(_name2)].id);
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

            return _this5._leagueRequest({ endUrl: 'by-summoner/' + args.join(',') + '/entry', region: region }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            return _this5._leagueRequest({
              endUrl: 'by-summoner/' + data[_this5._sanitizeName(names || name)].id + '/entry',
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
        var _ref19 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref19.region,
            _ref19$options = _ref19.options,
            options = _ref19$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref19$options;

        var cb = arguments[1];

        return this._leagueRequest({
          endUrl: 'challenger', region: region, options: options
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMasters',
      value: function getMasters() {
        var _ref20 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref20.region,
            _ref20$options = _ref20.options,
            options = _ref20$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref20$options;

        var cb = arguments[1];

        return this._leagueRequest({
          endUrl: 'master', region: region, options: options
        }, cb);
      }
    }, {
      key: 'getSummoners',
      value: function getSummoners() {
        var _this6 = this;

        var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref21.region,
            ids = _ref21.ids,
            id = _ref21.id,
            names = _ref21.names,
            name = _ref21.name;

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
              return _this6._sanitizeName(name);
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
        var _ref22 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref22.region,
            id = _ref22.id,
            name = _ref22.name;

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
        var _ref23 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref23.region,
            ids = _ref23.ids;

        var cb = arguments[1];

        if (Array.isArray(ids) && ids.length > 0) {
          return this._summonerRequest({
            endUrl: ids.join(',') + '/name',
            region: region
          }, cb);
        } else if (Number.isInteger(ids)) {
          return this._summonerRequest({
            endUrl: ids + '/name',
            region: region
          }, cb);
        } else {
          this._logError(this.getSummonerNames.name, 'ids can be either an array or a single integer');
        }
      }
    }, {
      key: 'getRankedStats',
      value: function getRankedStats() {
        var _ref24 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref24.region,
            id = _ref24.id,
            options = _ref24.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getRankedStats.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._statsRequest({ endUrl: id + '/ranked', region: region, options: options }, cb);
      }
    }, {
      key: 'getShardStatus',
      value: function getShardStatus() {
        var _ref25 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref25.region;

        var cb = arguments[1];

        return this._statusRequest({ endUrl: 'shard', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getShardList',
      value: function getShardList() {
        var _ref26 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref26.region;

        var cb = arguments[1];

        return this._statusRequest({ endUrl: 'shards', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMatch',
      value: function getMatch() {
        var _ref27 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref27.region,
            id = _ref27.id,
            _ref27$options = _ref27.options,
            options = _ref27$options === undefined ? { includeTimeline: true } : _ref27$options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getMatch.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._matchRequest({ endUrl: '' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getMatchList',
      value: function getMatchList() {
        var _ref28 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref28.region,
            id = _ref28.id,
            _ref28$options = _ref28.options,
            options = _ref28$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref28$options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getMatchList.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._matchListRequest({ endUrl: '' + id, region: region, options: options }, cb);
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
            options = _ref30.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getChampion.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'champion/' + id, region: region, options: options }, cb);
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
            options = _ref32.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getItem.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'item/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getLanguageStrings',
      value: function getLanguageStrings() {
        var _ref33 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref33.region,
            options = _ref33.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'language-strings', region: region, options: options }, cb = region ? cb : arguments[0]);
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
            options = _ref37.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getMastery.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'mastery/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getRealm',
      value: function getRealm() {
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
            options = _ref40.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getRune.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'rune/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getSummonerSpellsList',
      value: function getSummonerSpellsList() {
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
            options = _ref42.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getSummonerSpell.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'summoner-spell/${id}', region: region, options: options }, cb);
      }
    }, {
      key: 'getVersions',
      value: function getVersions() {
        var _ref43 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref43.region,
            options = _ref43.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'versions', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getRunes',
      value: function getRunes() {
        var _this7 = this;

        var _ref44 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref44.region,
            ids = _ref44.ids,
            id = _ref44.id,
            names = _ref44.names,
            name = _ref44.name;

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

                args.push(data[_this7._sanitizeName(_name3)].id);
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

            return _this7._runesMasteriesRequest({
              endUrl: args.join(',') + '/runes',
              region: region
            }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            return _this7._runesMasteriesRequest({
              endUrl: data[_this7._sanitizeName(names || name)].id + '/runes',
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
        var _this8 = this;

        var _ref45 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref45.region,
            ids = _ref45.ids,
            id = _ref45.id,
            names = _ref45.names,
            name = _ref45.name;

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

                args.push(data[_this8._sanitizeName(_name4)].id);
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

            return _this8._runesMasteriesRequest({
              endUrl: args.join(',') + '/masteries',
              region: region
            }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          console.log(region, id, name);
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            return _this8._runesMasteriesRequest({
              endUrl: data[_this8._sanitizeName(names || name)].id + '/masteries',
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