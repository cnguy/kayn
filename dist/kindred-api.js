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
    function Kindred$1(key) {
      var defaultRegion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : regions.NORTH_AMERICA;

      _classCallCheck(this, Kindred$1);

      this.key = key;
      this.defaultRegion = defaultRegion;
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
      value: function _baseRequest(_ref, cb) {
        var endUrl = _ref.endUrl,
            _ref$region = _ref.region,
            region = _ref$region === undefined ? this.defaultRegion : _ref$region,
            _ref$status = _ref.status,
            status = _ref$status === undefined ? false : _ref$status,
            _ref$observerMode = _ref.observerMode,
            observerMode = _ref$observerMode === undefined ? false : _ref$observerMode,
            _ref$staticReq = _ref.staticReq,
            staticReq = _ref$staticReq === undefined ? false : _ref$staticReq,
            _ref$options = _ref.options,
            options = _ref$options === undefined ? {} : _ref$options;

        var proxy = staticReq ? 'global' : region;
        var reqUrl = this._makeUrl(endUrl, proxy, staticReq, status, observerMode);

        if (!cb) console.log(chalk.red('error: No callback passed in for the method call regarding `' + chalk.yellow(reqUrl) + '`'));

        request({ url: reqUrl, qs: options }, function (error, response, body) {
          var statusMessage = void 0;
          var statusCode = response.statusCode;


          if (statusCode >= 200 && statusCode < 300) statusMessage = chalk.green(statusCode);else if (statusCode >= 400 && statusCode < 500) statusMessage = chalk.red(statusCode);else if (statusCode >= 500) statusMessage = chalk.bold.red(statusCode);

          console.log(response && statusMessage, reqUrl);

          if (error) return cb(error);else return cb(error, JSON.parse(body));
        });
      }
    }, {
      key: '_observerRequest',
      value: function _observerRequest(_ref2, cb) {
        var endUrl = _ref2.endUrl,
            region = _ref2.region;

        return this._baseRequest({
          endUrl: 'observer-mode/rest/' + endUrl,
          observerMode: true,
          region: region
        }, cb);
      }
    }, {
      key: '_currentGameRequest',
      value: function _currentGameRequest(_ref3, cb) {
        var endUrl = _ref3.endUrl,
            region = _ref3.region,
            platformId = _ref3.platformId;

        return this._observerRequest({
          endUrl: 'consumer/getSpectatorGameInfo/' + platformId + '/' + endUrl,
          region: region
        }, cb);
      }
    }, {
      key: '_staticRequest',
      value: function _staticRequest(_ref4, cb) {
        var endUrl = _ref4.endUrl,
            _ref4$region = _ref4.region,
            region = _ref4$region === undefined ? this.defaultRegion : _ref4$region,
            options = _ref4.options;

        return this._baseRequest({
          endUrl: 'static-data/' + region + '/v' + versions.STATIC_DATA + '/' + endUrl,
          staticReq: true,
          region: region,
          options: options
        }, cb);
      }
    }, {
      key: '_gameRequest',
      value: function _gameRequest(_ref5, cb) {
        var endUrl = _ref5.endUrl,
            region = _ref5.region;

        return this._baseRequest({
          endUrl: 'v' + versions.GAME + '/game/' + endUrl, region: region
        }, cb);
      }
    }, {
      key: '_leagueRequest',
      value: function _leagueRequest(_ref6, cb) {
        var endUrl = _ref6.endUrl,
            region = _ref6.region,
            options = _ref6.options;

        return this._baseRequest({
          endUrl: 'v' + versions.LEAGUE + '/league/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_statusRequest',
      value: function _statusRequest(_ref7, cb) {
        var endUrl = _ref7.endUrl,
            region = _ref7.region;

        return this._baseRequest({ endUrl: 'v' + versions.STATUS + '/' + endUrl, region: region, status: true }, cb);
      }
    }, {
      key: '_matchRequest',
      value: function _matchRequest(_ref8, cb) {
        var endUrl = _ref8.endUrl,
            region = _ref8.region,
            options = _ref8.options;

        return this._baseRequest({
          endUrl: 'v' + versions.MATCH + '/match/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_matchListRequest',
      value: function _matchListRequest(_ref9, cb) {
        var endUrl = _ref9.endUrl,
            region = _ref9.region,
            options = _ref9.options;

        return this._baseRequest({
          endUrl: 'v' + versions.MATCH_LIST + '/matchlist/by-summoner/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_runesMasteriesRequest',
      value: function _runesMasteriesRequest(_ref10, cb) {
        var endUrl = _ref10.endUrl,
            region = _ref10.region;

        return this._summonerRequest({ endUrl: endUrl, region: region }, cb);
      }
    }, {
      key: '_statsRequest',
      value: function _statsRequest(_ref11, cb) {
        var endUrl = _ref11.endUrl,
            region = _ref11.region,
            options = _ref11.options;

        return this._baseRequest({
          endUrl: 'v' + versions.STATS + '/stats/by-summoner/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_summonerRequest',
      value: function _summonerRequest(_ref12, cb) {
        var endUrl = _ref12.endUrl,
            region = _ref12.region;

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
        var _this = this;

        var _ref13 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref13$region = _ref13.region,
            region = _ref13$region === undefined ? this.defaultRegion : _ref13$region,
            id = _ref13.id,
            name = _ref13.name;

        var cb = arguments[1];

        if (_typeof(arguments[0]) !== 'object' || (!id || !Number.isInteger(id)) && !name) return this._logError(this.getCurrentGame.name, 'required params ' + chalk.yellow('`id` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');

        var platformId = platformIds[regions$1[region]];

        if (!id && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            console.log(data);
            if (!err) return _this._currentGameRequest({ endUrl: '' + data[_this._sanitizeName(name)].id, platformId: platformId, region: region }, cb);
          });
        }

        return this._currentGameRequest({ endUrl: '' + id, platformId: platformId, region: region }, cb);
      }
    }, {
      key: 'getFeaturedGames',
      value: function getFeaturedGames() {
        var _ref14 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref14.region;

        var cb = arguments[1];

        return this._observerRequest({
          endUrl: 'featured',
          region: region
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getRecentGames',
      value: function getRecentGames() {
        var _this2 = this;

        var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref15.region,
            id = _ref15.id,
            name = _ref15.name;

        var cb = arguments[1];

        if (id && Number.isInteger(id)) {
          return this._gameRequest({ endUrl: 'by-summoner/' + id + '/recent', region: region }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            return _this2._gameRequest({
              endUrl: 'by-summoner/' + data[_this2._sanitizeName(name)].id + '/recent', region: region
            }, cb);
          });
        } else {
          return this._logError(this.getRecentGames.name, 'required params ' + chalk.yellow('`id` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getLeagues',
      value: function getLeagues() {
        var _this3 = this;

        var _ref16 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref16.region,
            ids = _ref16.ids,
            id = _ref16.id,
            names = _ref16.names,
            name = _ref16.name;

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

                args.push(data[_this3._sanitizeName(_name)].id);
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

            return _this3._leagueRequest({ endUrl: 'by-summoner/' + args.join(','), region: region }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            return _this3._leagueRequest({
              endUrl: 'by-summoner/' + data[_this3._sanitizeName(names || name)].id,
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
        var _this4 = this;

        var _ref17 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref17.region,
            ids = _ref17.ids,
            id = _ref17.id,
            names = _ref17.names,
            name = _ref17.name;

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

                args.push(data[_this4._sanitizeName(_name2)].id);
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

            return _this4._leagueRequest({ endUrl: 'by-summoner/' + args.join(',') + '/entry', region: region }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            return _this4._leagueRequest({
              endUrl: 'by-summoner/' + data[_this4._sanitizeName(names || name)].id + '/entry',
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
        var _ref18 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref18.region,
            _ref18$options = _ref18.options,
            options = _ref18$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref18$options;

        var cb = arguments[1];

        return this._leagueRequest({
          endUrl: 'challenger', region: region, options: options
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMasters',
      value: function getMasters() {
        var _ref19 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref19.region,
            _ref19$options = _ref19.options,
            options = _ref19$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref19$options;

        var cb = arguments[1];

        return this._leagueRequest({
          endUrl: 'master', region: region, options: options
        }, cb);
      }
    }, {
      key: 'getSummoners',
      value: function getSummoners() {
        var _this5 = this;

        var _ref20 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref20.region,
            ids = _ref20.ids,
            id = _ref20.id,
            names = _ref20.names,
            name = _ref20.name;

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
              return _this5._sanitizeName(name);
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
        var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref21.region,
            id = _ref21.id,
            name = _ref21.name;

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
        var _ref22 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref22.region,
            ids = _ref22.ids;

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
        var _ref23 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref23.region,
            id = _ref23.id,
            options = _ref23.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getRankedStats.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._statsRequest({ endUrl: id + '/ranked', region: region, options: options }, cb);
      }
    }, {
      key: 'getShardStatus',
      value: function getShardStatus() {
        var _ref24 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref24.region;

        var cb = arguments[1];

        return this._statusRequest({ endUrl: 'shard', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getShardList',
      value: function getShardList() {
        var _ref25 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref25.region;

        var cb = arguments[1];

        return this._statusRequest({ endUrl: 'shards', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMatch',
      value: function getMatch() {
        var _ref26 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref26.region,
            id = _ref26.id,
            _ref26$options = _ref26.options,
            options = _ref26$options === undefined ? { includeTimeline: true } : _ref26$options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getMatch.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._matchRequest({ endUrl: '' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getMatchList',
      value: function getMatchList() {
        var _ref27 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref27.region,
            id = _ref27.id,
            _ref27$options = _ref27.options,
            options = _ref27$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref27$options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getMatchList.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._matchListRequest({ endUrl: '' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getChampionList',
      value: function getChampionList() {
        var _ref28 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref28.region,
            options = _ref28.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'champion', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getChampion',
      value: function getChampion() {
        var _ref29 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref29.region,
            id = _ref29.id,
            options = _ref29.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getChampion.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'champion/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getItems',
      value: function getItems() {
        var _ref30 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref30.region,
            options = _ref30.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'item', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getItem',
      value: function getItem() {
        var _ref31 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref31.region,
            id = _ref31.id,
            options = _ref31.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getItem.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'item/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getLanguageStrings',
      value: function getLanguageStrings() {
        var _ref32 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref32.region,
            options = _ref32.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'language-strings', region: region, options: options }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getLanguages',
      value: function getLanguages() {
        var _ref33 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref33.region;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'languages', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMap',
      value: function getMap() {
        var _ref34 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref34.region,
            options = _ref34.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'map', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getMasteryList',
      value: function getMasteryList() {
        var _ref35 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref35.region,
            options = _ref35.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'mastery', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getMastery',
      value: function getMastery() {
        var _ref36 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref36.region,
            id = _ref36.id,
            options = _ref36.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getMastery.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'mastery/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getRealm',
      value: function getRealm() {
        var _ref37 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref37.region;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'realm', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getRuneList',
      value: function getRuneList() {
        var _ref38 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref38.region,
            options = _ref38.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'rune', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getRune',
      value: function getRune() {
        var _ref39 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref39.region,
            id = _ref39.id,
            options = _ref39.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getRune.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'rune/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getSummonerSpellsList',
      value: function getSummonerSpellsList() {
        var _ref40 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref40.region,
            options = _ref40.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'summoner-spell', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getSummonerSpell',
      value: function getSummonerSpell() {
        var _ref41 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref41.region,
            id = _ref41.id,
            options = _ref41.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getSummonerSpell.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'summoner-spell/${id}', region: region, options: options }, cb);
      }
    }, {
      key: 'getVersions',
      value: function getVersions() {
        var _ref42 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref42.region,
            options = _ref42.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'versions', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getRunes',
      value: function getRunes() {
        var _this6 = this;

        var _ref43 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref43.region,
            ids = _ref43.ids,
            id = _ref43.id,
            names = _ref43.names,
            name = _ref43.name;

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

                args.push(data[_this6._sanitizeName(_name3)].id);
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

            return _this6._runesMasteriesRequest({
              endUrl: args.join(',') + '/runes',
              region: region
            }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            return _this6._runesMasteriesRequest({
              endUrl: data[_this6._sanitizeName(names || name)].id + '/runes',
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

                args.push(data[_this7._sanitizeName(_name4)].id);
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

            return _this7._runesMasteriesRequest({
              endUrl: args.join(',') + '/masteries',
              region: region
            }, cb);
          });
        } else if (_typeof(arguments[0]) === 'object' && (typeof names === 'string' || typeof name === 'string')) {
          console.log(region, id, name);
          return this.getSummoner({ name: names || name, region: region }, function (err, data) {
            return _this7._runesMasteriesRequest({
              endUrl: data[_this7._sanitizeName(names || name)].id + '/masteries',
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