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
      value: function _makeUrl(url, region, staticReq) {
        var mid = staticReq ? '' : region + '/';
        return 'https://' + region + '.api.riotgames.com/api/lol/' + mid + url + '?api_key=' + this.key;
      }
    }, {
      key: '_baseRequest',
      value: function _baseRequest(_ref, cb) {
        var url = _ref.url,
            region = _ref.region,
            _ref$staticReq = _ref.staticReq,
            staticReq = _ref$staticReq === undefined ? false : _ref$staticReq,
            _ref$options = _ref.options,
            options = _ref$options === undefined ? {} : _ref$options;

        if (!region) region = this.defaultRegion;
        var proxy = staticReq ? 'global' : region;
        var reqUrl = this._makeUrl(url, proxy, staticReq);
        console.log(reqUrl);
        if (!cb) return console.log(chalk.red('error: No callback passed in for the method call regarding `' + chalk.yellow(reqUrl) + '`'));

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

          return cb(error, JSON.parse(body));
        });
      }
    }, {
      key: '_staticRequest',
      value: function _staticRequest(_ref2, cb) {
        var endUrl = _ref2.endUrl,
            region = _ref2.region,
            options = _ref2.options;

        return this._baseRequest({
          url: 'static-data/' + region + '/v' + versions.STATIC_DATA + '/' + endUrl,
          staticReq: true,
          region: region,
          options: options
        }, cb);
      }
    }, {
      key: '_leagueRequest',
      value: function _leagueRequest(_ref3, cb) {
        var endUrl = _ref3.endUrl,
            region = _ref3.region,
            options = _ref3.options;

        return this._baseRequest({
          url: 'v' + versions.LEAGUE + '/league/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_summonerRequest',
      value: function _summonerRequest(_ref4, cb) {
        var endUrl = _ref4.endUrl,
            region = _ref4.region;

        return this._baseRequest({
          url: 'v' + versions.SUMMONER + '/summoner/' + endUrl, region: region
        }, cb);
      }
    }, {
      key: '_matchListRequest',
      value: function _matchListRequest(_ref5, cb) {
        var endUrl = _ref5.endUrl,
            region = _ref5.region,
            options = _ref5.options;

        return this._baseRequest({
          url: 'v' + versions.MATCH_LIST + '/matchlist/by-summoner/' + endUrl, options: options
        }, cb);
      }
    }, {
      key: '_statsRequest',
      value: function _statsRequest(_ref6, cb) {
        var endUrl = _ref6.endUrl,
            region = _ref6.region;

        return this._baseRequest({
          url: 'v' + versions.STATS + '/stats/by-summoner/' + endUrl, region: region
        }, cb);
      }
    }, {
      key: '_logError',
      value: function _logError(message, expected) {
        console.log(chalk.bold.red(message), chalk.red('request'), chalk.bold.red('FAILED') + chalk.red('; ' + expected));
      }
    }, {
      key: 'getChallengers',
      value: function getChallengers(_ref7, cb) {
        var region = _ref7.region,
            _ref7$options = _ref7.options,
            options = _ref7$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref7$options;

        return this._leagueRequest({
          endUrl: 'challenger', region: region, options: options
        }, cb);
      }
    }, {
      key: 'getMasters',
      value: function getMasters(_ref8, cb) {
        var region = _ref8.region,
            _ref8$options = _ref8.options,
            options = _ref8$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref8$options;

        return this._leagueRequest({
          endUrl: 'master', region: region, options: options
        }, cb);
      }
    }, {
      key: 'getSummoners',
      value: function getSummoners(_ref9, cb) {
        var _this = this;

        var region = _ref9.region,
            names = _ref9.names,
            _ref9$ids = _ref9.ids,
            ids = _ref9$ids === undefined ? null : _ref9$ids;

        if (Array.isArray(names) && names.length > 0) {
          return this._summonerRequest({
            endUrl: 'by-name/' + names.map(function (name) {
              return _this._sanitizeName(name);
            }).join(','),
            region: region
          }, cb);
        } else if (typeof names === 'string') {
          return this._summonerRequest({
            endUrl: 'by-name/' + names,
            region: region
          }, cb);
        } else if (Array.isArray(ids) && ids.length > 0) {
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
          this._logError(this.getSummoners.name, ids ? 'ids can be either an array or a single integer' : 'names can be either an array or a single string');
        }
      }
    }, {
      key: 'getNames',
      value: function getNames(_ref10, cb) {
        var region = _ref10.region,
            ids = _ref10.ids;

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
          this._logError(this.getNames.name, 'ids can be either an array or a single integer');
        }
      }
    }, {
      key: 'getRankedStats',
      value: function getRankedStats(_ref11, cb) {
        var region = _ref11.region,
            id = _ref11.id,
            options = _ref11.options;

        return this._statsRequest({
          endUrl: id + '/ranked',
          region: region,
          options: options
        }, cb);
      }
    }, {
      key: 'getMatchList',
      value: function getMatchList(_ref12, cb) {
        var region = _ref12.region,
            id = _ref12.id,
            _ref12$options = _ref12.options,
            options = _ref12$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref12$options;

        return this._matchListRequest({
          endUrl: '' + id,
          region: region,
          options: options
        }, cb);
      }
    }, {
      key: 'getChampionList',
      value: function getChampionList(_ref13, cb) {
        var region = _ref13.region,
            options = _ref13.options;

        return this._staticRequest({ endUrl: 'champion', region: region, options: options }, cb);
      }
    }, {
      key: 'getChampion',
      value: function getChampion(_ref14, cb) {
        var region = _ref14.region,
            id = _ref14.id,
            options = _ref14.options;

        return this._staticRequest({ endUrl: 'champion/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getItems',
      value: function getItems(_ref15, cb) {
        var region = _ref15.region,
            options = _ref15.options;

        return this._staticRequest({ endUrl: 'item', region: region, options: options }, cb);
      }
    }, {
      key: 'getItem',
      value: function getItem(_ref16, cb) {
        var region = _ref16.region,
            id = _ref16.id,
            options = _ref16.options;

        return this._staticRequest({ endUrl: 'item/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getLanguageStrings',
      value: function getLanguageStrings(_ref17, cb) {
        var region = _ref17.region,
            options = _ref17.options;

        return this._staticRequest({ endUrl: 'language-strings', region: region, options: options }, cb);
      }
    }, {
      key: 'getLanguages',
      value: function getLanguages(_ref18, cb) {
        var region = _ref18.region;

        return this._staticRequest({ endUrl: 'languages', region: region }, cb);
      }
    }, {
      key: 'getMap',
      value: function getMap(_ref19, cb) {
        var region = _ref19.region,
            options = _ref19.options;

        return this._staticRequest({ endUrl: 'map', region: region, options: options }, cb);
      }
    }, {
      key: 'getMasteryList',
      value: function getMasteryList(_ref20, cb) {
        var region = _ref20.region,
            options = _ref20.options;

        return this._staticRequest({ endUrl: 'mastery', region: region, options: options }, cb);
      }
    }, {
      key: 'getMastery',
      value: function getMastery(_ref21, cb) {
        var region = _ref21.region,
            id = _ref21.id,
            options = _ref21.options;

        return this._staticRequest({ endUrl: 'mastery/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getRealm',
      value: function getRealm(_ref22, cb) {
        var region = _ref22.region;

        return this._staticRequest({ endUrl: 'realm', region: region }, cb);
      }
    }, {
      key: 'getRuneList',
      value: function getRuneList(_ref23, cb) {
        var region = _ref23.region,
            options = _ref23.options;

        return this._staticRequest({ endUrl: 'rune', region: region, options: options }, cb);
      }
    }, {
      key: 'getRune',
      value: function getRune(_ref24, cb) {
        var region = _ref24.region,
            id = _ref24.id,
            options = _ref24.options;

        return this._staticRequest({ endUrl: 'rune/' + rune, region: region, options: options }, cb);
      }
    }, {
      key: 'getSummonerSpellsList',
      value: function getSummonerSpellsList(_ref25, cb) {
        var region = _ref25.region,
            options = _ref25.options;

        return this._staticRequest({ endUrl: 'summoner-spell', region: region, options: options }, cb);
      }
    }, {
      key: 'getSummonerSpell',
      value: function getSummonerSpell(_ref26, cb) {
        var region = _ref26.region,
            id = _ref26.id,
            options = _ref26.options;

        return this._staticRequest({ endUrl: 'summoner-spell/${id}', region: region, options: options }, cb);
      }
    }, {
      key: 'getVersions',
      value: function getVersions(_ref27, cb) {
        var region = _ref27.region,
            options = _ref27.options;

        return this._staticRequest({ endUrl: 'versions', region: region, options: options }, cb);
      }
    }]);

    return Kindred$1;
  }();

  module.exports = Kindred$1;
});