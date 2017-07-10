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

  var _responseStrings;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

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
      this.buffer = this.seconds * 50;
    }

    _createClass(RateLimit, [{
      key: '_reload',
      value: function _reload() {
        var t = new Date().getTime();

        while (this.madeRequests.length > 0 && t - this.madeRequests.peekFront() >= this.buffer) {
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
        this._reload();
        return this.madeRequests.length < this.allowedRequests;
      }
    }]);

    return RateLimit;
  }();

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
    MATCHLIST: cacheTimers.HOUR,
    RUNES_MASTERIES: cacheTimers.WEEK,
    SPECTATOR: cacheTimers.NONE,
    STATS: cacheTimers.HOUR,
    SUMMONER: cacheTimers.DAY,
    TOURNAMENT_STUB: cacheTimers.HOUR,
    TOURNAMENT: cacheTimers.HOUR };

  var limits = {
    DEV: [[10, 10], [500, 600]],

    PROD: [[500, 10], [30000, 600]]
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

  var VERSION = 'version';
  var LOCALE = 'locale';
  var DATA_BY_ID = 'dataById';
  var FREE_TO_PLAY = 'freeToPlay';
  var QUEUE = 'queue';
  var BEGIN_TIME = 'beginTime';
  var END_INDEX = 'endIndex';
  var SEASON = 'season';
  var CHAMPION = 'champion';
  var BEGIN_INDEX = 'beginIndex';
  var END_TIME = 'endTime';
  var CHAMP_LIST_DATA = 'tags';
  var CHAMP_DATA = 'tags';
  var ITEM_LIST_DATA = 'tags';
  var ITEM_DATA = 'tags';
  var MASTERY_LIST_DATA = 'tags';
  var MASTERY_DATA = 'tags';
  var RUNE_LIST_DATA = 'tags';
  var RUNE_DATA = 'tags';
  var SPELL_LIST_DATA = 'tags';
  var SPELL_DATA = 'tags';
  var STATS_SEASON = 'season';
  var VERSION_AND_LOCALE = [VERSION, LOCALE];

  var queryParams = {
    NONE: [],
    CHAMPION: {
      LIST: [FREE_TO_PLAY]
    },
    STATIC: {
      CHAMPION: {
        LIST: [].concat(VERSION_AND_LOCALE, [DATA_BY_ID, CHAMP_LIST_DATA]),
        ONE: [].concat(VERSION_AND_LOCALE, [CHAMP_DATA])
      },
      ITEM: {
        LIST: [].concat(VERSION_AND_LOCALE, [ITEM_LIST_DATA]),
        ONE: [].concat(VERSION_AND_LOCALE, [ITEM_DATA])
      },
      LANGUAGE_STRING: {
        LIST: [].concat(VERSION_AND_LOCALE)
      },
      MAP: {
        LIST: [].concat(VERSION_AND_LOCALE)
      },
      MASTERY: {
        LIST: [].concat(VERSION_AND_LOCALE, [MASTERY_LIST_DATA]),
        ONE: [].concat(VERSION_AND_LOCALE, [MASTERY_DATA])
      },
      PROFILE_ICON: {
        LIST: [].concat(VERSION_AND_LOCALE)
      },
      RUNE: {
        LIST: [].concat(VERSION_AND_LOCALE, [RUNE_LIST_DATA]),
        ONE: [].concat(VERSION_AND_LOCALE, [RUNE_DATA])
      },
      SUMMONER_SPELL: {
        LIST: [].concat(VERSION_AND_LOCALE, [DATA_BY_ID, SPELL_LIST_DATA]),
        ONE: [].concat(VERSION_AND_LOCALE, [SPELL_DATA])
      }
    },
    MATCHLIST: {
      GET: [QUEUE, BEGIN_TIME, END_INDEX, SEASON, CHAMPION, BEGIN_INDEX, END_TIME]
    },
    STATS: {
      RANKED: [STATS_SEASON],
      SUMMARY: [STATS_SEASON]
    }
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

  var queueStrings = {
    RANKED_SOLO_5x5: 'RANKED_SOLO_5x5',
    RANKED_FLEX_SR: 'RANKED_FLEX_SR',
    RANKED_FLEX_TT: 'RANKED_FLEX_TT'
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

  var services = {
    CHAMPION: 'platform',
    CHAMPION_MASTERY: 'champion-mastery',
    GAME: null,
    LEAGUE: 'league',
    STATUS: 'status',
    MASTERIES: 'platform',
    MATCH: 'match',
    MATCHLIST: null,
    RUNES: 'platform',
    RUNES_MASTERIES: 'platform',
    SPECTATOR: 'spectator',
    STATIC_DATA: 'static-data',
    STATS: null,
    SUMMONER: 'summoner',
    TOURNAMENT_STUB: 'tournament-stub',
    TOURNAMENT: 'tournament'
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
    'RUNES_MASTERIES': 3,
    'SPECTATOR': 3,
    'STATS': 1.3,
    'SUMMONER': 3,
    'TOURNAMENT_STUB': 3,
    'TOURNAMENT': 3
  };

  var re = XRegExp('^[0-9\\p{L} _\\.]+$');

  var check = function check(region) {
    return Object.keys(regions).some(function (key) {
      return regions[key] === region;
    });
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

  var check$1 = function check$1(l) {
    return Array.isArray(l) && l.length !== 2 || !checkAll.int(l[0]) || l[0].length !== 2 || !checkAll.int(l[1]) || l[1].length !== 2;
  };

  var isFunction = function isFunction(item) {
    return typeof item === 'function';
  };

  var responseStrings = (_responseStrings = {}, _defineProperty(_responseStrings, 200, 'Success'), _defineProperty(_responseStrings, 400, 'Bad Request'), _defineProperty(_responseStrings, 401, 'Unauthorized'), _defineProperty(_responseStrings, 403, 'Forbidden'), _defineProperty(_responseStrings, 404, 'Data Not Found'), _defineProperty(_responseStrings, 405, 'Method not allowed'), _defineProperty(_responseStrings, 415, 'Unsupported Media Type'), _defineProperty(_responseStrings, 429, 'Rate Limit Exceeded'), _defineProperty(_responseStrings, 500, 'Internal Service Error'), _defineProperty(_responseStrings, 503, 'Service Unavailable'), _defineProperty(_responseStrings, 504, 'Gateway Timeout'), _responseStrings);

  var get = function get(code) {
    return responseStrings[code];
  };

  var getResponseMessage = function getResponseMessage(code) {
    return get(code) || '';
  };

  var statusCodeBisector = [200, 400, 500];

  var prettifyStatusMessage = function prettifyStatusMessage(statusCode) {
    var capsMessage = getResponseMessage(statusCode).toUpperCase();
    var msg = statusCode + ' ' + capsMessage;

    if (statusCode >= statusCodeBisector[0] && statusCode < statusCodeBisector[1]) return chalk$1.green(statusCode);else if (statusCode >= statusCodeBisector[1] && statusCode < statusCodeBisector[2]) return chalk$1.red(msg);else return chalk$1.bold.red(msg);
  };

  var printResponseDebug = function printResponseDebug(response, statusMessage, reqUrl, showHeaders) {
    console.log(statusMessage, '@', reqUrl);

    if (showHeaders) {
      console.log({
        'x-rate-limit-type': response.headers['x-rate-limit-type'],
        'x-app-rate-limit-count': response.headers['x-app-rate-limit-count'],
        'x-method-rate-limit-count': response.headers['x-method-rate-limit-count'],
        'x-rate-limit-count': response.headers['x-rate-limit-count'],
        'retry-after': response.headers['retry-after']
      });
      console.log();
    }
  };

  var codes = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    DATA_NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    UNSUPPORTED_MEDIA_TYPE: 415,
    RATE_LIMIT_EXCEEDED: 429,
    INTERNAL_SERVICE_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
  };

  var ISE = codes.INTERNAL_SERVICE_ERROR;
  var RLE = codes.RATE_LIMIT_EXCEEDED;

  var shouldRetry = function shouldRetry(code) {
    return code >= ISE || code === RLE;
  };

  var validTTL = function validTTL(ttl) {
    return Number.isInteger(ttl) && ttl > 0;
  };

  var ERROR_THRESHOLD = 400;
  var SECOND = 1000;

  var Kindred$1 = function () {
    function Kindred$1() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          key = _ref.key,
          _ref$defaultRegion = _ref.defaultRegion,
          defaultRegion = _ref$defaultRegion === undefined ? regions.NORTH_AMERICA : _ref$defaultRegion,
          _ref$debug = _ref.debug,
          debug = _ref$debug === undefined ? false : _ref$debug,
          _ref$showKey = _ref.showKey,
          showKey = _ref$showKey === undefined ? false : _ref$showKey,
          _ref$showHeaders = _ref.showHeaders,
          showHeaders = _ref$showHeaders === undefined ? false : _ref$showHeaders,
          limits$$1 = _ref.limits,
          spread = _ref.spread,
          _ref$retryOptions = _ref.retryOptions,
          retryOptions = _ref$retryOptions === undefined ? {
        auto: true,
        numberOfRetriesBeforeBreak: Number.MAX_VALUE
      } : _ref$retryOptions,
          timeout = _ref.timeout,
          cache = _ref.cache,
          cacheTTL = _ref.cacheTTL;

      _classCallCheck(this, Kindred$1);

      if (arguments.length === 0 || _typeof(arguments[0]) !== 'object' || typeof key !== 'string') {
        throw new Error('' + chalk.red('API key not passed in!'));
      }

      this.key = key;

      this.defaultRegion = check(defaultRegion) ? defaultRegion : '';

      if (this.defaultRegion.length === 0) {
        throw new Error(chalk.red('setRegion() by Kindred failed: ' + chalk.yellow(defaultRegion) + ' is an invalid region.') + '\n' + ('' + chalk.red('Try importing ' + chalk.yellow('require(\'kindred-api\').REGIONS') + ' and using one of those values instead.')));
      }

      this.debug = debug;
      this.showKey = showKey;
      this.showHeaders = showHeaders;

      if (cache) {
        this.cache = cache;
        this.CACHE_TIMERS = cacheTTL ? cacheTTL : endpointCacheTimers;
      } else {
        this.cache = {
          get: function get(args, cb) {
            return cb(null, null);
          },
          set: function set(args, value) {}
        };
        this.CACHE_TIMERS = this._disableCache(endpointCacheTimers);
      }

      if (limits$$1) {
        if (check$1(limits$$1)) {
          console.log(chalk.red('Initialization of Kindred failed: Invalid ' + chalk.yellow('limits') + '. Valid examples: ' + chalk.yellow('[[10, 10], [500, 600]]')) + '.');
          console.log(chalk.red('You can also pass in one of these two constants:') + ' LIMITS.DEV/LIMITS.PROD');
          console.log('' + chalk.red('and Kindred will set the limits appropriately.'));
          throw new Error();
        }

        this.limits = {};
        this.spread = spread;
        this.retryOptions = retryOptions;
        this.timeout = timeout;

        this.numberOfRetriesBeforeBreak = this.retryOptions.numberOfRetriesBeforeBreak;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(regions)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var region = _step.value;

            this.limits[regions[region]] = [new RateLimit(limits$$1[0][0], limits$$1[0][1]), new RateLimit(limits$$1[1][0], limits$$1[1][1]), this.spread ? new RateLimit(limits$$1[0][0] / 10, 0.5) : null];
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
        },

        Timeline: {
          by: {
            id: this.getMatchTimelineById.bind(this)
          }
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
    }

    _createClass(Kindred$1, [{
      key: 'canMakeRequest',
      value: function canMakeRequest(region) {
        var spread = this.spread ? this.limits[region][2].requestAvailable() : true;

        return this.limits[region][0].requestAvailable() && this.limits[region][1].requestAvailable() && spread;
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
        return re.test(name) && name.length <= 16;
      }
    }, {
      key: '_cacheData',
      value: function _cacheData(key, ttl, body) {
        if (validTTL(ttl)) {
          this.cache.set({ key: key, ttl: ttl }, body);
        }
      }
    }, {
      key: '_makeUrl',
      value: function _makeUrl(query, region) {
        var oldPrefix = 'api/lol/' + region + '/';
        var prefix = 'lol/';
        var base = 'api.riotgames.com';
        var encodedQuery = encodeURI(query);

        var oldUrl = 'https://' + region + '.api.riotgames.com/' + oldPrefix + encodedQuery;
        var newUrl = 'https://' + platformIds[regions$1[region]].toLowerCase() + '.' + base + '/' + prefix + encodedQuery;

        if (newUrl.lastIndexOf('v3') === -1) {
          return oldUrl;
        }

        return newUrl;
      }
    }, {
      key: '_stringifyOptions',
      value: function _stringifyOptions(options, endUrl) {
        var stringifiedOpts = '';

        var appendKey = function appendKey(str, key, value) {
          return str + (str ? '&' : '') + (key + '=' + value);
        };

        if (endUrl.lastIndexOf('v3') === -1) {
          stringifiedOpts = queryString.stringify(options);
        } else {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = Object.keys(options)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var key = _step2.value;

              if (Array.isArray(options[key])) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                  for (var _iterator3 = options[key][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var value = _step3.value;

                    stringifiedOpts = appendKey(stringifiedOpts, key, value);
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
              } else {
                stringifiedOpts = appendKey(stringifiedOpts, key, options[key]);
              }
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

        return stringifiedOpts;
      }
    }, {
      key: '_constructFullUrl',
      value: function _constructFullUrl(reqUrl, key) {
        return reqUrl + this._getAPIKeySuffix(reqUrl, key);
      }
    }, {
      key: '_disableCache',
      value: function _disableCache(timers) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = Object.keys(timers)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var key = _step4.value;

            timers[key] = 0;
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

        return timers;
      }
    }, {
      key: '_verifyOptions',
      value: function _verifyOptions() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var allowed = arguments[1];

        var keys = Object.keys(options);

        if (allowed.length === 0 && keys.length === 0) {
          return;
        }

        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = keys[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var key = _step5.value;

            if (!allowed.includes(key)) {
              throw new Error(chalk.red('Invalid query params! Valid: ' + allowed.toString()));
            }
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
      }
    }, {
      key: '_getAPIKeySuffix',
      value: function _getAPIKeySuffix(url, key) {
        return (url.lastIndexOf('?') === -1 ? '?' : '&') + ('api_key=' + (key ? key : ''));
      }
    }, {
      key: '_baseRequest',
      value: function _baseRequest(_ref2, cb) {
        var _this = this;

        var endUrl = _ref2.endUrl,
            _ref2$region = _ref2.region,
            region = _ref2$region === undefined ? this.defaultRegion : _ref2$region,
            _ref2$staticReq = _ref2.staticReq,
            staticReq = _ref2$staticReq === undefined ? false : _ref2$staticReq,
            _ref2$options = _ref2.options,
            options = _ref2$options === undefined ? {} : _ref2$options,
            _ref2$cacheParams = _ref2.cacheParams,
            cacheParams = _ref2$cacheParams === undefined ? {} : _ref2$cacheParams;

        var tryRequest = function tryRequest(iterations) {
          return new Promise(function (resolve, reject) {
            var stringifiedOpts = _this._stringifyOptions(options, endUrl);
            var postfix = stringifiedOpts ? '?' + stringifiedOpts : '';
            var reqUrl = _this._makeUrl(endUrl + postfix, region);
            var displayUrl = reqUrl + _this._getAPIKeySuffix(reqUrl);
            var fullUrl = _this._constructFullUrl(reqUrl, _this.key);

            _this.cache.get({ key: reqUrl }, function (err, data) {
              if (data) {
                if (_this.debug) {
                  var url = _this.showKey ? fullUrl : reqUrl;
                  console.log(chalk.green('CACHE HIT') + ' @ ' + url);
                }

                var json = JSON.parse(data);
                if (cb) return cb(err, json);else return resolve(json);
              } else {
                if (_this.limits) {
                  var self = _this;(function sendRequest(callback, iterationsUntilError) {
                    if (self.canMakeRequest(region)) {
                      if (!staticReq) {
                        self.limits[region][0].addRequest();
                        self.limits[region][1].addRequest();
                        if (self.spread) self.limits[region][2].addRequest();
                      }

                      request({ url: fullUrl, timeout: self.timeout }, function (error, response, body) {
                        if (response && body) {
                          var statusCode = response.statusCode;

                          var responseMessage = prettifyStatusMessage(statusCode);
                          var retry = response.headers['retry-after'] * SECOND || SECOND;

                          var key = reqUrl;
                          var ttl = cacheParams.ttl;


                          if (self.debug) {
                            var _url = self.showKey ? fullUrl : displayUrl;
                            printResponseDebug(response, responseMessage, chalk.yellow(_url), self.showHeaders);
                          }

                          if (isFunction(callback)) {
                            if (shouldRetry(statusCode)) {
                              if (--iterationsUntilError === 0) return callback(statusCode);
                              if (!self.retryOptions.auto) return callback(statusCode);
                              if (self.debug) console.log('Resending callback request.\n');
                              return setTimeout(function () {
                                return sendRequest.bind(self)(callback, iterationsUntilError);
                              }, retry);
                            } else if (statusCode >= ERROR_THRESHOLD) {
                              return callback(statusCode);
                            } else {
                              self._cacheData(key, ttl, body);
                              return callback(error, JSON.parse(body));
                            }
                          } else {
                            if (shouldRetry(statusCode)) {
                              if (--iterationsUntilError === 0) return reject(statusCode);
                              if (!self.retryOptions.auto) return reject(statusCode);
                              if (self.debug) console.log('Resending promise request.\n');
                              return setTimeout(function () {
                                return resolve(tryRequest(iterationsUntilError));
                              }, retry);
                            } else if (statusCode >= ERROR_THRESHOLD) {
                              return reject(statusCode);
                            } else {
                              self._cacheData(key, ttl, body);
                              return resolve(JSON.parse(body));
                            }
                          }
                        } else {
                          console.log(error, reqUrl);
                        }
                      });
                    } else {
                      var buffer = SECOND / 4.5;
                      return setTimeout(function () {
                        return sendRequest.bind(self)(callback);
                      }, buffer);
                    }
                  })(cb, iterations);
                } else {
                  request({ url: fullUrl }, function (error, response, body) {
                    if (response) {
                      var self = _this;

                      var statusCode = response.statusCode;

                      var statusMessage = prettifyStatusMessage(statusCode);

                      if (self.debug) {
                        var _url2 = self.showKey ? fullUrl : displayUrl;
                        printResponseDebug(response, statusMessage, chalk.yellow(_url2), self.showHeaders);
                      }

                      if (isFunction(cb)) {
                        if (statusCode >= ERROR_THRESHOLD) return cb(statusCode);else return cb(error, JSON.parse(body));
                      } else {
                        if (statusCode >= ERROR_THRESHOLD) return reject(statusCode);else return resolve(JSON.parse(body));
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

        return tryRequest(this.numberOfRetriesBeforeBreak);
      }
    }, {
      key: '_championMasteryRequest',
      value: function _championMasteryRequest(_ref3, cb) {
        var endUrl = _ref3.endUrl,
            region = _ref3.region,
            options = _ref3.options;

        return this._baseRequest({
          endUrl: services.CHAMPION_MASTERY + '/v' + versions.CHAMPION + '/' + endUrl, region: region, options: options,
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
            region = _ref6.region,
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
          region: region,
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
            options = _ref10.options,
            _ref10$cacheParams = _ref10.cacheParams,
            cacheParams = _ref10$cacheParams === undefined ? { ttl: this.CACHE_TIMERS.MATCH } : _ref10$cacheParams;

        return this._baseRequest({
          endUrl: services.MATCH + '/v' + versions.MATCH + '/' + endUrl, region: region, options: options,
          cacheParams: cacheParams
        }, cb);
      }
    }, {
      key: '_matchlistRequest',
      value: function _matchlistRequest(_ref11, cb) {
        var endUrl = _ref11.endUrl,
            region = _ref11.region,
            options = _ref11.options;

        return this._matchRequest({
          endUrl: 'matchlists/' + endUrl, region: region, options: options,
          cacheParams: {
            ttl: this.CACHE_TIMERS.MATCHLIST
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
        throw new Error(chalk.bold.yellow(message) + ' ' + chalk.red('request') + ' ' + chalk.bold.red('FAILED') + chalk.red('; ' + expected));
      }
    }, {
      key: 'setRegion',
      value: function setRegion(region) {
        this.defaultRegion = check(region) ? region : '';

        if (this.defaultRegion.length === 0) throw new Error(chalk.red('setRegion() by Kindred failed: ' + chalk.yellow(region) + ' is an invalid region.') + '\n' + ('' + chalk.red('Try importing ' + chalk.yellow('require(\'kindred-api\').REGIONS') + ' and using one of those values instead.')));
      }
    }, {
      key: 'getChamps',
      value: function getChamps() {
        var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref15.region,
            options = _ref15.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.CHAMPION.LIST);

        if (isFunction(arguments[0])) {
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
        var _ref16 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref16.region,
            id = _ref16.id,
            championId = _ref16.championId;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(id) || Number.isInteger(championId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (championId) {
            endUrl = championId.toString();
          }
          return this._championRequest({
            endUrl: 'champions/' + endUrl,
            region: region
          }, cb);
        } else {
          return this._logError(this.getChamp.name, 'required params ' + chalk.yellow('`id/championId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getChampMastery',
      value: function getChampMastery() {
        var _ref17 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref17.region,
            playerId = _ref17.playerId,
            championId = _ref17.championId;

        var cb = arguments[1];

        if (playerId && championId && Number.isInteger(playerId) && Number.isInteger(championId)) {
          return this._championMasteryRequest({
            endUrl: 'champion-masteries/by-summoner/' + playerId + '/by-champion/' + championId, region: region
          }, cb);
        } else {
          return this._logError(this.getChampMastery.name, 'required params ' + chalk.yellow('`playerId` (int) AND `championId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getChampMasteries',
      value: function getChampMasteries() {
        var _this2 = this;

        var _ref18 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref18.region,
            accountId = _ref18.accountId,
            accId = _ref18.accId,
            id = _ref18.id,
            summonerId = _ref18.summonerId,
            playerId = _ref18.playerId,
            name = _ref18.name;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(accountId || accId)) {
          var tempNum = void 0;
          if (accountId) {
            tempNum = accountId;
          }
          if (accId) {
            tempNum = accId;
          }
          return new Promise(function (resolve, reject) {
            return _this2.getSummoner({ accId: tempNum, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this2._championMasteryRequest({
                  endUrl: 'champion-masteries/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (summonerId) {
            endUrl = summonerId.toString();
          }
          if (playerId) {
            endUrl = playerId.toString();
          }
          return this._championMasteryRequest({
            endUrl: 'champion-masteries/by-summoner/' + endUrl, region: region
          }, cb);
        } else if (typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this2.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this2._championMasteryRequest({
                  endUrl: 'champion-masteries/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
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

        var _ref19 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref19.region,
            accountId = _ref19.accountId,
            accId = _ref19.accId,
            id = _ref19.id,
            summonerId = _ref19.summonerId,
            playerId = _ref19.playerId,
            name = _ref19.name;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(accountId || accId)) {
          var tempNum = void 0;
          if (accountId) {
            tempNum = accountId;
          }
          if (accId) {
            tempNum = accId;
          }
          return new Promise(function (resolve, reject) {
            return _this3.getSummoner({ accId: tempNum, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this3._championMasteryRequest({
                  endUrl: 'scores/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (summonerId) {
            endUrl = summonerId.toString();
          }
          if (playerId) {
            endUrl = playerId.toString();
          }
          return this._championMasteryRequest({
            endUrl: 'scores/by-summoner/' + endUrl, region: region
          }, cb);
        } else if (typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this3.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this3._championMasteryRequest({
                  endUrl: 'scores/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
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

        var _ref20 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref20.region,
            accountId = _ref20.accountId,
            accId = _ref20.accId,
            id = _ref20.id,
            summonerId = _ref20.summonerId,
            playerId = _ref20.playerId,
            name = _ref20.name;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this4.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this4._spectatorRequest({
                  endUrl: 'active-games/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (summonerId) {
            endUrl = summonerId.toString();
          }
          if (playerId) {
            endUrl = playerId.toString();
          }
          return this._spectatorRequest({
            endUrl: 'active-games/by-summoner/' + endUrl,
            region: region
          }, cb);
        } else if (typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this4.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this4._spectatorRequest({
                  endUrl: 'active-games/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
            });
          });
        } else {
          return this._logError(this.getCurrentGame.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getFeaturedGames',
      value: function getFeaturedGames() {
        var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref21.region;

        var cb = arguments[1];

        if (isFunction(arguments[0])) {
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

        var _ref22 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref22.region,
            accountId = _ref22.accountId,
            accId = _ref22.accId,
            id = _ref22.id,
            summonerId = _ref22.summonerId,
            playerId = _ref22.playerId,
            name = _ref22.name;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this5.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this5._gameRequest({
                  endUrl: 'by-summoner/' + data.id + '/recent', region: region
                }, cb));
              }
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (summonerId) {
            endUrl = summonerId.toString();
          }
          if (playerId) {
            endUrl = playerId.toString();
          }
          return this._gameRequest({
            endUrl: 'by-summoner/' + endUrl + '/recent',
            region: region
          }, cb);
        } else if (typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this5.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this5._gameRequest({
                  endUrl: 'by-summoner/' + data.id + '/recent', region: region
                }, cb));
              }
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

        var _ref23 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref23.region,
            accountId = _ref23.accountId,
            accId = _ref23.accId,
            id = _ref23.id,
            summonerId = _ref23.summonerId,
            playerId = _ref23.playerId,
            name = _ref23.name;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(accountId || accId)) {
          var tempNum = void 0;
          if (accountId) {
            tempNum = accountId;
          }
          if (accId) {
            tempNum = accId;
          }
          return new Promise(function (resolve, reject) {
            return _this6.getSummoner({ accId: tempNum, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this6._leagueRequest({
                  endUrl: 'leagues/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (summonerId) {
            endUrl = summonerId.toString();
          }
          if (playerId) {
            endUrl = playerId.toString();
          }
          return this._leagueRequest({
            endUrl: 'leagues/by-summoner/' + endUrl,
            region: region
          }, cb);
        } else if (typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this6.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this6._leagueRequest({
                  endUrl: 'leagues/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
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

        var _ref24 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref24.region,
            accountId = _ref24.accountId,
            accId = _ref24.accId,
            id = _ref24.id,
            summonerId = _ref24.summonerId,
            playerId = _ref24.playerId,
            name = _ref24.name;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(accountId || accId)) {
          var tempNum = void 0;
          if (accountId) {
            tempNum = accountId;
          }
          if (accId) {
            tempNum = accId;
          }
          return new Promise(function (resolve, reject) {
            return _this7.getSummoner({ accId: tempNum, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this7._leagueRequest({
                  endUrl: 'positions/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (summonerId) {
            endUrl = summonerId.toString();
          }
          if (playerId) {
            endUrl = playerId.toString();
          }
          return this._leagueRequest({
            endUrl: 'positions/by-summoner/' + endUrl,
            region: region
          }, cb);
        } else if (typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this7.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this7._leagueRequest({
                  endUrl: 'positions/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
            });
          });
        } else {
          this._logError(this.getLeaguePositions.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getChallengers',
      value: function getChallengers() {
        var _ref25 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref25.region,
            _ref25$queue = _ref25.queue,
            queue = _ref25$queue === undefined ? 'RANKED_SOLO_5x5' : _ref25$queue;

        var cb = arguments[1];

        cb = isFunction(arguments[0]) ? arguments[0] : arguments[1];

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
        var _ref26 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref26.region,
            _ref26$queue = _ref26.queue,
            queue = _ref26$queue === undefined ? 'RANKED_SOLO_5x5' : _ref26$queue;

        var cb = arguments[1];

        cb = isFunction(arguments[0]) ? arguments[0] : arguments[1];

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
        var _ref27 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref27.region,
            options = _ref27.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.CHAMPION.LIST);

        if (isFunction(arguments[0])) {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'champions', region: region, options: options }, cb);
      }
    }, {
      key: 'getChampion',
      value: function getChampion() {
        var _ref28 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref28.region,
            id = _ref28.id,
            championId = _ref28.championId,
            options = _ref28.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.CHAMPION.ONE);
        var endUrl = '';
        if (Number.isInteger(id || championId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (championId) {
            endUrl = championId.toString();
          }
          return this._staticRequest({ endUrl: 'champions/' + endUrl, region: region, options: options }, cb);
        } else {
          return this._logError(this.getChampion.name, 'required params ' + chalk.yellow('`id/championId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getItems',
      value: function getItems() {
        var _ref29 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref29.region,
            options = _ref29.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.ITEM.LIST);

        if (isFunction(arguments[0])) {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'items', region: region, options: options }, cb);
      }
    }, {
      key: 'getItem',
      value: function getItem() {
        var _ref30 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref30.region,
            id = _ref30.id,
            itemId = _ref30.itemId,
            options = _ref30.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.ITEM.ONE);
        var endUrl = '';
        if (Number.isInteger(id || itemId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (itemId) {
            endUrl = itemId.toString();
          }
          return this._staticRequest({ endUrl: 'items/' + endUrl, region: region, options: options }, cb);
        } else {
          return this._logError(this.getItem.name, 'required params ' + chalk.yellow('`id/itemId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getLanguageStrings',
      value: function getLanguageStrings() {
        var _ref31 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref31.region,
            options = _ref31.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.LANGUAGE_STRING.LIST);

        if (isFunction(arguments[0])) {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'language-strings', region: region, options: options }, cb);
      }
    }, {
      key: 'getLanguages',
      value: function getLanguages() {
        var _ref32 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref32.region;

        var cb = arguments[1];

        if (isFunction(arguments[0])) {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'languages', region: region }, cb);
      }
    }, {
      key: 'getMapData',
      value: function getMapData() {
        var _ref33 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref33.region,
            options = _ref33.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.MAP.LIST);

        if (isFunction(arguments[0])) {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'maps', region: region, options: options }, cb);
      }
    }, {
      key: 'getMasteryList',
      value: function getMasteryList() {
        var _ref34 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref34.region,
            options = _ref34.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.MASTERY.LIST);

        if (isFunction(arguments[0])) {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'masteries', region: region, options: options }, cb);
      }
    }, {
      key: 'getMastery',
      value: function getMastery() {
        var _ref35 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref35.region,
            id = _ref35.id,
            masteryId = _ref35.masteryId,
            options = _ref35.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.MASTERY.ONE);
        var endUrl = '';
        if (Number.isInteger(id || masteryId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (masteryId) {
            endUrl = masteryId.toString();
          }
          return this._staticRequest({
            endUrl: 'masteries/' + endUrl,
            region: region, options: options
          }, cb);
        } else {
          return this._logError(this.getMastery.name, 'required params ' + chalk.yellow('`id/masteryId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getProfileIcons',
      value: function getProfileIcons() {
        var _ref36 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref36.region,
            options = _ref36.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.PROFILE_ICON.LIST);

        if (isFunction(arguments[0])) {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'profile-icons', region: region, options: options }, cb);
      }
    }, {
      key: 'getRealmData',
      value: function getRealmData() {
        var _ref37 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref37.region;

        var cb = arguments[1];

        if (isFunction(arguments[0])) {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'realms', region: region }, cb);
      }
    }, {
      key: 'getRuneList',
      value: function getRuneList() {
        var _ref38 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref38.region,
            options = _ref38.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.RUNE.LIST);

        if (isFunction(arguments[0])) {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'runes', region: region, options: options }, cb);
      }
    }, {
      key: 'getRune',
      value: function getRune() {
        var _ref39 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref39.region,
            id = _ref39.id,
            runeId = _ref39.runeId,
            options = _ref39.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.RUNE.ONE);
        var endUrl = '';
        if (Number.isInteger(id || runeId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (runeId) {
            endUrl = runeId.toString();
          }
          return this._staticRequest({ endUrl: 'runes/' + endUrl, region: region, options: options }, cb);
        } else {
          return this._logError(this.getRune.name, 'required params ' + chalk.yellow('`id/runeId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummonerSpells',
      value: function getSummonerSpells() {
        var _ref40 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref40.region,
            options = _ref40.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.SUMMONER_SPELL.LIST);

        if (isFunction(arguments[0])) {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'summoner-spells', region: region, options: options }, cb);
      }
    }, {
      key: 'getSummonerSpell',
      value: function getSummonerSpell() {
        var _ref41 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref41.region,
            id = _ref41.id,
            spellId = _ref41.spellId,
            summonerSpellId = _ref41.summonerSpellId,
            options = _ref41.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATIC.SUMMONER_SPELL.ONE);
        var endUrl = '';
        if (Number.isInteger(id || spellId || summonerSpellId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (spellId) {
            endUrl = spellId.toString();
          }
          if (summonerSpellId) {
            endUrl = summonerSpellId.toString();
          }
          return this._staticRequest({
            endUrl: 'summoner-spells/' + endUrl,
            region: region, options: options
          }, cb);
        } else {
          return this._logError(this.getSummonerSpell.name, 'required params ' + chalk.yellow('`id/spellId/summonerSpellId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getVersionData',
      value: function getVersionData() {
        var _ref42 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref42.region,
            options = _ref42.options;

        var cb = arguments[1];

        if (isFunction(arguments[0])) {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        return this._staticRequest({ endUrl: 'versions', region: region, options: options }, cb);
      }
    }, {
      key: 'getShardStatus',
      value: function getShardStatus() {
        var _ref43 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref43.region;

        var cb = arguments[1];

        if (isFunction(arguments[0])) {
          cb = arguments[0];
          arguments[0] = undefined;
        }

        if (typeof region === 'string' && !check(region)) {
          return this._logError(this.getShardStatus.name, 'invalid region!');
        }

        return this._statusRequest({ endUrl: 'shard-data', region: region }, cb);
      }
    }, {
      key: 'getMatch',
      value: function getMatch() {
        var _ref44 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref44.region,
            id = _ref44.id,
            matchId = _ref44.matchId;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(id || matchId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (matchId) {
            endUrl = matchId.toString();
          }
          return this._matchRequest({ endUrl: 'matches/' + endUrl, region: region }, cb);
        } else {
          return this._logError(this.getMatch.name, 'required params ' + chalk.yellow('`id/matchId` (int)') + ' not passed in');
        }
      }
    }, {
      key: 'getMatchlist',
      value: function getMatchlist() {
        var _this8 = this;

        var _ref45 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref45.region,
            accountId = _ref45.accountId,
            accId = _ref45.accId,
            id = _ref45.id,
            summonerId = _ref45.summonerId,
            playerId = _ref45.playerId,
            name = _ref45.name,
            options = _ref45.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.MATCHLIST.GET);
        var endUrl = '';
        if (Number.isInteger(accountId || accId)) {
          if (accountId) {
            endUrl = accountId.toString();
          }
          if (accId) {
            endUrl = accId.toString();
          }
          return this._matchlistRequest({
            endUrl: 'by-account/' + endUrl,
            region: region, options: options
          }, cb);
        } else if (Number.isInteger(id || summonerId || playerId)) {
          return new Promise(function (resolve, reject) {
            return _this8.getSummoner({ id: id, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.accountId) {
                return resolve(_this8._matchlistRequest({
                  endUrl: 'by-account/' + data.accountId,
                  region: region, options: options
                }, cb));
              }
            });
          });
        } else if (typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this8.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.accountId) {
                return resolve(_this8._matchlistRequest({
                  endUrl: 'by-account/' + data.accountId,
                  region: region, options: options
                }, cb));
              }
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

        var _ref46 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref46.region,
            accountId = _ref46.accountId,
            accId = _ref46.accId,
            id = _ref46.id,
            summonerId = _ref46.summonerId,
            playerId = _ref46.playerId,
            name = _ref46.name;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(accountId || accId)) {
          if (accountId) {
            endUrl = accountId.toString();
          }
          if (accId) {
            endUrl = accId.toString();
          }
          return this._matchlistRequest({
            endUrl: 'by-account/' + endUrl + '/recent',
            region: region
          }, cb);
        } else if (Number.isInteger(id || summonerId || playerId)) {
          return new Promise(function (resolve, reject) {
            return _this9.getSummoner({ id: id, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.accountId) {
                return resolve(_this9._matchlistRequest({
                  endUrl: 'by-account/' + data.accountId + '/recent',
                  region: region
                }, cb));
              }
            });
          });
        } else if (typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this9.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.accountId) {
                return resolve(_this9._matchlistRequest({
                  endUrl: 'by-account/' + data.accountId + '/recent',
                  region: region
                }, cb));
              }
            });
          });
        } else {
          return this._logError(this.getRecentMatchlist.name, 'required params ' + chalk.yellow('`accountId/accId` (int)') + ', ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', or ' + chalk.yellow('`name` (str)') + ' not passed in');
        }
      }
    }, {
      key: 'getMatchTimeline',
      value: function getMatchTimeline() {
        var _ref47 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref47.region,
            id = _ref47.id,
            matchId = _ref47.matchId;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(id || matchId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (matchId) {
            endUrl = matchId.toString();
          }
          return this._matchRequest({
            endUrl: 'timelines/by-match/' + endUrl,
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

        var _ref48 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref48.region,
            accountId = _ref48.accountId,
            accId = _ref48.accId,
            id = _ref48.id,
            summonerId = _ref48.summonerId,
            playerId = _ref48.playerId,
            name = _ref48.name;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this10.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this10._runesMasteriesRequest({
                  endUrl: 'runes/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (summonerId) {
            endUrl = summonerId.toString();
          }
          if (playerId) {
            endUrl = playerId.toString();
          }
          return this._runesMasteriesRequest({
            endUrl: 'runes/by-summoner/' + endUrl,
            region: region
          }, cb);
        } else if (typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this10.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this10._runesMasteriesRequest({
                  endUrl: 'runes/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
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

        var _ref49 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref49.region,
            accountId = _ref49.accountId,
            accId = _ref49.accId,
            id = _ref49.id,
            summonerId = _ref49.summonerId,
            playerId = _ref49.playerId,
            name = _ref49.name;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this11.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this11._runesMasteriesRequest({
                  endUrl: 'masteries/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (summonerId) {
            endUrl = summonerId.toString();
          }
          if (playerId) {
            endUrl = playerId.toString();
          }
          return this._runesMasteriesRequest({
            endUrl: 'masteries/by-summoner/' + endUrl,
            region: region
          }, cb);
        } else if (typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this11.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this11._runesMasteriesRequest({
                  endUrl: 'masteries/by-summoner/' + data.id,
                  region: region
                }, cb));
              }
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

        var _ref50 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref50.region,
            accountId = _ref50.accountId,
            accId = _ref50.accId,
            id = _ref50.id,
            summonerId = _ref50.summonerId,
            playerId = _ref50.playerId,
            name = _ref50.name,
            options = _ref50.options;

        var cb = arguments[1];

        this._verifyOptions(options, queryParams.STATS.RANKED);
        var endUrl = '';
        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this12.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this12._statsRequest({
                  endUrl: data.id + '/ranked',
                  region: region, options: options
                }, cb));
              }
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          var _endUrl = '';
          if (id) {
            _endUrl = id.toString();
          }
          if (summonerId) {
            _endUrl = summonerId.toString();
          }
          if (playerId) {
            _endUrl = playerId.toString();
          }
          return this._statsRequest({
            endUrl: _endUrl + '/ranked',
            region: region, options: options
          }, cb);
        } else if (typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this12.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this12._statsRequest({
                  endUrl: data.id + '/ranked',
                  region: region, options: options
                }, cb));
              }
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

        this._verifyOptions(options, queryParams.STATS.SUMMARY);
        var endUrl = '';
        if (Number.isInteger(accountId || accId)) {
          return new Promise(function (resolve, reject) {
            return _this13.getSummoner({ accId: accountId || accId, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this13._statsRequest({
                  endUrl: data.id + '/summary',
                  region: region, options: options
                }, cb));
              }
            });
          });
        } else if (Number.isInteger(id || summonerId || playerId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (summonerId) {
            endUrl = summonerId.toString();
          }
          if (playerId) {
            endUrl = playerId.toString();
          }
          return this._statsRequest({
            endUrl: endUrl + '/summary',
            region: region, options: options
          }, cb);
        } else if (typeof name === 'string') {
          return new Promise(function (resolve, reject) {
            return _this13.getSummoner({ name: name, region: region }, function (err, data) {
              if (err) {
                cb ? cb(err) : reject(err);return;
              }
              if (data && data.id) {
                return resolve(_this13._statsRequest({
                  endUrl: data.id + '/summary',
                  region: region, options: options
                }, cb));
              }
            });
          });
        } else {
          this._logError(this.getStatsSummary.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'getSummoner',
      value: function getSummoner() {
        var _ref52 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref52.region,
            id = _ref52.id,
            summonerId = _ref52.summonerId,
            playerId = _ref52.playerId,
            accountId = _ref52.accountId,
            accId = _ref52.accId,
            name = _ref52.name;

        var cb = arguments[1];

        var endUrl = '';
        if (Number.isInteger(id || summonerId || playerId)) {
          if (id) {
            endUrl = id.toString();
          }
          if (summonerId) {
            endUrl = summonerId.toString();
          }
          if (playerId) {
            endUrl = playerId.toString();
          }
          return this._summonerRequest({
            endUrl: endUrl,
            region: region
          }, cb);
        } else if (name && typeof name === 'string') {
          return this._summonerRequest({
            endUrl: 'by-name/' + this._sanitizeName(name),
            region: region
          }, cb);
        } else if (Number.isInteger(accountId || accId)) {
          if (accountId) {
            endUrl = accountId.toString();
          }
          if (accId) {
            endUrl = accId.toString();
          }
          return this._summonerRequest({
            endUrl: 'by-account/' + endUrl,
            region: region
          }, cb);
        } else {
          return this._logError(this.getSummoner.name, 'required params ' + chalk.yellow('`id/summonerId/playerId` (int)') + ', ' + chalk.yellow('`accountId/accId` (int)') + ', or ' + chalk.yellow('`name` (string)') + ' not passed in');
        }
      }
    }, {
      key: 'listChampions',
      value: function listChampions(options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Champion.all({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getChampionById',
      value: function getChampionById(id, region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Champion.get({
          id: id, region: region
        }, cb);
      }
    }, {
      key: 'listFeaturedGames',
      value: function listFeaturedGames(region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.FeaturedGames.get({
          region: region
        }, cb);
      }
    }, {
      key: 'listChallengers',
      value: function listChallengers(queue, region, cb) {
        if (check(queue)) {
          if (isFunction(region)) {
            cb = region;
            region = undefined_;
          }

          region = queue;
          queue = undefined_;
        }

        if (isFunction(queue)) {
          cb = queue;
          queue = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.League.challengers({
          queue: queue, region: region
        }, cb);
      }
    }, {
      key: 'listMasters',
      value: function listMasters(queue, region, cb) {
        if (check(queue)) {
          if (isFunction(region)) {
            cb = region;
            region = undefined_;
          }

          region = queue;
          queue = undefined_;
        }

        if (isFunction(queue)) {
          cb = queue;
          queue = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.League.masters({
          queue: queue, region: region
        }, cb);
      }
    }, {
      key: 'getSummonerByAccountId',
      value: function getSummonerByAccountId(accId, region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Summoner.get({
          region: region,
          accId: accId
        }, cb);
      }
    }, {
      key: 'getSummonerById',
      value: function getSummonerById(id, region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Summoner.get({
          region: region,
          id: id
        }, cb);
      }
    }, {
      key: 'getSummonerByName',
      value: function getSummonerByName(name, region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Summoner.get({
          region: region,
          name: name
        }, cb);
      }
    }, {
      key: 'getMasteriesByAccountId',
      value: function getMasteriesByAccountId(accId, region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Masteries.get({
          region: region,
          accId: accId
        }, cb);
      }
    }, {
      key: 'getMasteriesById',
      value: function getMasteriesById(id, region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Masteries.get({
          region: region,
          id: id
        }, cb);
      }
    }, {
      key: 'getMasteriesByName',
      value: function getMasteriesByName(name, region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Masteries.get({
          region: region,
          name: name
        }, cb);
      }
    }, {
      key: 'getMatchById',
      value: function getMatchById(id, region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Match.get({
          region: region,
          id: id
        }, cb);
      }
    }, {
      key: 'getMatchlistByAccountId',
      value: function getMatchlistByAccountId(accId, options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Matchlist.get({
          accId: accId, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getMatchlistById',
      value: function getMatchlistById(id, options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Matchlist.get({
          id: id, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getMatchlistByName',
      value: function getMatchlistByName(name, options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Matchlist.get({
          name: name, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getMatchTimelineById',
      value: function getMatchTimelineById(id, region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Match.timeline({
          id: id, region: region
        }, cb);
      }
    }, {
      key: 'getRunesByAccountId',
      value: function getRunesByAccountId(accId, region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Runes.get({
          region: region,
          accId: accId
        }, cb);
      }
    }, {
      key: 'getRunesById',
      value: function getRunesById(id, region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Runes.get({
          region: region,
          id: id
        }, cb);
      }
    }, {
      key: 'getRunesByName',
      value: function getRunesByName(name, region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Runes.get({
          region: region,
          name: name
        }, cb);
      }
    }, {
      key: 'getStaticChampionList',
      value: function getStaticChampionList(options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.champions({
          region: region, options: options
        }, cb);
      }
    }, {
      key: 'getStaticChampionById',
      value: function getStaticChampionById(id, options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.champion({
          id: id, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticItemList',
      value: function getStaticItemList(options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.items({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticItemById',
      value: function getStaticItemById(id, options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.item({
          id: id, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticLanguageStringList',
      value: function getStaticLanguageStringList(options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.languageStrings({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticLanguageList',
      value: function getStaticLanguageList(region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Static.languages({
          region: region
        }, cb);
      }
    }, {
      key: 'getStaticMapList',
      value: function getStaticMapList(options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.mapData({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticMasteryList',
      value: function getStaticMasteryList(options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.masteries({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticMasteryById',
      value: function getStaticMasteryById(id, options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.mastery({
          id: id, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticProfileIconList',
      value: function getStaticProfileIconList(options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.profileIcons({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticRealmList',
      value: function getStaticRealmList(region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Static.realm({
          region: region
        }, cb);
      }
    }, {
      key: 'getStaticRuneList',
      value: function getStaticRuneList(options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.runes({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticRuneById',
      value: function getStaticRuneById(id, options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.rune({
          id: id, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticSummonerSpellList',
      value: function getStaticSummonerSpellList(options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.spells({
          options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticSummonerSpellById',
      value: function getStaticSummonerSpellById(id, options, region, cb) {
        if (isFunction(options)) {
          cb = options;
          options = undefined_;
        }

        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        if (typeof options === 'string') {
          region = options;
          options = undefined_;
        }

        return this.Static.spell({
          id: id, options: options, region: region
        }, cb);
      }
    }, {
      key: 'getStaticVersionList',
      value: function getStaticVersionList(region, cb) {
        if (isFunction(region)) {
          cb = region;
          region = undefined_;
        }

        return this.Static.versions({
          region: region
        }, cb);
      }
    }]);

    return Kindred$1;
  }();

  function QuickStart(apiKey, region, debug) {
    if (typeof region == 'boolean') {
      debug = region;
      region = undefined_;
    }

    return new Kindred$1({
      key: apiKey,
      defaultRegion: region,
      debug: debug,
      limits: limits.DEV,
      cache: new InMemoryCache()
    });
  }

  function print(err, data) {
    if (err) console.log(err);else console.log(data);
  }

  var undefined_ = undefined;

  var Kindred$2 = {
    Kindred: Kindred$1,
    LIMITS: limits,
    QUEUE_STRINGS: queueStrings,
    QUEUE_TYPES: queueTypes,
    REGIONS: regions,
    TIME_CONSTANTS: cacheTimers,
    QuickStart: QuickStart,
    print: print,

    InMemoryCache: InMemoryCache,
    RedisCache: RedisCache
  };

  module.exports = Kindred$2;
});