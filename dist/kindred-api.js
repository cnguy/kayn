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
          expires: args.ttl ? this.setExp(Date.now(), args.ttl) : null,
          value: value
        };
      }
    }, {
      key: 'setExp',
      value: function setExp(date, secs) {
        return date + secs * 1000;
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

        while (this.madeRequests.length > 0 && t - this.madeRequests.peekFront() >= this.seconds * 100) {
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
    'LEAGUE': 'league',
    'STATUS': 'status',
    'MASTERIES': 'platform',
    'MATCH': 'match',
    'MATCH_LIST': null,
    'RUNES': 'platform',
    'RUNES_MASTERIES': 'platform',
    'SPECTATOR': 'spectator',
    'STATIC_DATA': 'static-data',
    'STATS': null,
    'SUMMONER': 'summoner',
    'TOURNAMENT_STUB': 'tournament-stub',
    'TOURNAMENT': 'tournament'
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
    SUMMONER: cacheTimers.DAY,
    TOURNAMENT_STUB: cacheTimers.HOUR,
    TOURNAMENT: cacheTimers.HOUR };

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
    'LEAGUE': 3,
    'STATIC_DATA': 3,
    'STATUS': 3,
    'MATCH': 3,
    'MATCH_LIST': 2.2,
    'RUNES_MASTERIES': 3,
    'SPECTATOR': 3,
    'STATS': 1.3,
    'SUMMONER': 3,
    'TOURNAMENT_STUB': 3,
    'TOURNAMENT': 3
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
    function Kindred$1() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          key = _ref.key,
          _ref$defaultRegion = _ref.defaultRegion,
          defaultRegion = _ref$defaultRegion === undefined ? regions.NORTH_AMERICA : _ref$defaultRegion,
          _ref$debug = _ref.debug,
          debug = _ref$debug === undefined ? false : _ref$debug,
          limits$$1 = _ref.limits,
          spread = _ref.spread,
          cacheOptions = _ref.cacheOptions,
          cacheTTL = _ref.cacheTTL;

      _classCallCheck(this, Kindred$1);

      if (arguments.length === 0 || _typeof(arguments[0]) !== 'object' || typeof key !== 'string') {
        throw new Error('' + chalk.red('API key not passed in!'));
      }

      this.key = key;

      this.defaultRegion = check(defaultRegion) ? defaultRegion : undefined;

      if (!this.defaultRegion) {
        throw new Error(chalk.red('setRegion() by Kindred failed: ' + chalk.yellow(defaultRegion) + ' is an invalid region.') + '\n' + ('' + chalk.red('Try importing ' + chalk.yellow("require('./dist/kindred-api').REGIONS") + ' and using one of those values instead.')));
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
          throw new Error();
        }

        this.limits = {};

        if (limits$$1 === 'dev') limits$$1 = limits.DEV;
        if (limits$$1 === 'prod') limits$$1 = limits.PROD;

        this.spread = spread;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.keys(regions)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var region = _step2.value;

            this.limits[regions[region]] = [new RateLimit(limits$$1[0][0], limits$$1[0][1]), new RateLimit(limits$$1[1][0], limits$$1[1][1]), this.spread ? new RateLimit(limits$$1[0][0] / 10, 0.8) : null];
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
        get: this.getChamp.bind(this),

        list: this.listChampions.bind(this),
        by: {
          id: this.getChampionById.bind(this)
        }
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
        get: this.getFeaturedGames.bind(this),

        list: this.listFeaturedGames.bind(this)
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

        getLeaguePositions: this.getLeaguePositions.bind(this),
        getPositions: this.getLeaguePositions.bind(this),
        positions: this.getLeaguePositions.bind(this),

        getChallengers: this.getChallengers.bind(this),
        challengers: this.getChallengers.bind(this),

        getMasters: this.getMasters.bind(this),
        masters: this.getMasters.bind(this)
      };

      this.Challenger = {
        list: this.listChallengers.bind(this)
      };

      this.Master = {
        list: this.listMasters.bind(this)
      };

      this.Static = {
        Champion: {
          list: this.getStaticChampionList.bind(this),
          by: {
            id: this.getStaticChampionById.bind(this)
          }
        },
        Item: {
          list: this.getStaticItemList.bind(this),
          by: {
            id: this.getStaticItemById.bind(this)
          }
        },
        LanguageString: {
          list: this.getStaticLanguageStringList.bind(this)
        },
        Language: {
          list: this.getStaticLanguageList.bind(this)
        },
        Map: {
          list: this.getStaticMapList.bind(this)
        },
        Mastery: {
          list: this.getStaticMasteryList.bind(this),
          by: {
            id: this.getStaticMasteryById.bind(this)
          }
        },
        ProfileIcon: {
          list: this.getStaticProfileIconList.bind(this)
        },
        Realm: {
          list: this.getStaticRealmList.bind(this)
        },
        Rune: {
          list: this.getStaticRuneList.bind(this),
          by: {
            id: this.getStaticRuneById.bind(this)
          }
        },
        SummonerSpell: {
          list: this.getStaticSummonerSpellList.bind(this),
          by: {
            id: this.getStaticSummonerSpellById.bind(this)
          }
        },
        Version: {
          list: this.getStaticVersionList.bind(this)
        },

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
        timeline: this.getMatchTimeline.bind(this),

        by: {
          id: this.getMatchById.bind(this)
        }
      };

      this.Matchlist = {
        getMatchlist: this.getMatchlist.bind(this),
        get: this.getMatchlist.bind(this),

        getRecentMatchlist: this.getRecentMatchlist.bind(this),
        recent: this.getRecentMatchlist.bind(this),

        by: {
          account: this.getMatchlistByAccountId.bind(this),
          id: this.getMatchlistById.bind(this),
          name: this.getMatchlistByName.bind(this)
        }
      };

      this.MatchHistory = {};

      this.RunesMasteries = {
        getRunes: this.getRunes.bind(this),
        runes: this.getRunes.bind(this),

        getMasteries: this.getMasteries.bind(this),
        masteries: this.getMasteries.bind(this)
      };

      this.Runes = {
        get: this.getRunes.bind(this),

        by: {
          account: this.getRunesByAccountId.bind(this),
          id: this.getRunesById.bind(this),
          name: this.getRunesByName.bind(this)
        }
      };

      this.Masteries = {
        get: this.getMasteries.bind(this),

        by: {
          account: this.getMasteriesByAccountId.bind(this),
          id: this.getMasteriesById.bind(this),
          name: this.getMasteriesByName.bind(this)
        }
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
        totalChampionMasteryScore: this.getTotalChampMasteryScore.bind(this),

        by: {
          account: this.getSummonerByAccountId.bind(this),
          id: this.getSummonerById.bind(this),
          name: this.getSummonerByName.bind(this)
        }
      };

      this.Tournament = {
        getDTOByCode: this.getDTOByCode.bind(this),

        DTO: {
          by: {
            code: this.getDTOByCode.bind(this)
          }
        },

        getLobbyListEventsByCode: this.getLobbyListEventsByCode.bind(this),

        LobbyListEvents: {
          by: {
            code: this.getLobbyListEventsByCode.bind(this)
          }
        }
      };

      this.Ex = {
        getSummonerByAccId: this.getSummonerByAccId.bind(this),
        getMatchlistByName: this.getMatchlistByName.bind(this),
        getRunesBySummonerId: this.getRunesBySummonerId.bind(this),
        getRunesByAccountId: this.getRunesByAccountId.bind(this),
        staticRuneList: this.staticRuneList.bind(this)
      };
    }

    _createClass(Kindred$1, [{
      key: 'canMakeRequest',
      value: function canMakeRequest(region) {
        if (this.spread) {
          return this.limits[region][0].requestAvailable() && this.limits[region][1].requestAvailable() && this.limits[region][2].requestAvailable();
        } else {
          return this.limits[region][0].requestAvailable() && this.limits[region][1].requestAvailable();
        }
      }
    }, {
      key: '_sanitizeName',
      value: function _sanitizeName(name) {
        if (this._validName(name)) {
          return name.replace(/\s/g, '').toLowerCase();
        } else {
          this._logError(this._validName.name, 'Name ' + chalk.yellow(name) + ' is not valid. Request failed.');
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
                  var self = _this;(function sendRequest(callback) {
                    if (self.canMakeRequest(region)) {
                      if (!staticReq) {
                        self.limits[region][0].addRequest();
                        self.limits[region][1].addRequest();
                        if (self.spread) {
                          self.limits[region][2].addRequest();
                        }
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
                            if (statusCode >= 500) {
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
                      var self = _this;

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
          endUrl: services.LEAGUE + '/v' + versions.LEAGUE + '/' + endUrl, region: region, options: options,
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
      key: '_tournamentRequest',
      value: function _tournamentRequest(_ref15, cb) {
        var endUrl = _ref15.endUrl,
            region = _ref15.region;

        return this._baseRequest({
          endUrl: services.TOURNAMENT + '/v' + versions.TOURNAMENT, region: region,
          cacheParams: {
            ttl: this.CACHE_TIMERS.TOURNAMENT
          }
        }, cb);
      }
    }, {
      key: '_logError',
      value: function _logError(message, expected) {
        throw new Error(chalk.bold.yellow(message) + " " + chalk.red('request') + " " + chalk.bold.red('FAILED') + chalk.red('; ' + expected));
      }
    }, {
      key: 'setRegion',
      value: function setRegion(region) {
        this.defaultRegion = check(region) ? region : undefined;

        if (!this.defaultRegion) throw new Error(chalk.red('setRegion() by Kindred failed: ' + chalk.yellow(region) + ' is an invalid region.') + '\n' + ('' + chalk.red('Try importing ' + chalk.yellow("require('./dist/kindred-api').REGIONS") + ' and using one of those values instead.')));
      }
    }, {
      key: 'getChamps',
      value: function getChamps() {
        var _ref16 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref16.region,
            options = _ref16.options;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._championRequest({
          endUrl: 'champions', region: region, options: options
        }, cb);
      }
    }, {
      key: 'getChamp',
      value: function getChamp() {
        var _ref17 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref17.region,
            id = _ref17.id,
            championId = _ref17.championId;

        var cb = arguments[1];

        if (Number.isInteger(id) || Number.isInteger(championId)) {
          return this._championRequest({
            endUrl: 'champions/' + (id || championId),
            region: region
          }, cb);
        } else {
          return this._logError(this.getChamp.name, 'required params ' + chalk.yellow('`id/championId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getChampMastery',
      value: function getChampMastery() {
        var _ref18 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref18$region = _ref18.region,
            region = _ref18$region === undefined ? this.defaultRegion : _ref18$region,
            playerId = _ref18.playerId,
            championId = _ref18.championId,
            options = _ref18.options;

        var cb = arguments[1];

        if (Number.isInteger(playerId) && Number.isInteger(championId)) {
          return this._championMasteryRequest({
            endUrl: 'champion-masteries/by-summoner/' + playerId + '/by-champion/' + championId, region: region, options: options
          }, cb);
        } else {
          return this._logError(this.getChampMastery.name, 'required params ' + chalk.yellow('`playerId` (int) AND `championId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getChampMasteries',
      value: function getChampMasteries() {
        var _this2 = this;

        var _ref19 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref19$region = _ref19.region,
            region = _ref19$region === undefined ? this.defaultRegion : _ref19$region,
            accountId = _ref19.accountId,
            accId = _ref19.accId,
            id = _ref19.id,
            summonerId = _ref19.summonerId,
            playerId = _ref19.playerId,
            name = _ref19.name;

        var cb = arguments[1];

        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this2.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this2._championMasteryRequest({
                endUrl: 'champion-masteries/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          return this._championMasteryRequest({
            endUrl: 'champion-masteries/by-summoner/' + (id || summonerId || playerId), region: region
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
          return this._logError(this.getChampMasteries.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getTotalChampMasteryScore',
      value: function getTotalChampMasteryScore() {
        var _this3 = this;

        var _ref20 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref20$region = _ref20.region,
            region = _ref20$region === undefined ? this.defaultRegion : _ref20$region,
            accountId = _ref20.accountId,
            accId = _ref20.accId,
            id = _ref20.id,
            summonerId = _ref20.summonerId,
            playerId = _ref20.playerId,
            name = _ref20.name,
            options = _ref20.options;

        var cb = arguments[1];

        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this3.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this3._championMasteryRequest({
                endUrl: 'scores/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          return this._championMasteryRequest({
            endUrl: 'scores/by-summoner/' + (id || summonerId || playerId), region: region, options: options
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
          return this._logError(this.getTotalChampMasteryScore.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getCurrentGame',
      value: function getCurrentGame() {
        var _this4 = this;

        var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref21.region,
            accountId = _ref21.accountId,
            accId = _ref21.accId,
            id = _ref21.id,
            summonerId = _ref21.summonerId,
            playerId = _ref21.playerId,
            name = _ref21.name;

        var cb = arguments[1];

        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this4.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this4._spectatorRequest({
                endUrl: 'active-games/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          return this._spectatorRequest({
            endUrl: 'active-games/by-summoner/' + (id || summonerId || playerId),
            region: region
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this4.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this4._spectatorRequest({
                endUrl: 'active-games/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else {
          return this._logError(this.getCurrentGame.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getFeaturedGames',
      value: function getFeaturedGames() {
        var _ref22 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref22.region;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._spectatorRequest({
          endUrl: 'featured-games',
          region: region
        }, cb);
      }
    }, {
      key: 'getRecentGames',
      value: function getRecentGames() {
        var _this5 = this;

        var _ref23 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref23.region,
            accountId = _ref23.accountId,
            accId = _ref23.accId,
            id = _ref23.id,
            summonerId = _ref23.summonerId,
            playerId = _ref23.playerId,
            name = _ref23.name;

        var cb = arguments[1];

        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this5.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this5._gameRequest({
                endUrl: 'by-summoner/' + data.id + '/recent', region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          return this._gameRequest({
            endUrl: 'by-summoner/' + (id || summonerId || playerId) + '/recent',
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
          return this._logError(this.getRecentGames.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getLeagues',
      value: function getLeagues() {
        var _this6 = this;

        var _ref24 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref24.region,
            accountId = _ref24.accountId,
            accId = _ref24.accId,
            id = _ref24.id,
            summonerId = _ref24.summonerId,
            playerId = _ref24.playerId,
            name = _ref24.name,
            options = _ref24.options;

        var cb = arguments[1];

        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this6.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this6._leagueRequest({
                endUrl: 'leagues/by-summoner/' + data.id,
                region: region, options: options
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          return this._leagueRequest({
            endUrl: 'leagues/by-summoner/' + (id || summonerId || playerId),
            region: region, options: options
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this6.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this6._leagueRequest({
                endUrl: 'leagues/by-summoner/' + data.id,
                region: region, options: options
              }, cb));
            });
          });
        } else {
          return this._logError(this.getLeagues.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getLeaguePositions',
      value: function getLeaguePositions() {
        var _this7 = this;

        var _ref25 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref25.region,
            accountId = _ref25.accountId,
            accId = _ref25.accId,
            id = _ref25.id,
            summonerId = _ref25.summonerId,
            playerId = _ref25.playerId,
            name = _ref25.name;

        var cb = arguments[1];

        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this7.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this7._leagueRequest({
                endUrl: 'positions/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          return this._leagueRequest({
            endUrl: 'positions/by-summoner/' + (id || summonerId || playerId),
            region: region
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this7.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this7._leagueRequest({
                endUrl: 'positions/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else {
          this._logError(this.getLeaguePositions.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getChallengers',
      value: function getChallengers() {
        var _ref26 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref26.region,
            _ref26$queue = _ref26.queue,
            queue = _ref26$queue === undefined ? 'RANKED_SOLO_5x5' : _ref26$queue;

        var cb = arguments[1];

        cb = typeof arguments[0] === 'function' ? arguments[0] : arguments[1];

        if (typeof queue === 'string') {
          return this._leagueRequest({
            endUrl: 'challengerleagues/by-queue/' + queue, region: region
          }, cb);
        } else {
          this._logError(this.getChallengers.name, 'required params ' + chalk.yellow('`queue` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getMasters',
      value: function getMasters() {
        var _ref27 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref27.region,
            _ref27$queue = _ref27.queue,
            queue = _ref27$queue === undefined ? 'RANKED_SOLO_5x5' : _ref27$queue;

        var cb = arguments[1];

        cb = typeof arguments[0] === 'function' ? arguments[0] : arguments[1];

        if (typeof queue === 'string') {
          return this._leagueRequest({
            endUrl: 'masterleagues/by-queue/' + queue, region: region
          }, cb);
        } else {
          this._logError(this.getMasters.name, 'required params ' + chalk.yellow('`queue` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getChampionList',
      value: function getChampionList() {
        var _ref28 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref28.region,
            options = _ref28.options;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'champions', region: region, options: options }, cb);
      }
    }, {
      key: 'getChampion',
      value: function getChampion() {
        var _ref29 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref29.region,
            id = _ref29.id,
            championId = _ref29.championId,
            options = _ref29.options;

        var cb = arguments[1];

        if (Number.isInteger(id || championId)) {
          return this._staticRequest({ endUrl: 'champions/' + (id || championId), region: region, options: options }, cb);
        } else {
          return this._logError(this.getChampion.name, 'required params ' + chalk.yellow('`id/championId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getItems',
      value: function getItems() {
        var _ref30 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref30.region,
            options = _ref30.options;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'items', region: region, options: options }, cb);
      }
    }, {
      key: 'getItem',
      value: function getItem() {
        var _ref31 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref31.region,
            id = _ref31.id,
            itemId = _ref31.itemId,
            options = _ref31.options;

        var cb = arguments[1];

        if (Number.isInteger(id || itemId)) {
          return this._staticRequest({ endUrl: 'items/' + (id || itemId), region: region, options: options }, cb);
        } else {
          return this._logError(this.getItem.name, 'required params ' + chalk.yellow('`id/itemId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getLanguageStrings',
      value: function getLanguageStrings() {
        var _ref32 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref32.region,
            options = _ref32.options;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'language-strings', region: region, options: options }, cb);
      }
    }, {
      key: 'getLanguages',
      value: function getLanguages() {
        var _ref33 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref33.region;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'languages', region: region }, cb);
      }
    }, {
      key: 'getMapData',
      value: function getMapData() {
        var _ref34 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref34.region,
            options = _ref34.options;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'maps', region: region, options: options }, cb);
      }
    }, {
      key: 'getMasteryList',
      value: function getMasteryList() {
        var _ref35 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref35.region,
            options = _ref35.options;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'masteries', region: region, options: options }, cb);
      }
    }, {
      key: 'getMastery',
      value: function getMastery() {
        var _ref36 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref36.region,
            id = _ref36.id,
            masteryId = _ref36.masteryId,
            options = _ref36.options;

        var cb = arguments[1];

        if (Number.isInteger(id || masteryId)) {
          return this._staticRequest({
            endUrl: 'masteries/' + (id || masteryId),
            region: region, options: options
          }, cb);
        } else {
          return this._logError(this.getMastery.name, 'required params ' + chalk.yellow('`id/masteryId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getProfileIcons',
      value: function getProfileIcons(_ref37, cb) {
        var region = _ref37.region,
            options = _ref37.options;

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'profile-icons', region: region, options: options }, cb);
      }
    }, {
      key: 'getRealmData',
      value: function getRealmData() {
        var _ref38 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref38.region;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'realms', region: region }, cb);
      }
    }, {
      key: 'getRuneList',
      value: function getRuneList() {
        var _ref39 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref39.region,
            options = _ref39.options;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'runes', region: region, options: options }, cb);
      }
    }, {
      key: 'getRune',
      value: function getRune() {
        var _ref40 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref40.region,
            id = _ref40.id,
            runeId = _ref40.runeId,
            options = _ref40.options;

        var cb = arguments[1];

        if (Number.isInteger(id || runeId)) {
          return this._staticRequest({ endUrl: 'runes/' + (id || runeId), region: region, options: options }, cb);
        } else {
          return this._logError(this.getRune.name, 'required params ' + chalk.yellow('`id/runeId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummonerSpells',
      value: function getSummonerSpells() {
        var _ref41 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref41.region,
            options = _ref41.options;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'summoner-spells', region: region, options: options }, cb);
      }
    }, {
      key: 'getSummonerSpell',
      value: function getSummonerSpell() {
        var _ref42 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref42.region,
            id = _ref42.id,
            spellId = _ref42.spellId,
            summonerSpellId = _ref42.summonerSpellId,
            options = _ref42.options;

        var cb = arguments[1];

        if (Number.isInteger(id || spellId || summonerSpellId)) {
          return this._staticRequest({
            endUrl: 'summoner-spells/' + (id || spellId || summonerSpellId),
            region: region, options: options
          }, cb);
        } else {
          return this._logError(this.getSummonerSpell.name, 'required params ' + chalk.yellow('`id/spellId/summonerSpellId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getVersionData',
      value: function getVersionData() {
        var _ref43 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref43.region,
            options = _ref43.options;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'versions', region: region, options: options }, cb);
      }
    }, {
      key: 'getShardStatus',
      value: function getShardStatus() {
        var _ref44 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref44.region;

        var cb = arguments[1];

        if (typeof arguments[0] === 'function') {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._statusRequest({ endUrl: 'shard-data', region: region }, cb);
      }
    }, {
      key: 'getMatch',
      value: function getMatch() {
        var _ref45 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref45.region,
            id = _ref45.id,
            matchId = _ref45.matchId,
            options = _ref45.options;

        var cb = arguments[1];

        if (Number.isInteger(id || matchId)) {
          return this._matchRequest({ endUrl: 'matches/' + (id || matchId), region: region, options: options }, cb);
        } else {
          return this._logError(this.getMatch.name, 'required params ' + chalk.yellow('`id/matchId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getMatchlist',
      value: function getMatchlist() {
        var _this8 = this;

        var _ref46 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref46.region,
            accountId = _ref46.accountId,
            accId = _ref46.accId,
            id = _ref46.id,
            summonerId = _ref46.summonerId,
            playerId = _ref46.playerId,
            name = _ref46.name,
            _ref46$options = _ref46.options,
            options = _ref46$options === undefined ? { queue: queueTypes.TEAM_BUILDER_RANKED_SOLO } : _ref46$options;

        var cb = arguments[1];

        if (Number.isInteger(accountId || accId)) {
          return this._matchRequest({
            endUrl: 'matchlists/by-account/' + (accountId || accId),
            region: region, options: options
          }, cb);
        } else if (Number.isInteger(id || summonerId || playerId)) {
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
          return this._logError(this.getMatchlist.name, 'required params ' + chalk.yellow('`accountId/accId` (int)') + ', ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getRecentMatchlist',
      value: function getRecentMatchlist() {
        var _this9 = this;

        var _ref47 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref47.region,
            accountId = _ref47.accountId,
            accId = _ref47.accId,
            id = _ref47.id,
            summonerId = _ref47.summonerId,
            playerId = _ref47.playerId,
            name = _ref47.name;

        var cb = arguments[1];

        if (Number.isInteger(accountId || accId)) {
          return this._matchRequest({
            endUrl: 'matchlists/by-account/' + (accountId || accId) + '/recent',
            region: region
          }, cb);
        } else if (Number.isInteger(id || summonerId || playerId)) {
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
          return this._logError(this.getRecentMatchlist.name, 'required params ' + chalk.yellow('`accountId/accId` (int)') + ', ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getMatchTimeline',
      value: function getMatchTimeline() {
        var _ref48 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref48.region,
            id = _ref48.id,
            matchId = _ref48.matchId;

        var cb = arguments[1];

        if (Number.isInteger(id || matchId)) {
          return this._matchRequest({
            endUrl: 'timelines/by-match/' + (id || matchId),
            region: region
          }, cb);
        } else {
          return this._logError(this.getMatchTimeline.name, 'required params ' + chalk.yellow('`id/matchId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getRunes',
      value: function getRunes() {
        var _this10 = this;

        var _ref49 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref49.region,
            accountId = _ref49.accountId,
            accId = _ref49.accId,
            id = _ref49.id,
            summonerId = _ref49.summonerId,
            playerId = _ref49.playerId,
            name = _ref49.name;

        var cb = arguments[1];

        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this10.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this10._runesMasteriesRequest({
                endUrl: 'runes/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          return this._runesMasteriesRequest({
            endUrl: 'runes/by-summoner/' + (id || summonerId || playerId),
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
          return this._logError(this.getRunes.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getMasteries',
      value: function getMasteries() {
        var _this11 = this;

        var _ref50 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref50.region,
            accountId = _ref50.accountId,
            accId = _ref50.accId,
            id = _ref50.id,
            summonerId = _ref50.summonerId,
            playerId = _ref50.playerId,
            name = _ref50.name;

        var cb = arguments[1];

        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this11.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this11._runesMasteriesRequest({
                endUrl: 'masteries/by-summoner/' + data.id,
                region: region
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          return this._runesMasteriesRequest({
            endUrl: 'masteries/by-summoner/' + (id || summonerId || playerId),
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
          return this._logError(this.getMasteries.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getRankedStats',
      value: function getRankedStats() {
        var _this12 = this;

        var _ref51 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref51.region,
            accountId = _ref51.accountId,
            accId = _ref51.accId,
            id = _ref51.id,
            summonerId = _ref51.summonerId,
            playerId = _ref51.playerId,
            name = _ref51.name,
            options = _ref51.options;

        var cb = arguments[1];

        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this12.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this12._statsRequest({
                endUrl: data.id + '/ranked',
                region: region, options: options
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          return this._statsRequest({
            endUrl: (id || summonerId || playerId) + '/ranked',
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
          this._logError(this.getRankedStats.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getStatsSummary',
      value: function getStatsSummary() {
        var _this13 = this;

        var _ref52 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref52.region,
            accountId = _ref52.accountId,
            accId = _ref52.accId,
            id = _ref52.id,
            summonerId = _ref52.summonerId,
            playerId = _ref52.playerId,
            name = _ref52.name,
            options = _ref52.options;

        var cb = arguments[1];

        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this13.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              return resolve(_this13._statsRequest({
                endUrl: data.id + '/summary',
                region: region, options: options
              }, cb));
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          return this._statsRequest({
            endUrl: (id || summonerId || playerId) + '/summary',
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
          this._logError(this.getStatsSummary.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummoner',
      value: function getSummoner() {
        var _ref53 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref53.region,
            id = _ref53.id,
            summonerId = _ref53.summonerId,
            playerId = _ref53.playerId,
            accountId = _ref53.accountId,
            accId = _ref53.accId,
            name = _ref53.name;

        var cb = arguments[1];

        if (Number.isInteger(id || summonerId || playerId)) {
          return this._summonerRequest({
            endUrl: '' + (id || summonerId || playerId),
            region: region
          }, cb);
        } else if (_typeof(arguments[0]) === 'object' && typeof name === 'string') {
          return this._summonerRequest({
            endUrl: 'by-name/' + this._sanitizeName(name),
            region: region
          }, cb);
        } else if (Number.isInteger(accountId || accId)) {
          return this._summonerRequest({
            endUrl: 'by-account/' + (accountId || accId),
            region: region
          }, cb);
        } else {
          return this._logError(this.getSummoner.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getDTOByCode',
      value: function getDTOByCode(code, cb) {
        if (typeof code === 'string') {
          return this._tournamentRequest({
            endUrl: 'lobby-events/codes/' + code
          }, cb);
        } else {
          return this._logError(this.getDTOByCode.name, 'required params ' + chalk.yellow('`code` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getLobbyListEventsByCode',
      value: function getLobbyListEventsByCode(code, cb) {
        if (typeof code === 'string') {
          return this._tournamentRequest({
            endUrl: 'lobby-events/by-code/' + code
          }, cb);
        } else {
          return this._logError(this.getLobbyListEventsByCode.name, 'required params ' + chalk.yellow('`code` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'listChampions',
      value: function listChampions(options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Champion.all({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getChampionById',
      value: function getChampionById(id, region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Champion.get({
          id: id, region: region
        }, cb);
      }
    }, {
      key: 'listFeaturedGames',
      value: function listFeaturedGames(region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.FeaturedGames.get({
          region: region
        }, cb);
      }
    }, {
      key: 'listChallengers',
      value: function listChallengers(queue, region, cb) {
        if (check(queue)) {
          region = queue;
          queue = undefined;
        }

        if (typeof queue == 'function') {
          cb = queue;
          queue = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.League.challengers({
          queue: queue, region: region
        }, cb);
      }
    }, {
      key: 'listMasters',
      value: function listMasters(queue, region, cb) {
        if (check(queue)) {
          region = queue;
          queue = undefined;
        }

        if (typeof queue == 'function') {
          cb = queue;
          queue = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.League.masters({
          queue: queue, region: region
        }, cb);
      }
    }, {
      key: 'getSummonerByAccountId',
      value: function getSummonerByAccountId(accId, region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Summoner.get({
          region: region,
          accId: accId
        }, cb);
      }
    }, {
      key: 'getSummonerById',
      value: function getSummonerById(id, region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Summoner.get({
          region: region,
          id: id
        }, cb);
      }
    }, {
      key: 'getSummonerByName',
      value: function getSummonerByName(name, region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Summoner.get({
          region: region,
          name: name
        }, cb);
      }
    }, {
      key: 'getMasteriesByAccountId',
      value: function getMasteriesByAccountId(accId, region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Masteries.get({
          region: region,
          accId: accId
        }, cb);
      }
    }, {
      key: 'getMasteriesById',
      value: function getMasteriesById(id, region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Masteries.get({
          region: region,
          id: id
        }, cb);
      }
    }, {
      key: 'getMasteriesByName',
      value: function getMasteriesByName(name, region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Masteries.get({
          region: region,
          name: name
        }, cb);
      }
    }, {
      key: 'getMatchById',
      value: function getMatchById(id, region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Match.get({
          region: region,
          id: id
        }, cb);
      }
    }, {
      key: 'getMatchlistByAccountId',
      value: function getMatchlistByAccountId(accId, options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Matchlist.get({
          region: region,
          accId: accId
        }, cb);
      }
    }, {
      key: 'getMatchlistById',
      value: function getMatchlistById(id, options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Matchlist.get({
          region: region,
          id: id
        }, cb);
      }
    }, {
      key: 'getMatchlistByName',
      value: function getMatchlistByName(name, options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Matchlist.get({
          name: name, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getRunesByAccountId',
      value: function getRunesByAccountId(accId, region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Runes.get({
          region: region,
          accId: accId
        }, cb);
      }
    }, {
      key: 'getRunesById',
      value: function getRunesById(id, region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Runes.get({
          region: region,
          id: id
        }, cb);
      }
    }, {
      key: 'getRunesByName',
      value: function getRunesByName(name, region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Runes.get({
          region: region,
          name: name
        }, cb);
      }
    }, {
      key: 'getStaticChampionList',
      value: function getStaticChampionList(options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.champions({
          region: region, options: options
        }, cb);
      }
    }, {
      key: 'getStaticChampionById',
      value: function getStaticChampionById(id, options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.champion({
          id: id, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticItemList',
      value: function getStaticItemList(options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.items({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticItemById',
      value: function getStaticItemById(id, options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.item({
          id: id, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticLanguageStringList',
      value: function getStaticLanguageStringList(options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.languageStrings({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticLanguageList',
      value: function getStaticLanguageList(region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Static.languages({
          region: region
        }, cb);
      }
    }, {
      key: 'getStaticMapList',
      value: function getStaticMapList(options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.mapData({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticMasteryList',
      value: function getStaticMasteryList(options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.masteries({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticMasteryById',
      value: function getStaticMasteryById(id, options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.mastery({
          id: id, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticProfileIconList',
      value: function getStaticProfileIconList(options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.profileIcons({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticRealmList',
      value: function getStaticRealmList(region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Static.realm({
          region: region
        }, cb);
      }
    }, {
      key: 'getStaticRuneList',
      value: function getStaticRuneList(options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.runes({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticRuneById',
      value: function getStaticRuneById(id, options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.rune({
          id: id, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticSummonerSpellList',
      value: function getStaticSummonerSpellList(options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.spells({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticSummonerSpellById',
      value: function getStaticSummonerSpellById(id, options, region, cb) {
        if (typeof options == 'function') {
          cb = options;
          options = undefined;
        }

        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        if (typeof options == 'string') {
          region = options;
          options = undefined;
        }

        return this.Static.spell({
          id: id, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticVersionList',
      value: function getStaticVersionList(region, cb) {
        if (typeof region == 'function') {
          cb = region;
          region = undefined;
        }

        return this.Static.versions({
          region: region
        }, cb);
      }
    }, {
      key: 'getSummonerByAccId',
      value: function getSummonerByAccId(accId, region, cb) {
        return this.Summoner.get({
          region: region,
          accId: accId
        }, cb);
      }
    }, {
      key: 'getRunesBySummonerId',
      value: function getRunesBySummonerId(id, region, cb) {
        return this.Runes.get({
          region: region,
          id: id
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
    if (typeof region == 'boolean') {
      debug = region;
      region = undefined;
    }

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