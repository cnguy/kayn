(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('kindred-api', ['module', 'redis', 'double-ended-queue', 'xregexp', 'chalk', 'request', 'chalk', 'query-string'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('redis'), require('double-ended-queue'), require('xregexp'), require('chalk'), require('request'), require('chalk'), require('query-string'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.redis, global.doubleEndedQueue, global.xregexp, global.chalk, global.request, global.chalk, global.queryString);
    global.kindredApi = mod.exports;
  }
})(this, function (module, redis, Deque, XRegExp, chalk$1, request, chalk, queryString) {
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

  var InMemoryCache = function () {
    function InMemoryCache() {
      _classCallCheck(this, InMemoryCache);

      this.cache = {};
    }

    _createClass(InMemoryCache, [{
      key: 'get',
      value: function get(args, cb) {
        if (this.cache[args.key]) {
          if (Date.now() > this.cache[args.key].expires) {
            delete this.cache[args.key];
            return cb('expired cache key');
          } else {
            return cb(null, this.cache[args.key].value);
          }
        }
        return cb('cache key doesn\'t exist');
      }
    }, {
      key: 'set',
      value: function set(args, value) {
        this.cache[args.key] = {
          expires: args.ttl ? Date.now() + args.ttl * 1000 : null,
          value: value
        };
      }
    }]);

    return InMemoryCache;
  }();

  var RedisCache = function () {
    function RedisCache(opts) {
      _classCallCheck(this, RedisCache);

      var options = Object.assign({}, opts || {}, {
        host: '127.0.0.1',
        port: 6379,
        keyPrefix: 'kindredAPI-'
      });

      this.client = redis.createClient(options.port, options.host);
      this.client.on('error', function (err) {
        console.log('Redis error:', err);
      });

      process.on('exit', function () {
        console.log('closing');
        this.client.quit();
      });

      this.prefix = options.keyPrefix;
    }

    _createClass(RedisCache, [{
      key: 'get',
      value: function get(args, cb) {
        this.client.get(this.prefix + args.key, function (err, reply) {
          reply ? cb(err, reply) : cb(err);
          return;
        });
      }
    }, {
      key: 'set',
      value: function set(args, value) {
        this.client.setex(this.prefix + args.key, args.ttl, value);
      }
    }]);

    return RedisCache;
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

  var services = {
    'CHAMPION': 'platform',
    'CHAMPION_MASTERY': 'champion-mastery',
    'GAME': null,
    'LEAGUE': null,
    'STATUS': 'status',
    'MASTERIES': 'platform',
    'MATCH': 'match',
    'MATCH_LIST': null,
    'RUNES': 'platform',
    'RUNES_MASTERIES': 'platform',
    'SPECTATOR': 'spectator',
    'STATIC_DATA': 'static-data',
    'STATS': null,
    'SUMMONER': 'summoner'
  };

  var cacheTimers = {
    MONTH: 2592000,
    WEEK: 604800,
    DAY: 846400,
    SIX_HOURS: 21600,
    THREE_HOURS: 10800,
    TWO_HOURS: 7200,
    HOUR: 3600,
    THIRTY_MINUTES: 1800,
    SHORT: 600,
    NONE: null
  };

  var endpointCacheTimers = {
    CHAMPION: cacheTimers.MONTH,
    CHAMPION_MASTERY: cacheTimers.SIX_HOURS,
    CURRENT_GAME: cacheTimers.NONE,
    FEATURED_GAMES: cacheTimers.NONE,
    GAME: cacheTimers.HOUR,
    LEAGUE: cacheTimers.SIX_HOURS,
    STATIC: cacheTimers.MONTH,
    STATUS: cacheTimers.NONE,
    MATCH: cacheTimers.MONTH,
    MATCH_LIST: cacheTimers.ONE_HOUR,
    RUNES_MASTERIES: cacheTimers.WEEK,
    SPECTATOR: cacheTimers.NONE,
    STATS: cacheTimers.HOUR,
    SUMMONER: cacheTimers.DAY
  };

  var limits = {
    'DEV': [[10, 10], [500, 600]],
    'PROD': [[3000, 10], [180000, 600]]
  };

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

  var queueTypes = {
    CUSTOM: 0,
    NORMAL_3x3: 8,
    NORMAL_5x5_BLIND: 2,
    NORMAL_5x5_DRAFT: 14,
    RANKED_SOLO_5x5: 4,
    RANKED_PREMADE_5x5: 6,
    RANKED_PREMADE_3x3: 9,
    RANKED_FLEX_TT: 9,
    RANKED_TEAM_3x3: 41,
    RANKED_TEAM_5x5: 42,
    ODIN_5x5_BLIND: 16,
    ODIN_5x5_DRAFT: 17,
    BOT_5x5: 7,
    BOT_ODIN_5x5: 25,
    BOT_5x5_INTRO: 31,
    BOT_5x5_BEGINNER: 32,
    BOT_5x5_INTERMEDIATE: 33,
    BOT_TT_3x3: 52,
    GROUP_FINDER_5x5: 61,
    ARAM_5x5: 65,
    ONEFORALL_5x5: 70,
    FIRSTBLOOD_1x1: 72,
    FIRSTBLOOD_2x2: 73,
    SR_6x6: 75,
    URF_5x5: 76,
    ONEFORALL_MIRRORMODE_5x5: 78,
    BOT_URF_5x5: 83,
    NIGHTMARE_BOT_5x5_RANK1: 91,
    NIGHTMARE_BOT_5x5_RANK2: 92,
    NIGHTMARE_BOT_5x5_RANK5: 93,
    ASCENSION_5x5: 96,
    HEXAKILL: 98,
    BILGEWATER_ARAM_5x5: 100,
    KING_PORO_5x5: 300,
    COUNTER_PICK: 310,
    BILGEWATER_5x5: 313,
    SIEGE: 315,
    DEFINITELY_NOT_DOMINION_5x5: 317,
    ARURF_5X5: 318,
    ARSR_5x5: 325,
    TEAM_BUILDER_DRAFT_UNRANKED_5x5: 400,
    TEAM_BUILDER_DRAFT_RANKED_5x5: 410,
    TEAM_BUILDER_RANKED_SOLO: 420,
    RANKED_FLEX_SR: 440,
    ASSASSINATE_5x5: 600,
    DARKSTAR_3x3: 610
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
    'CHAMPION': 3,
    'CHAMPION_MASTERY': 3,
    'CURRENT_GAME': 1.0,
    'FEATURED_GAMES': 1.0,
    'GAME': 1.3,
    'LEAGUE': 2.5,
    'STATIC_DATA': 3,
    'STATUS': 3,
    'MATCH': 3,
    'MATCH_LIST': 2.2,
    'RUNES_MASTERIES': 3,
    'SPECTATOR': 3,
    'STATS': 1.3,
    'SUMMONER': 3
  };

  var caches = ['in-memory-cache', 'redis'];

  var re = XRegExp('^[0-9\\p{L} _\\.]+$');

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

  var check = function check(region) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(regions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var r = _step.value;

        if (regions[r] === region) return true;
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

    return false;
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

  var statusCodeBisector = [200, 400, 500];

  var colorizeStatusMessage = function colorizeStatusMessage(statusCode) {
    if (statusCode >= statusCodeBisector[0] && statusCode < statusCodeBisector[1]) return chalk$1.green(statusCode);else if (statusCode >= statusCodeBisector[1] && statusCode < statusCodeBisector[2]) return chalk$1.red(statusCode + ' ' + getResponseMessage(statusCode));else return chalk$1.bold.red(statusCode + ' ' + getResponseMessage(statusCode));
  };

  var check$1 = function check$1(l) {
    return (Array.isArray(l) && l.length !== 2 || !checkAll.int(l[0]) || l[0].length !== 2 || !checkAll.int(l[1]) || l[1].length !== 2) && l !== 'dev' && l !== 'prod';
  };

  var printResponseDebug = function printResponseDebug(response, statusMessage, reqUrl) {
    console.log(statusMessage, reqUrl);
    console.log({
      'x-app-rate-limit-count': response.headers['x-app-rate-limit-count'],
      'x-method-rate-limit-count': response.headers['x-method-rate-limit-count'],
      'x-rate-limit-count': response.headers['x-rate-limit-count'],
      'retry-after': response.headers['retry-after']
    });
    console.log();
  };

  var Kindred$1 = function () {
    function Kindred$1(_ref) {
      var key = _ref.key,
          _ref$defaultRegion = _ref.defaultRegion,
          defaultRegion = _ref$defaultRegion === undefined ? regions.NORTH_AMERICA : _ref$defaultRegion,
          _ref$debug = _ref.debug,
          debug = _ref$debug === undefined ? false : _ref$debug,
          limits$$1 = _ref.limits,
          cacheOptions = _ref.cacheOptions,
          cacheTTL = _ref.cacheTTL;

      _classCallCheck(this, Kindred$1);

      this.key = key;

      this.defaultRegion = check(defaultRegion) ? defaultRegion : undefined;

      if (!this.defaultRegion) {
        console.log('' + chalk.red('Initialization of Kindred failed: ' + chalk.yellow(defaultRegion) + ' is an invalid region.'));
        console.log('' + chalk.red('Try importing ' + chalk.yellow("require('./dist/kindred-api').REGIONS") + ' and using one of those values instead.'));
        process.exit(1);
      }

      this.debug = debug;

      if (!cacheOptions) {
        this.cache = {
          get: function get(args, cb) {
            return cb(null, null);
          },
          set: function set(args, value) {}
        };
      } else {
        if (cacheOptions === caches[0]) this.cache = new InMemoryCache();else if (cacheOptions === caches[1]) this.cache = new RedisCache();else this.cache = cacheOptions;

        this.CACHE_TIMERS = cacheTTL ? cacheTTL : endpointCacheTimers;
      }

      if (!this.CACHE_TIMERS) this.CACHE_TIMERS = {
        CHAMPION: 0,
        CHAMPION_MASTERY: 0,
        CURRENT_GAME: 0,
        FEATURED_GAMES: 0,
        GAME: 0,
        LEAGUE: 0,
        STATIC: 0,
        STATUS: 0,
        MATCH: 0,
        MATCH_LIST: 0,
        RUNES_MASTERIES: 0,
        STATS: 0,
        SUMMONER: 0
      };

      if (limits$$1) {
        if (check$1(limits$$1)) {
          console.log(chalk.red('Initialization of Kindred failed: Invalid ' + chalk.yellow('limits') + '. Valid examples: ' + chalk.yellow('[[10, 10], [500, 600]]')) + '.');
          console.log(chalk.red('You can also pass in one of these two strings:') + ' dev/prod ');
          console.log('' + chalk.red('and Kindred will set the limits appropriately.'));
          process.exit(1);
        }

        this.limits = {};

        if (limits$$1 === 'dev') limits$$1 = limits.DEV;
        if (limits$$1 === 'prod') limits$$1 = limits.PROD;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.keys(regions)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var region = _step2.value;

            this.limits[regions[region]] = [new RateLimit(limits$$1[0][0], limits$$1[0][1]), new RateLimit(limits$$1[1][0], limits$$1[1][1])];
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

      this.Champion = {
        getChampions: this.getChamps.bind(this),
        getAll: this.getChamps.bind(this),
        all: this.getChamps.bind(this),

        getChampion: this.getChamp.bind(this),
        get: this.getChamp.bind(this)
      };

      this.ChampionMastery = {
        getChampionMastery: this.getChampMastery.bind(this),
        get: this.getChampMastery.bind(this),

        getChampionMasteries: this.getChampMasteries.bind(this),
        getAll: this.getChampMasteries.bind(this),
        all: this.getChampMasteries.bind(this),

        getTotalChampionMasteryScore: this.getTotalChampMasteryScore.bind(this),
        getTotalScore: this.getTotalChampMasteryScore.bind(this),
        totalScore: this.getTotalChampMasteryScore.bind(this),
        total: this.getTotalChampMasteryScore.bind(this),
        score: this.getTotalChampMasteryScore.bind(this)
      };

      this.CurrentGame = {
        getCurrentGame: this.getCurrentGame.bind(this),
        get: this.getCurrentGame.bind(this)
      };

      this.FeaturedGames = {
        getFeaturedGames: this.getFeaturedGames.bind(this),
        get: this.getFeaturedGames.bind(this)
      };

      this.Game = {
        getRecentGames: this.getRecentGames.bind(this),
        getRecent: this.getRecentGames.bind(this),
        recent: this.getRecentGames.bind(this),
        get: this.getRecentGames.bind(this)
      };

      this.League = {
        getLeagues: this.getLeagues.bind(this),
        leagues: this.getLeagues.bind(this),
        get: this.getLeagues.bind(this),

        getLeagueEntries: this.getLeagueEntries.bind(this),
        getEntries: this.getLeagueEntries.bind(this),
        entries: this.getLeagueEntries.bind(this),

        getChallengers: this.getChallengers.bind(this),
        challengers: this.getChallengers.bind(this),

        getMasters: this.getMasters.bind(this),
        masters: this.getMasters.bind(this)
      };

      this.Static = {
        getChampions: this.getChampionList.bind(this),
        champions: this.getChampionList.bind(this),

        getChampion: this.getChampion.bind(this),
        champion: this.getChampion.bind(this),

        getItems: this.getItems.bind(this),
        items: this.getItems.bind(this),

        getItem: this.getItem.bind(this),
        item: this.getItem.bind(this),

        getLanguageStrings: this.getLanguageStrings.bind(this),
        languageStrings: this.getLanguageStrings.bind(this),

        getLanguages: this.getLanguages.bind(this),
        languages: this.getLanguages.bind(this),

        getMapData: this.getMapData.bind(this),
        mapData: this.getMapData.bind(this),
        map: this.getMapData.bind(this),
        maps: this.getMapData.bind(this),

        getMasteries: this.getMasteryList.bind(this),
        masteries: this.getMasteryList.bind(this),

        getMastery: this.getMastery.bind(this),
        mastery: this.getMastery.bind(this),

        getProfileIcons: this.getProfileIcons.bind(this),
        profileIcons: this.getProfileIcons.bind(this),

        getRealmData: this.getRealmData.bind(this),
        realmData: this.getRealmData.bind(this),
        realm: this.getRealmData.bind(this),
        realms: this.getRealmData.bind(this),

        getRunes: this.getRuneList.bind(this),
        runes: this.getRuneList.bind(this),

        getRune: this.getRune.bind(this),
        rune: this.getRune.bind(this),

        getSummonerSpells: this.getSummonerSpells.bind(this),
        summonerSpells: this.getSummonerSpells.bind(this),
        spells: this.getSummonerSpells.bind(this),

        getSummonerSpell: this.getSummonerSpell.bind(this),
        summonerSpell: this.getSummonerSpell.bind(this),
        spell: this.getSummonerSpell.bind(this),

        getVersionData: this.getVersionData.bind(this),
        versionData: this.getVersionData.bind(this),
        version: this.getVersionData.bind(this),
        versions: this.getVersionData.bind(this)
      };

      this.Status = {
        getShardStatus: this.getShardStatus.bind(this),
        getStatus: this.getShardStatus.bind(this),
        get: this.getShardStatus.bind(this)
      };

      this.Match = {
        getMatch: this.getMatch.bind(this),
        get: this.getMatch.bind(this),

        getMatchTimeline: this.getMatchTimeline.bind(this),
        getTimeline: this.getMatchTimeline.bind(this),
        timeline: this.getMatchTimeline.bind(this)
      };

      this.Matchlist = {
        getMatchlist: this.getMatchlist.bind(this),
        get: this.getMatchlist.bind(this),

        getRecentMatchlist: this.getRecentMatchlist.bind(this),
        recent: this.getRecentMatchlist.bind(this)
      };

      this.RunesMasteries = {
        getRunes: this.getRunes.bind(this),
        runes: this.getRunes.bind(this),

        getMasteries: this.getMasteries.bind(this),
        masteries: this.getMasteries.bind(this)
      };

      this.Runes = {
        get: this.getRunes.bind(this)
      };

      this.Masteries = {
        get: this.getMasteries.bind(this)
      };

      this.Stats = {
        getRankedStats: this.getRankedStats.bind(this),
        ranked: this.getRankedStats.bind(this),

        getStatsSummary: this.getStatsSummary.bind(this),
        summary: this.getStatsSummary.bind(this)
      };

      this.Summoner = {
        getSummoner: this.getSummoner.bind(this),
        get: this.getSummoner.bind(this),

        getRunes: this.getRunes.bind(this),
        runes: this.getRunes.bind(this),

        getMasteries: this.getMasteries.bind(this),
        masteries: this.getMasteries.bind(this),

        getMatchHistory: this.getRecentMatchlist.bind(this),
        matchHistory: this.getRecentMatchlist.bind(this),

        getMatchlist: this.getMatchlist.bind(this),
        matchlist: this.getMatchlist.bind(this),

        getChampionMasteries: this.getChampMasteries.bind(this),
        championMasteries: this.getChampMasteries.bind(this),

        getTotalChampionMasteryScore: this.getTotalChampMasteryScore.bind(this),
        totalChampionMasteryScore: this.getTotalChampMasteryScore.bind(this)
      };

      this.Ex = {
        getSummonerByAccID: this.getSummonerByAccID.bind(this),
        getMatchlistByName: this.getMatchlistByName.bind(this),
        getRunesBySummonerID: this.getRunesBySummonerID.bind(this),
        getRunesByAccountID: this.getRunesByAccountID.bind(this),
        staticRuneList: this.staticRuneList.bind(this)
      };
    }

    _createClass(Kindred$1, [{
      key: 'canMakeRequest',
      value: function canMakeRequest(region) {
        return !(!this.limits[region][0].requestAvailable() || !this.limits[region][1].requestAvailable());
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
        var oldPrefix = !status && !observerMode && !championMastery ? 'api/lol/' + mid : '';
        var prefix = 'lol/';
        var base = 'api.riotgames.com';

        var oldUrl = 'https://' + region + '.api.riotgames.com/' + oldPrefix + encodeURI(query);
        var newUrl = 'https://' + platformIds[regions$1[region]].toLowerCase() + '.' + base + '/' + prefix + encodeURI(query);

        if (newUrl.lastIndexOf('v3') == -1) return oldUrl;

        return newUrl;
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
            options = _ref2$options === undefined ? {} : _ref2$options,
            _ref2$cacheParams = _ref2.cacheParams,
            cacheParams = _ref2$cacheParams === undefined ? {} : _ref2$cacheParams;

        var tryRequest = function tryRequest() {
          return new Promise(function (resolve, reject) {
            var stringifiedOpts = '';

            if (endUrl.lastIndexOf('v3') == -1) {
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = Object.keys(options)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var key = _step3.value;

                  if (Array.isArray(options[key])) {
                    options[key] = options[key].join(',');
                  }
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

              stringifiedOpts = queryString.stringify(options).replace(/%2C/, ',');
            } else {
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = Object.keys(options)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var _key = _step4.value;

                  if (Array.isArray(options[_key])) {
                    for (var i = 0; i < options[_key].length; ++i) {
                      if (stringifiedOpts) stringifiedOpts += '&';
                      stringifiedOpts += _key + '=' + options[_key][i];
                    }
                  } else {
                    if (stringifiedOpts) stringifiedOpts += '&';
                    stringifiedOpts += _key + '=' + options[_key];
                  }
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
            }

            var postfix = stringifiedOpts ? '?' + stringifiedOpts : '';
            var reqUrl = _this._makeUrl(endUrl + postfix, region, staticReq, status, observerMode, championMastery);
            var fullUrl = reqUrl + (reqUrl.lastIndexOf('?') === -1 ? '?' : '&') + ('api_key=' + _this.key);

            _this.cache.get({ key: reqUrl }, function (err, data) {
              if (data) {
                if (_this.debug) console.log(chalk.green('CACHE HIT') + ' ' + fullUrl);
                var json = JSON.parse(data);
                if (cb) return cb(err, json);else return resolve(json);
              } else {
                if (_this.limits) {
                  var self = _this;

                  (function sendRequest(callback) {
                    if (self.canMakeRequest(region)) {
                      if (!staticReq) {
                        self.limits[region][0].addRequest();
                        self.limits[region][1].addRequest();
                      }

                      request({ url: fullUrl }, function (error, response, body) {
                        if (response && body) {
                          var statusCode = response.statusCode;

                          var statusMessage = colorizeStatusMessage(statusCode);

                          if (self.debug) printResponseDebug(response, statusMessage, fullUrl);

                          if (typeof callback === 'function') {
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

                            if (statusCode >= 400) {
                              return callback(statusMessage + ' : ' + chalk.yellow(reqUrl));
                            } else {
                              if (Number.isInteger(cacheParams.ttl) && cacheParams.ttl > 0) self.cache.set({ key: reqUrl, ttl: cacheParams.ttl }, body);
                              return callback(error, JSON.parse(body));
                            }
                          } else {
                            if (statusCode === 500) {
                              if (self.debug) console.log('!!! resending promise request !!!');
                              setTimeout(function () {
                                return reject('retry');
                              }, 1000);
                            } else if (statusCode === 429) {
                              if (self.debug) console.log('!!! resending promise request !!!');
                              setTimeout(function () {
                                return reject('retry');
                              }, response.headers['retry-after'] * 1000 + 50);
                            } else if (error || statusCode >= 400) {
                              return reject('err:', error, statusCode);
                            } else {
                              if (Number.isInteger(cacheParams.ttl) && cacheParams.ttl > 0) self.cache.set({ key: reqUrl, ttl: cacheParams.ttl }, body);
                              return resolve(JSON.parse(body));
                            }
                          }
                        } else {
                          console.log(error, fullUrl);
                        }
                      });
                    } else {
                      setTimeout(function () {
                        sendRequest.bind(self)(callback);
                      }, 1000);
                    }
                  })(cb);
                } else {
                  request({ url: fullUrl }, function (error, response, body) {
                    if (response) {
                      var statusCode = response.statusCode;

                      var statusMessage = colorizeStatusMessage(statusCode);

                      if (self.debug) printResponseDebug(response, statusMessage, fullUrl);

                      if (typeof cb === 'function') {
                        if (statusCode >= 400) return cb(statusMessage + ' : ' + chalk.yellow(reqUrl));else return cb(error, JSON.parse(body));
                      } else {
                        if (error) return reject('err:', error);else return resolve(JSON.parse(body));
                      }
                    } else {
                      console.log(error, reqUrl);
                    }
                  });
                }
              }
            });
          });
        };

        if (!cb) return tryRequest().catch(tryRequest).catch(tryRequest).catch(tryRequest).then(function (data) {
          return data;
        });

        return tryRequest();
      }
    }, {
      key: '_championMasteryRequest',
      value: function _championMasteryRequest(_ref3, cb) {
        var endUrl = _ref3.endUrl,
            region = _ref3.region,
            options = _ref3.options;

        return this._baseRequest({
          endUrl: services.CHAMPION_MASTERY + '/v' + versions.CHAMPION + '/' + endUrl, region: region, options: options,
          championMastery: true,
          cacheParams: {
            ttl: this.CACHE_TIMERS.CHAMPION_MASTERY
          }
        }, cb);
      }
    }, {
      key: '_championRequest',
      value: function _championRequest(_ref4, cb) {
        var endUrl = _ref4.endUrl,
            region = _ref4.region,
            options = _ref4.options;

        return this._baseRequest({
          endUrl: services.CHAMPION + '/v' + versions.CHAMPION + '/' + endUrl,
          region: region, options: options,
          cacheParams: {
            ttl: this.CACHE_TIMERS.CHAMPION
          }
        }, cb);
      }
    }, {
      key: '_spectatorRequest',
      value: function _spectatorRequest(_ref5, cb) {
        var endUrl = _ref5.endUrl,
            region = _ref5.region;

        return this._baseRequest({
          endUrl: services.SPECTATOR + '/v' + versions.SPECTATOR + '/' + endUrl,
          region: region,
          cacheParams: {
            ttl: this.CACHE_TIMERS.SPECTATOR
          }
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
          endUrl: services.STATIC_DATA + '/v' + versions.STATIC_DATA + '/' + endUrl,
          staticReq: true,
          region: region,
          options: options,
          cacheParams: {
            ttl: this.CACHE_TIMERS.STATIC
          }
        }, cb);
      }
    }, {
      key: '_statusRequest',
      value: function _statusRequest(_ref7, cb) {
        var endUrl = _ref7.endUrl,
            region = _ref7.region,
            options = _ref7.options;

        return this._baseRequest({
          endUrl: services.STATUS + '/v' + versions.STATUS + '/' + endUrl,
          status: true,
          options: options,
          cacheParams: {
            ttl: this.CACHE_TIMERS.STATUS
          }
        }, cb);
      }
    }, {
      key: '_gameRequest',
      value: function _gameRequest(_ref8, cb) {
        var endUrl = _ref8.endUrl,
            region = _ref8.region;

        return this._baseRequest({
          endUrl: 'v' + versions.GAME + '/game/' + endUrl, region: region,
          cacheParams: {
            ttl: this.CACHE_TIMERS.GAME
          }
        }, cb);
      }
    }, {
      key: '_leagueRequest',
      value: function _leagueRequest(_ref9, cb) {
        var endUrl = _ref9.endUrl,
            region = _ref9.region,
            options = _ref9.options;

        return this._baseRequest({
          endUrl: 'v' + versions.LEAGUE + '/league/' + endUrl, region: region, options: options,
          cacheParams: {
            ttl: this.CACHE_TIMERS.LEAGUE
          }
        }, cb);
      }
    }, {
      key: '_matchRequest',
      value: function _matchRequest(_ref10, cb) {
        var endUrl = _ref10.endUrl,
            region = _ref10.region,
            options = _ref10.options;

        return this._baseRequest({
          endUrl: services.MATCH + '/v' + versions.MATCH + '/' + endUrl, region: region, options: options,
          cacheParams: {
            ttl: this.CACHE_TIMERS.MATCH
          }
        }, cb);
      }
    }, {
      key: '_matchlistRequest',
      value: function _matchlistRequest(_ref11, cb) {
        var endUrl = _ref11.endUrl,
            region = _ref11.region,
            options = _ref11.options;

        return this._baseRequest({
          endUrl: 'v' + versions.MATCH_LIST + '/matchlist/by-summoner/' + endUrl, region: region, options: options,
          cacheParams: {
            ttl: this.CACHE_TIMERS.MATCH_LIST
          }
        }, cb);
      }
    }, {
      key: '_runesMasteriesRequest',
      value: function _runesMasteriesRequest(_ref12, cb) {
        var endUrl = _ref12.endUrl,
            region = _ref12.region;

        return this._baseRequest({
          endUrl: services.RUNES_MASTERIES + '/v' + versions.RUNES_MASTERIES + '/' + endUrl, region: region,
          cacheParams: {
            ttl: this.CACHE_TIMERS.RUNES_MASTERIES
          }
        }, cb);
      }
    }, {
      key: '_statsRequest',
      value: function _statsRequest(_ref13, cb) {
        var endUrl = _ref13.endUrl,
            region = _ref13.region,
            options = _ref13.options;

        return this._baseRequest({
          endUrl: 'v' + versions.STATS + '/stats/by-summoner/' + endUrl, region: region, options: options,
          cacheParams: {
            ttl: this.CACHE_TIMERS.STATS
          }
        }, cb);
      }
    }, {
      key: '_summonerRequest',
      value: function _summonerRequest(_ref14, cb) {
        var endUrl = _ref14.endUrl,
            region = _ref14.region;

        return this._baseRequest({
          endUrl: services.SUMMONER + '/v' + versions.SUMMONER + '/summoners/' + endUrl, region: region,
          cacheParams: {
            ttl: this.CACHE_TIMERS.SUMMONER
          }
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
        this.defaultRegion = check(region) ? region : undefined;

        console.log('' + chalk.red('setRegion() by Kindred failed: ' + chalk.yellow(region) + ' is an invalid region.'));
        console.log('' + chalk.red('Try importing ' + chalk.yellow("require('./dist/kindred-api').REGIONS") + ' and using one of those values instead.'));
        process.exit(1);
      }
    }, {
      key: 'getChamps',
      value: function getChamps() {
        var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref15.region,
            options = _ref15.options;

        var cb = arguments[1];

        return this._championRequest({
          endUrl: 'champions', region: region, options: options
        }, cb = arguments.length === 2 ? cb : arguments[0]);
      }
    }, {
      key: 'getChamp',
      value: function getChamp() {
        var _ref16 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref16.region,
            id = _ref16.id,
            championID = _ref16.championID;

        var cb = arguments[1];

        if (Number.isInteger(id) || Number.isInteger(championID)) {
          return this._championRequest({
            endUrl: 'champions/' + (id || championID),
            region: region
          }, cb);
        } else {
          return this._logError(this.getChamp.name, 'required params ' + chalk.yellow('`id/championID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getChampMastery',
      value: function getChampMastery() {
        var _ref17 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref17$region = _ref17.region,
            region = _ref17$region === undefined ? this.defaultRegion : _ref17$region,
            playerID = _ref17.playerID,
            championID = _ref17.championID,
            options = _ref17.options;

        var cb = arguments[1];

        if (Number.isInteger(playerID) && Number.isInteger(championID)) {
          return this._championMasteryRequest({
            endUrl: 'champion-masteries/by-summoner/' + playerID + '/by-champion/' + championID, region: region, options: options
          }, cb);
        } else {
          return this._logError(this.getChampMastery.name, 'required params ' + chalk.yellow('`playerID` (int) AND `championID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getChampMasteries',
      value: function getChampMasteries() {
        var _this2 = this;

        var _ref18 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref18$region = _ref18.region,
            region = _ref18$region === undefined ? this.defaultRegion : _ref18$region,
            accountID = _ref18.accountID,
            accID = _ref18.accID,
            id = _ref18.id,
            summonerID = _ref18.summonerID,
            playerID = _ref18.playerID,
            name = _ref18.name,
            options = _ref18.options;

        var cb = arguments[1];

        if (Number.isInteger(accountID || accID)) {
          return new Promise(function (resolve, reject) {
            return _this2.getSummoner({ accID: accountID || accID, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this2._championMasteryRequest({
                endUrl: 'champion-masteries/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerID || playerID)) {
          return this._championMasteryRequest({
            endUrl: 'champion-masteries/by-summoner/' + (id || summonerID || playerID), region: region, options: options
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this2.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this2._championMasteryRequest({
                endUrl: 'champion-masteries/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else {
          return this._logError(this.getChampMasteries.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`accountID/accID` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getTotalChampMasteryScore',
      value: function getTotalChampMasteryScore() {
        var _this3 = this;

        var _ref19 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref19$region = _ref19.region,
            region = _ref19$region === undefined ? this.defaultRegion : _ref19$region,
            accountID = _ref19.accountID,
            accID = _ref19.accID,
            id = _ref19.id,
            summonerID = _ref19.summonerID,
            playerID = _ref19.playerID,
            name = _ref19.name,
            options = _ref19.options;

        var cb = arguments[1];

        if (Number.isInteger(accountID || accID)) {
          return new Promise(function (resolve, reject) {
            return _this3.getSummoner({ accID: accountID || accID, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this3._championMasteryRequest({
                endUrl: 'scores/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerID || playerID)) {
          return this._championMasteryRequest({
            endUrl: 'scores/by-summoner/' + (id || summonerID || playerID), region: region, options: options
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this3.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this3._championMasteryRequest({
                endUrl: 'scores/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else {
          return this._logError(this.getTotalChampMasteryScore.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`accountID/accID` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getCurrentGame',
      value: function getCurrentGame() {
        var _this4 = this,
            _arguments = arguments;

        var _ref20 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref20$region = _ref20.region,
            region = _ref20$region === undefined ? this.defaultRegion : _ref20$region,
            accountID = _ref20.accountID,
            accID = _ref20.accID,
            id = _ref20.id,
            summonerID = _ref20.summonerID,
            playerID = _ref20.playerID,
            name = _ref20.name;

        var cb = arguments[1];

        if (Number.isInteger(accountID || accID)) {
          return new Promise(function (resolve, reject) {
            return _this4.getSummoner({ accID: accountID || accID, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this4._spectatorRequest({
                endUrl: 'active-games/by-summoner/' + data.id,
                region: region
              }, cb = region ? cb : _arguments[0]));
            });
          });
        } else if (Number.isInteger(id || summonerID || playerID)) {
          return this._spectatorRequest({
            endUrl: 'active-games/by-summoner/' + (id || summonerID || playerID),
            region: region
          }, cb = region ? cb : arguments[0]);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this4.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this4._spectatorRequest({
                endUrl: 'active-games/by-summoner/' + data.id,
                region: region
              }, cb = region ? cb : _arguments[0]));
            });
          });
        } else {
          return this._logError(this.getCurrentGame.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`accountID/accID` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getFeaturedGames',
      value: function getFeaturedGames() {
        var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref21.region;

        var cb = arguments[1];

        return this._spectatorRequest({
          endUrl: 'featured-games',
          region: region
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getRecentGames',
      value: function getRecentGames() {
        var _this5 = this;

        var _ref22 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref22.region,
            accountID = _ref22.accountID,
            accID = _ref22.accID,
            id = _ref22.id,
            summonerID = _ref22.summonerID,
            playerID = _ref22.playerID,
            name = _ref22.name;

        var cb = arguments[1];

        if (Number.isInteger(accountID || accID)) {
          return new Promise(function (resolve, reject) {
            return _this5.getSummoner({ accID: accountID || accID, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this5._gameRequest({
                endUrl: 'by-summoner/' + data.id + '/recent', region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerID || playerID)) {
          return this._gameRequest({
            endUrl: 'by-summoner/' + (id || summonerID || playerID) + '/recent',
            region: region
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this5.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this5._gameRequest({
                endUrl: 'by-summoner/' + data.id + '/recent', region: region
              }, cb));
            });
          });
        } else {
          return this._logError(this.getRecentGames.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`accountID/accID` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getLeagues',
      value: function getLeagues() {
        var _this6 = this;

        var _ref23 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref23.region,
            accountID = _ref23.accountID,
            accID = _ref23.accID,
            id = _ref23.id,
            summonerID = _ref23.summonerID,
            playerID = _ref23.playerID,
            name = _ref23.name,
            options = _ref23.options;

        var cb = arguments[1];

        if (Number.isInteger(accountID || accID)) {
          return new Promise(function (resolve, reject) {
            return _this6.getSummoner({ accID: accountID || accID, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this6._leagueRequest({
                endUrl: 'by-summoner/' + data.id,
                region: region, options: options
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerID || playerID)) {
          return this._leagueRequest({
            endUrl: 'by-summoner/' + (id || summonerID || playerID),
            region: region, options: options
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this6.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this6._leagueRequest({
                endUrl: 'by-summoner/' + data.id,
                region: region, options: options
              }, cb));
            });
          });
        } else {
          return this._logError(this.getLeagues.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`accountID/accID` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getLeagueEntries',
      value: function getLeagueEntries() {
        var _this7 = this;

        var _ref24 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref24.region,
            accountID = _ref24.accountID,
            accID = _ref24.accID,
            id = _ref24.id,
            summonerID = _ref24.summonerID,
            playerID = _ref24.playerID,
            name = _ref24.name;

        var cb = arguments[1];

        if (Number.isInteger(accountID || accID)) {
          return new Promise(function (resolve, reject) {
            return _this7.getSummoner({ accID: accountID || accID, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this7._leagueRequest({
                endUrl: 'by-summoner/' + data.id + '/entry',
                region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerID || playerID)) {
          return this._leagueRequest({
            endUrl: 'by-summoner/' + (id || summonerID || playerID) + '/entry',
            region: region
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this7.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this7._leagueRequest({
                endUrl: 'by-summoner/' + data.id + '/entry',
                region: region
              }, cb));
            });
          });
        } else {
          this._logError(this.getLeagueEntries.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`accountID/accID` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getChallengers',
      value: function getChallengers() {
        var _ref25 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref25.region,
            _ref25$options = _ref25.options,
            options = _ref25$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref25$options;

        var cb = arguments[1];

        return this._leagueRequest({
          endUrl: 'challenger', region: region, options: options
        }, cb = arguments.length === 2 ? cb : arguments[0]);
      }
    }, {
      key: 'getMasters',
      value: function getMasters() {
        var _ref26 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref26.region,
            _ref26$options = _ref26.options,
            options = _ref26$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref26$options;

        var cb = arguments[1];

        return this._leagueRequest({
          endUrl: 'master', region: region, options: options
        }, cb = arguments.length === 2 ? cb : arguments[0]);
      }
    }, {
      key: 'getChampionList',
      value: function getChampionList() {
        var _ref27 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref27.region,
            options = _ref27.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'champions', region: region, options: options }, cb = arguments.length === 2 ? cb : arguments[0]);
      }
    }, {
      key: 'getChampion',
      value: function getChampion() {
        var _ref28 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref28.region,
            id = _ref28.id,
            championID = _ref28.championID,
            options = _ref28.options;

        var cb = arguments[1];

        if (Number.isInteger(id || championID)) {
          return this._staticRequest({ endUrl: 'champions/' + (id || championID), region: region, options: options }, cb);
        } else {
          return this._logError(this.getChampion.name, 'required params ' + chalk.yellow('`id/championID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getItems',
      value: function getItems() {
        var _ref29 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref29.region,
            options = _ref29.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'items', region: region, options: options }, cb = arguments.length === 2 ? cb : arguments[0]);
      }
    }, {
      key: 'getItem',
      value: function getItem() {
        var _ref30 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref30.region,
            id = _ref30.id,
            itemID = _ref30.itemID,
            options = _ref30.options;

        var cb = arguments[1];

        if (Number.isInteger(id || itemID)) {
          return this._staticRequest({ endUrl: 'items/' + (id || itemID), region: region, options: options }, cb);
        } else {
          return this._logError(this.getItem.name, 'required params ' + chalk.yellow('`id/itemID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getLanguageStrings',
      value: function getLanguageStrings() {
        var _ref31 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref31.region,
            options = _ref31.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'language-strings', region: region, options: options }, cb = arguments.length === 2 ? cb : arguments[0]);
      }
    }, {
      key: 'getLanguages',
      value: function getLanguages() {
        var _ref32 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref32.region;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'languages', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMapData',
      value: function getMapData() {
        var _ref33 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref33.region,
            options = _ref33.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'maps', region: region, options: options }, cb = arguments.length === 2 ? cb : arguments[0]);
      }
    }, {
      key: 'getMasteryList',
      value: function getMasteryList() {
        var _ref34 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref34.region,
            options = _ref34.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'masteries', region: region, options: options }, cb = arguments.length === 2 ? cb : arguments[0]);
      }
    }, {
      key: 'getMastery',
      value: function getMastery() {
        var _ref35 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref35.region,
            id = _ref35.id,
            masteryID = _ref35.masteryID,
            options = _ref35.options;

        var cb = arguments[1];

        if (Number.isInteger(id || masteryID)) {
          return this._staticRequest({
            endUrl: 'masteries/' + (id || masteryID),
            region: region, options: options
          }, cb);
        } else {
          return this._logError(this.getMastery.name, 'required params ' + chalk.yellow('`id/masteryID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getProfileIcons',
      value: function getProfileIcons(_ref36, cb) {
        var region = _ref36.region,
            options = _ref36.options;

        return this._staticRequest({ endUrl: 'profile-icons', region: region, options: options }, cb = arguments.length === 2 ? cb : arguments[0]);
      }
    }, {
      key: 'getRealmData',
      value: function getRealmData() {
        var _ref37 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref37.region;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'realms', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getRuneList',
      value: function getRuneList() {
        var _ref38 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref38.region,
            options = _ref38.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'runes', region: region, options: options }, cb = arguments.length === 2 ? cb : arguments[0]);
      }
    }, {
      key: 'getRune',
      value: function getRune() {
        var _ref39 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref39.region,
            id = _ref39.id,
            runeID = _ref39.runeID,
            options = _ref39.options;

        var cb = arguments[1];

        if (Number.isInteger(id || runeID)) {
          return this._staticRequest({ endUrl: 'runes/' + (id || runeID), region: region, options: options }, cb);
        } else {
          return this._logError(this.getRune.name, 'required params ' + chalk.yellow('`id/runeID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummonerSpells',
      value: function getSummonerSpells() {
        var _ref40 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref40.region,
            options = _ref40.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'summoner-spells', region: region, options: options }, cb = arguments.length === 2 ? cb : arguments[0]);
      }
    }, {
      key: 'getSummonerSpell',
      value: function getSummonerSpell() {
        var _ref41 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref41.region,
            id = _ref41.id,
            spellID = _ref41.spellID,
            summonerSpellID = _ref41.summonerSpellID,
            options = _ref41.options;

        var cb = arguments[1];

        if (Number.isInteger(id || spellID || summonerSpellID)) {
          return this._staticRequest({
            endUrl: 'summoner-spells/' + (id || spellID || summonerSpellID),
            region: region, options: options
          }, cb);
        } else {
          return this._logError(this.getSummonerSpell.name, 'required params ' + chalk.yellow('`id/spellID/summonerSpellID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getVersionData',
      value: function getVersionData() {
        var _ref42 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref42.region,
            options = _ref42.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'versions', region: region, options: options }, cb = arguments.length === 2 ? cb : arguments[0]);
      }
    }, {
      key: 'getShardStatus',
      value: function getShardStatus() {
        var _ref43 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref43.region;

        var cb = arguments[1];

        return this._statusRequest({ endUrl: 'shard-data', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMatch',
      value: function getMatch() {
        var _ref44 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref44.region,
            id = _ref44.id,
            matchID = _ref44.matchID,
            options = _ref44.options;

        var cb = arguments[1];

        if (Number.isInteger(id || matchID)) {
          return this._matchRequest({ endUrl: 'matches/' + (id || matchID), region: region, options: options }, cb);
        } else {
          return this._logError(this.getMatch.name, 'required params ' + chalk.yellow('`id/matchID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getMatchlist',
      value: function getMatchlist() {
        var _this8 = this;

        var _ref45 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref45.region,
            accountID = _ref45.accountID,
            accID = _ref45.accID,
            id = _ref45.id,
            summonerID = _ref45.summonerID,
            playerID = _ref45.playerID,
            name = _ref45.name,
            _ref45$options = _ref45.options,
            options = _ref45$options === undefined ? { queue: queueTypes.TEAM_BUILDER_RANKED_SOLO } : _ref45$options;

        var cb = arguments[1];

        if (Number.isInteger(accountID || accID)) {
          return this._matchRequest({
            endUrl: 'matchlists/by-account/' + (accountID || accID),
            region: region, options: options
          }, cb);
        } else if (Number.isInteger(id || summonerID || playerID)) {
          return new Promise(function (resolve, reject) {
            return _this8.getSummoner({ id: id, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this8._matchRequest({
                endUrl: 'matchlists/by-account/' + data.accountId,
                region: region, options: options
              }, cb));
            });
          });
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this8.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this8._matchRequest({
                endUrl: 'matchlists/by-account/' + data.accountId,
                region: region, options: options
              }, cb));
            });
          });
        } else {
          return this._logError(this.getMatchlist.name, 'required params ' + chalk.yellow('`accountID/accID` (int)') + ', ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getRecentMatchlist',
      value: function getRecentMatchlist() {
        var _this9 = this;

        var _ref46 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref46.region,
            accountID = _ref46.accountID,
            accID = _ref46.accID,
            id = _ref46.id,
            summonerID = _ref46.summonerID,
            playerID = _ref46.playerID,
            name = _ref46.name;

        var cb = arguments[1];

        if (Number.isInteger(accountID || accID)) {
          return this._matchRequest({
            endUrl: 'matchlists/by-account/' + (accountID || accID) + '/recent',
            region: region
          }, cb);
        } else if (Number.isInteger(id || summonerID || playerID)) {
          return new Promise(function (resolve, reject) {
            return _this9.getSummoner({ id: id, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this9._matchRequest({
                endUrl: 'matchlists/by-account/' + data.accountId + '/recent',
                region: region
              }, cb));
            });
          });
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this9.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this9._matchRequest({
                endUrl: 'matchlists/by-account/' + data.accountId + '/recent',
                region: region
              }, cb));
            });
          });
        } else {
          return this._logError(this.getRecentMatchlist.name, 'required params ' + chalk.yellow('`accountID/accID` (int)') + ', ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getMatchTimeline',
      value: function getMatchTimeline() {
        var _ref47 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref47.region,
            id = _ref47.id,
            matchID = _ref47.matchID;

        var cb = arguments[1];

        if (Number.isInteger(id || matchID)) {
          return this._matchRequest({
            endUrl: 'timelines/by-match/' + (id || matchID),
            region: region
          }, cb);
        } else {
          return this._logError(this.getMatchTimeline.name, 'required params ' + chalk.yellow('`id/matchID` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getRunes',
      value: function getRunes() {
        var _this10 = this;

        var _ref48 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref48.region,
            accountID = _ref48.accountID,
            accID = _ref48.accID,
            id = _ref48.id,
            summonerID = _ref48.summonerID,
            playerID = _ref48.playerID,
            name = _ref48.name;

        var cb = arguments[1];

        if (Number.isInteger(accountID || accID)) {
          return new Promise(function (resolve, reject) {
            return _this10.getSummoner({ accID: accountID || accID, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this10._runesMasteriesRequest({
                endUrl: 'runes/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerID || playerID)) {
          return this._runesMasteriesRequest({
            endUrl: 'runes/by-summoner/' + (id || summonerID || playerID),
            region: region
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this10.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this10._runesMasteriesRequest({
                endUrl: 'runes/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else {
          return this._logError(this.getRunes.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`accountID/accID` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getMasteries',
      value: function getMasteries() {
        var _this11 = this;

        var _ref49 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref49.region,
            accountID = _ref49.accountID,
            accID = _ref49.accID,
            id = _ref49.id,
            summonerID = _ref49.summonerID,
            playerID = _ref49.playerID,
            name = _ref49.name;

        var cb = arguments[1];

        if (Number.isInteger(accountID || accID)) {
          return new Promise(function (resolve, reject) {
            return _this11.getSummoner({ accID: accountID || accID, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this11._runesMasteriesRequest({
                endUrl: 'masteries/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerID || playerID)) {
          return this._runesMasteriesRequest({
            endUrl: 'masteries/by-summoner/' + (id || summonerID || playerID),
            region: region
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this11.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this11._runesMasteriesRequest({
                endUrl: 'masteries/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else {
          return this._logError(this.getMasteries.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`accountID/accID` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getRankedStats',
      value: function getRankedStats() {
        var _this12 = this;

        var _ref50 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref50.region,
            accountID = _ref50.accountID,
            accID = _ref50.accID,
            id = _ref50.id,
            summonerID = _ref50.summonerID,
            playerID = _ref50.playerID,
            name = _ref50.name,
            options = _ref50.options;

        var cb = arguments[1];

        if (Number.isInteger(accountID || accID)) {
          return new Promise(function (resolve, reject) {
            return _this12.getSummoner({ accID: accountID || accID, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this12._statsRequest({
                endUrl: data.id + '/ranked',
                region: region, options: options
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerID || playerID)) {
          return this._statsRequest({
            endUrl: (id || summonerID || playerID) + '/ranked',
            region: region, options: options
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this12.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this12._statsRequest({
                endUrl: data.id + '/ranked',
                region: region, options: options
              }, cb));
            });
          });
        } else {
          this._logError(this.getRankedStats.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`accountID/accID` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getStatsSummary',
      value: function getStatsSummary() {
        var _this13 = this;

        var _ref51 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref51.region,
            accountID = _ref51.accountID,
            accID = _ref51.accID,
            id = _ref51.id,
            summonerID = _ref51.summonerID,
            playerID = _ref51.playerID,
            name = _ref51.name,
            options = _ref51.options;

        var cb = arguments[1];

        if (Number.isInteger(accountID || accID)) {
          return new Promise(function (resolve, reject) {
            return _this13.getSummoner({ accID: accountID || accID, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this13._statsRequest({
                endUrl: data.id + '/summary',
                region: region, options: options
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerID || playerID)) {
          return this._statsRequest({
            endUrl: (id || summonerID || playerID) + '/summary',
            region: region, options: options
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this13.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this13._statsRequest({
                endUrl: data.id + '/summary',
                region: region, options: options
              }, cb));
            });
          });
        } else {
          this._logError(this.getStatsSummary.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`accountID/accID` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummoner',
      value: function getSummoner() {
        var _ref52 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref52.region,
            id = _ref52.id,
            summonerID = _ref52.summonerID,
            playerID = _ref52.playerID,
            accountID = _ref52.accountID,
            accID = _ref52.accID,
            name = _ref52.name;

        var cb = arguments[1];

        if (Number.isInteger(id || summonerID || playerID)) {
          return this._summonerRequest({
            endUrl: '' + (id || summonerID || playerID),
            region: region
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this._summonerRequest({
            endUrl: 'by-name/' + this._sanitizeName(name),
            region: region
          }, cb);
        } else if (Number.isInteger(accountID || accID)) {
          return this._summonerRequest({
            endUrl: 'by-account/' + (accountID || accID),
            region: region
          }, cb);
        } else {
          return this._logError(this.getSummoner.name, 'required params ' + chalk.yellow('`id/summonerID/playerID` (int)') + ', ' + chalk.yellow('`accountID/accID` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummonerByAccID',
      value: function getSummonerByAccID(accID, region, cb) {
        return this.Summoner.get({
          region: region,
          accID: accID
        }, cb);
      }
    }, {
      key: 'getMatchlistByName',
      value: function getMatchlistByName(name, region, options, cb) {
        return this.Matchlist.get({
          region: region,
          name: name,
          options: options
        }, cb);
      }
    }, {
      key: 'getRunesBySummonerID',
      value: function getRunesBySummonerID(id, region, cb) {
        return this.Runes.get({
          region: region,
          id: id
        }, cb);
      }
    }, {
      key: 'getRunesByAccountID',
      value: function getRunesByAccountID(accID, region, cb) {
        return this.Runes.get({
          region: region,
          accID: accID
        }, cb);
      }
    }, {
      key: 'staticRuneList',
      value: function staticRuneList(region, options, cb) {
        return this.Static.runes({
          region: region, options: options
        }, cb);
      }
    }]);

    return Kindred$1;
  }();

  function QuickStart(apiKey, region, debug) {
    return new Kindred$1({
      key: apiKey,
      defaultRegion: region,
      debug: debug,
      limits: limits.DEV,
      cacheOptions: caches[0]
    });
  }

  function print(err, data) {
    if (err) console.log(err);else console.log(data);
  }

  var Kindred$2 = {
    Kindred: Kindred$1,
    REGIONS: regions,
    LIMITS: limits,
    TIME_CONSTANTS: cacheTimers,
    CACHE_TYPES: caches,
    QUEUE_TYPES: queueTypes,
    QuickStart: QuickStart,
    print: print
  };

  module.exports = Kindred$2;
});