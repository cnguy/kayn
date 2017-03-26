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
      key: '_makeUrl',
      value: function _makeUrl(url, region, statusReq, status, observerMode) {
        var mid = statusReq ? '' : region + '/';
        var starter = !status && !observerMode ? 'api/lol/' + mid : observerMode ? '' : 'lol/status/';

        return 'https://' + region + '.api.riotgames.com/' + starter + url + '?api_key=' + this.key;
      }
    }, {
      key: '_baseRequest',
      value: function _baseRequest(_ref, cb) {
        var url = _ref.url,
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
        var reqUrl = this._makeUrl(url, proxy, staticReq, status, observerMode);
        console.log(reqUrl);
        if (!cb) console.log(chalk.red('error: No callback passed in for the method call regarding `' + chalk.yellow(reqUrl) + '`'));

        request({ url: reqUrl, qs: options }, function (error, response, body) {
          var statusMessage = void 0;
          var statusCode = response.statusCode;


          if (statusCode >= 200 && statusCode < 300) {
            statusMessage = chalk.green(statusCode);
          } else if (statusCode >= 400 && statusCode < 500) {
            statusMessage = chalk.red(statusCode);
          } else if (statusCode >= 500) {
            statusMessage = chalk.bold.red(statusCode);
          }

          console.log('status code:', response && statusMessage);

          if (error) return cb(error);else return cb(error, JSON.parse(body));
        });
      }
    }, {
      key: '_observerRequest',
      value: function _observerRequest(_ref2, cb) {
        var endUrl = _ref2.endUrl,
            region = _ref2.region;

        return this._baseRequest({
          url: 'observer-mode/rest/' + endUrl,
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
          url: 'static-data/' + region + '/v' + versions.STATIC_DATA + '/' + endUrl,
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
          url: 'v' + versions.GAME + '/game/' + endUrl, region: region
        }, cb);
      }
    }, {
      key: '_leagueRequest',
      value: function _leagueRequest(_ref6, cb) {
        var endUrl = _ref6.endUrl,
            region = _ref6.region,
            options = _ref6.options;

        return this._baseRequest({
          url: 'v' + versions.LEAGUE + '/league/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_statusRequest',
      value: function _statusRequest(_ref7, cb) {
        var endUrl = _ref7.endUrl,
            region = _ref7.region;

        return this._baseRequest({ url: 'v' + versions.STATUS + '/' + endUrl, region: region, status: true }, cb);
      }
    }, {
      key: '_matchRequest',
      value: function _matchRequest(_ref8, cb) {
        var endUrl = _ref8.endUrl,
            region = _ref8.region,
            options = _ref8.options;

        return this._baseRequest({
          url: 'v' + versions.MATCH + '/match/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_matchListRequest',
      value: function _matchListRequest(_ref9, cb) {
        var endUrl = _ref9.endUrl,
            region = _ref9.region,
            options = _ref9.options;

        return this._baseRequest({
          url: 'v' + versions.MATCH_LIST + '/matchlist/by-summoner/' + endUrl, region: region, options: options
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
          url: 'v' + versions.STATS + '/stats/by-summoner/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_summonerRequest',
      value: function _summonerRequest(_ref12, cb) {
        var endUrl = _ref12.endUrl,
            region = _ref12.region;

        return this._baseRequest({
          url: 'v' + versions.SUMMONER + '/summoner/' + endUrl, region: region
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
        var _ref13 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref13$region = _ref13.region,
            region = _ref13$region === undefined ? this.defaultRegion : _ref13$region,
            id = _ref13.id;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getCurrentGame.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        var platformId = platformIds[regions$1[region]];
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
        var _this = this;

        var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref15.region,
            id = _ref15.id,
            name = _ref15.name;

        var cb = arguments[1];

        if ((!id || !Number.isInteger(id)) && !name) return this._logError(this.getRecentGames.name, 'required params ' + chalk.yellow('`id` (int)') + ' or ' + chalk.yellow('`name` (string)') + ' not passed in');

        if (id && Number.isInteger(id)) return this._gameRequest({ endUrl: 'by-summoner/' + id + '/recent', region: region }, cb);

        if (typeof name === 'string') {
          return this.getSummoner({ name: name }, function (err, data) {
            return _this._gameRequest({
              endUrl: 'by-summoner/' + data[_this._sanitizeName(name)].id + '/recent', region: region
            }, cb);
          });
        }
      }
    }, {
      key: 'getLeagues',
      value: function getLeagues() {
        var _ref16 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref16.region,
            ids = _ref16.ids;

        var cb = arguments[1];

        if (checkAll.int(ids)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + ids.join(','), region: region }, cb);
        } else if (Number.isInteger(ids)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + ids, region: region }, cb);
        } else {
          this._logError(this.getLeagues.name, 'ids can be either an array of integers or a single integer');
        }
      }
    }, {
      key: 'getLeagueEntries',
      value: function getLeagueEntries() {
        var _ref17 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref17.region,
            ids = _ref17.ids;

        var cb = arguments[1];

        if (checkAll.int(ids)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + ids.join(',') + '/entry', region: region }, cb);
        } else if (Number.isInteger(ids)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + ids + '/entry', region: region }, cb);
        } else {
          this._logError(this.getLeagues.name, 'ids can be either an array of integers or a single integer');
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
        var _this2 = this;

        var _ref20 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref20.region,
            names = _ref20.names,
            ids = _ref20.ids;

        var cb = arguments[1];

        if (checkAll.string(names)) {
          return this._summonerRequest({
            endUrl: 'by-name/' + names.map(function (name) {
              return _this2._sanitizeName(name);
            }).join(','),
            region: region
          }, cb);
        } else if (typeof names === 'string') {
          return this._summonerRequest({
            endUrl: 'by-name/' + names,
            region: region
          }, cb);
        } else if (checkAll.int(ids)) {
          return this._summonerRequest({
            endUrl: '' + ids.join(','),
            region: region
          }, cb);
        } else if (Number.isInteger(ids)) {
          return this._summonerRequest({
            endUrl: '' + ids,
            region: region
          }, cb);
        } else {
          this._logError(this.getSummoners.name, !names && !ids ? 'required parameters not passed' : ids ? 'ids can be either an array of integers or a single integer' : 'names can be either an array of strings or a single string');
        }
      }
    }, {
      key: 'getSummoner',
      value: function getSummoner() {
        var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref21.region,
            name = _ref21.name,
            id = _ref21.id;

        var cb = arguments[1];

        if (typeof name === 'string') return this.getSummoners({ region: region, names: [name] }, cb);
        if (Number.isInteger(id)) return this.getSummoners({ region: region, ids: [id] }, cb);
        return this._logError(this.getSummoner.name, 'required parameters ' + chalk.yellow('`name` (string)') + ' or ' + chalk.yellow('`id` (int)') + ' not passed in');
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
      value: function getShardStatus(_ref24, cb) {
        var region = _ref24.region;

        return this._statusRequest({ endUrl: 'shard', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getShardList',
      value: function getShardList(_ref25, cb) {
        var region = _ref25.region;

        return this._statusRequest({ endUrl: 'shards', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMatch',
      value: function getMatch(_ref26, cb) {
        var region = _ref26.region,
            id = _ref26.id,
            _ref26$options = _ref26.options,
            options = _ref26$options === undefined ? { includeTimeline: true } : _ref26$options;

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
        var _this3 = this;

        var _ref43 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref43.region,
            ids = _ref43.ids,
            id = _ref43.id,
            names = _ref43.names,
            name = _ref43.name;

        var cb = arguments[1];

        if (!ids && !id && !names && !name) return this._logError(this.getRunes.name, 'required params ' + chalk.yellow('`ids` (array of ints)') + ', ' + chalk.yellow('`id` (int)') + ', ' + chalk.yellow('`names` (array of strings)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');

        var param = void 0;

        if (checkAll.int(ids)) param = ids.join(',');
        if (Number.isInteger(ids)) param = [ids];
        if (id && !Number.isInteger(id)) param = [id];

        if (checkAll.string(names)) {
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

            return _this3._runesMasteriesRequest({
              endUrl: args.join(',') + '/runes',
              region: region
            }, cb);
          });
        }

        if (typeof name === 'string') {
          return this.getSummoner({ name: name, region: region }, function (err, data) {
            return _this3._runesMasteriesRequest({
              endUrl: data[_this3._sanitizeName(name)].id + '/runes',
              region: region
            }, cb);
          });
        }

        return this._runesMasteriesRequest({
          endUrl: param + '/runes',
          region: region
        }, cb);
      }
    }, {
      key: 'getMasteries',
      value: function getMasteries() {
        var _ref44 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            regions$$1 = _ref44.regions,
            ids = _ref44.ids,
            id = _ref44.id;

        var cb = arguments[1];

        if (!ids && !id) return this._logError(this.getMasteries.name, 'required params ' + chalk.yellow('`ids` (array of ints)') + ' or ' + chalk.yellow('`id` (int)') + ' not passed in');

        var param = void 0;

        if (checkAll.int(ids)) param = ids.join(',');
        if (Number.isInteger(ids)) param = [ids];
        if (id && !Number.isInteger(id)) param = [id];

        return this._runesMasteriesRequest({
          endUrl: param + '/masteries',
          region: region
        }, cb);
      }
    }]);

    return Kindred$1;
  }();

  module.exports = Kindred$1;
});