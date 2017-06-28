const request = require('request')
const chalk = require('chalk')
const queryString = require('query-string')

import IMC from './cache/in-memory-cache'
import RC from './cache/redis-cache'

import RateLimit from './rate-limit'

import CACHE_TIMERS from './cache/constants/endpoint-cache-timers'
import LIMITS from './constants/limits'
import PLATFORM_IDS from './constants/platform-ids'
import QUERY_PARAMS from './constants/query-params'
import QUEUE_TYPES from './constants/queue-types'
import QUEUE_STRINGS from './constants/queue-strings'
import REGIONS from './constants/regions'
import REGIONS_BACK from './constants/regions-back'
import SERVICES from './constants/services'
import TIME_CONSTANTS from './cache/constants/cache-timers'
import VERSIONS from './constants/versions'

import re from './constants/valid-summoner-name-regex'

import checkValidRegion from './helpers/check-valid-region'
import invalidLimits from './helpers/limits-checker'
import isFunction from './helpers/is-function'
import prettifyStatusMessage from './helpers/prettify-status-message'
import printResponseDebug from './helpers/print-response-debug'
import shouldRetry from './helpers/should-retry'
import validTTL from './helpers/valid-ttl'

const ERROR_THRESHOLD = 400 // res code >= 400 = error
const SECOND = 1000

class Kindred {
  constructor({
    key, defaultRegion = REGIONS.NORTH_AMERICA,
    debug = false, showKey = false, showHeaders = false,
    limits, spread,
    retryOptions = {
      auto: true,
      numberOfRetriesBeforeBreak: Number.MAX_VALUE
    },
    timeout,
    cache, cacheTTL
  } = {}) {
    if (arguments.length === 0 || typeof arguments[0] !== 'object' || typeof key !== 'string') {
      throw new Error(
        `${chalk.red('API key not passed in!')}`
      )
    }

    this.key = key

    this.defaultRegion = checkValidRegion(defaultRegion) ? defaultRegion : undefined

    if (!this.defaultRegion) {
      throw new Error(
        `${chalk.red(`setRegion() by Kindred failed: ${chalk.yellow(defaultRegion)} is an invalid region.`)}\n`
        + `${(chalk.red(`Try importing ${chalk.yellow('require(\'kindred-api\').REGIONS')} and using one of those values instead.`))}`
      )
    }

    this.debug = debug
    this.showKey = showKey
    this.showHeaders = showHeaders

    if (cache) {
      this.cache = cache
      this.CACHE_TIMERS = cacheTTL ? cacheTTL : CACHE_TIMERS
    } else {
      this.cache = {
        get: (args, cb) => cb(null, null),
        set: (args, value) => { }
      }
      this.CACHE_TIMERS = this._disableCache(CACHE_TIMERS)
    }

    if (limits) {
      if (invalidLimits(limits)) {
        console.log(`${chalk.red(`Initialization of Kindred failed: Invalid ${chalk.yellow('limits')}. Valid examples: ${chalk.yellow('[[10, 10], [500, 600]]')}`)}.`)
        console.log(`${(chalk.red('You can also pass in one of these two constants:'))} LIMITS.DEV/LIMITS.PROD`)
        console.log(`${(chalk.red('and Kindred will set the limits appropriately.'))}`)
        throw new Error()
      }

      this.limits = {}
      this.spread = spread
      this.retryOptions = retryOptions
      this.timeout = timeout

      // hack because retryOptions becomes undefined when returning
      // for some reason
      this.numberOfRetriesBeforeBreak = this.retryOptions.numberOfRetriesBeforeBreak

      for (const region of Object.keys(REGIONS)) {
        this.limits[REGIONS[region]] = [
          new RateLimit(limits[0][0], limits[0][1]),
          new RateLimit(limits[1][0], limits[1][1]),
          this.spread ? new RateLimit(limits[0][0] / 10, 0.5) : null
        ]
      }
    }

    /* MARK: API BINDINGS */
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
    }

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
    }

    this.CurrentGame = {
      getCurrentGame: this.getCurrentGame.bind(this),
      get: this.getCurrentGame.bind(this)
    }

    this.FeaturedGames = {
      getFeaturedGames: this.getFeaturedGames.bind(this),
      get: this.getFeaturedGames.bind(this),

      list: this.listFeaturedGames.bind(this)
    }

    this.Game = {
      getRecentGames: this.getRecentGames.bind(this),
      getRecent: this.getRecentGames.bind(this),
      recent: this.getRecentGames.bind(this),
      get: this.getRecentGames.bind(this)
    }

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
    }

    this.Challenger = {
      list: this.listChallengers.bind(this)
    }

    this.Master = {
      list: this.listMasters.bind(this)
    }

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
    }

    this.Status = {
      getShardStatus: this.getShardStatus.bind(this),
      getStatus: this.getShardStatus.bind(this),
      get: this.getShardStatus.bind(this)
    }

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
    }

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
    }

    this.MatchHistory = {
    }

    this.RunesMasteries = {
      getRunes: this.getRunes.bind(this),
      runes: this.getRunes.bind(this),

      getMasteries: this.getMasteries.bind(this),
      masteries: this.getMasteries.bind(this)
    }

    this.Runes = {
      get: this.getRunes.bind(this),

      by: {
        account: this.getRunesByAccountId.bind(this),
        id: this.getRunesById.bind(this),
        name: this.getRunesByName.bind(this)
      }
    }

    this.Masteries = {
      get: this.getMasteries.bind(this),

      by: {
        account: this.getMasteriesByAccountId.bind(this),
        id: this.getMasteriesById.bind(this),
        name: this.getMasteriesByName.bind(this)
      }
    }

    this.Stats = {
      getRankedStats: this.getRankedStats.bind(this),
      ranked: this.getRankedStats.bind(this),

      getStatsSummary: this.getStatsSummary.bind(this),
      summary: this.getStatsSummary.bind(this)
    }

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
    }
    /* END MARK: API BINDINGS */
  }

  /**
   * Checks if client can make a request in a certain region.
   * Checks if client should use spread limiter or not as well.
   * @param {string} region; some region string
   * @returns {boolean} true if client can make a request
   */
  canMakeRequest(region) {
    const spread = this.spread
      ? this.limits[region][2].requestAvailable()
      : true

    return (
      this.limits[region][0].requestAvailable() &&
      this.limits[region][1].requestAvailable() &&
      spread
    )
  }

  /**
   * Sanitizes summoner name.
   * @param {string} name; summoner name
   * @returns {string} sanitized name
   */
  _sanitizeName(name) {
    if (this._validName(name)) {
      return name.replace(/\s/g, '').toLowerCase()
    } else {
      this._logError(
        this._validName.name,
        `Name ${chalk.yellow(name)} is not valid. Request failed.`
      )
    }
  }

  /**
   * Checks if summoner name is valid using Riot League of Legends regex rule.
   * @param {string} name; summoner name
   * @returns {boolean} true if both rules are adhered
   */
  _validName(name) {
    return re.test(name) && name.length <= 16
  }

  /**
   * Caches data.
   * @param {string} key; cache key
   * @param {int} ttl; some integer
   * @param {object} body; some object of data
   */
  _cacheData(key, ttl, body) {
    if (validTTL(ttl))
      this.cache.set({ key, ttl }, body)
  }

  /**
   * Creates a request url.
   * @param {string} query; the string after the url origin
   * @param {string} region; region string
   * @returns {string} a request url
   */
  _makeUrl(query, region) {
    const oldPrefix = `api/lol/${region}/`
    const prefix = 'lol/'
    const base = 'api.riotgames.com'
    const encodedQuery = encodeURI(query)

    const oldUrl = `https://${region}.api.riotgames.com/${oldPrefix}${encodedQuery}`
    const newUrl = `https://${PLATFORM_IDS[REGIONS_BACK[region]].toLowerCase()}.${base}/${prefix}${encodedQuery}`

    // TODO: Remove this when Riot has deprecated the endpoints.
    if (newUrl.lastIndexOf('v3') === -1)
      return oldUrl

    return newUrl
  }

  /**
   * Stringifies a query arguments object.
   * @param {object} options; object representing desired query arguments
   * @param {string} endUrl; the string after the url origin
   * @returns {string} options stringified (form depends on endpoint version for now)
   */
  _stringifyOptions(options, endUrl) {
    let stringifiedOpts = ''

    // Returns stringified opts with appended key-value pair.
    const appendKey = (str, key, el) => str + (str ? '&' : '') + `${key}=${el}`

    // TODO: Remove this when Riot has deprecated the endpoints.
    if (endUrl.lastIndexOf('v3') === -1) {
      // Supports older endpoints (not deprecated until middle of June).
      // Game/Stats are the only ones remaining left,
      // but they don't take multi-valued params.
      stringifiedOpts = queryString.stringify(options)
    } else {
      for (const key of Object.keys(options)) {
        if (Array.isArray(options[key])) {
          for (const el of options[key]) {
            stringifiedOpts = appendKey(stringifiedOpts, key, el)
          }
        } else {
          stringifiedOpts = appendKey(stringifiedOpts, key, options[key])
        }
      }
    }

    return stringifiedOpts
  }

  /**
   * Concatenates request url with key.
   * @param {string} reqUrl; the full request url
   * @param {string} key; an API key
   * @returns {string} the full url used to make requests
   */
  _constructFullUrl(reqUrl, key) {
    return reqUrl + this._getAPIKeySuffix(reqUrl, key)
  }

  /**
   * Resets cache timers in the case that users do not want to cache.
   * @param {object} timers; an object with <string, int> pairs
   * @returns {object} an object with <string, 0> pairs
   */
  _disableCache(timers) {
    for (const key of Object.keys(timers))
      timers[key] = 0

    return timers
  }

  /**
   * Validates query arguments passed into options.
   * @param {object} options; object representing desired query arguments
   * @param {array} allowed; query parameters (usually in the form of a QUERY_PARAMS constant)
   */
  _verifyOptions(options = {}, allowed) {
    const keys = Object.keys(options)

    // No need to check if both are empty.
    if (allowed.length === 0 && keys.length === 0)
      return

    // Check each passed `key` against hard-coded query params.
    for (const key of keys)
      if (!allowed.includes(key))
        throw new Error(chalk.red('Invalid query params! Valid: ' + allowed))
  }

  /**
   * Returns API key suffix. This may contain a key if present.
   * @param {string} url; request url
   * @param {string} key; api key
   * @returns {string} api key suffix
   */
  _getAPIKeySuffix(url, key) {
    return (url.lastIndexOf('?') === -1
      ? '?'
      : '&'
    ) + `api_key=${key ? key : ''}`
  }

  _baseRequest({
    endUrl,
    region = this.defaultRegion,
    staticReq = false,
    options = {},
    cacheParams = {}
  }, cb) {
    const tryRequest = (iterations) => {
      return new Promise((resolve, reject) => {
        const stringifiedOpts = this._stringifyOptions(options, endUrl)
        const postfix = stringifiedOpts ? '?' + stringifiedOpts : ''
        const reqUrl = this._makeUrl(endUrl + postfix, region)
        const displayUrl = reqUrl + this._getAPIKeySuffix(reqUrl) // no key
        const fullUrl = this._constructFullUrl(reqUrl, this.key)

        this.cache.get({ key: reqUrl }, (err, data) => {
          if (data) {
            if (this.debug) {
              const url = this.showKey ? fullUrl : reqUrl
              console.log(`${chalk.green('CACHE HIT')} @ ${url}`)
            }

            var json = JSON.parse(data)
            if (cb) return cb(err, json)
            else return resolve(json)
          } else {
            if (this.limits) {
              var self = this

                ; (function sendRequest(callback, iterationsUntilError) {
                  if (self.canMakeRequest(region)) {
                    if (!staticReq) {
                      self.limits[region][0].addRequest()
                      self.limits[region][1].addRequest()
                      if (self.spread)
                        self.limits[region][2].addRequest()
                    }

                    request({ url: fullUrl, timeout: self.timeout }, (error, response, body) => {
                      if (response && body) {
                        const { statusCode } = response
                        const responseMessage = prettifyStatusMessage(statusCode)
                        const retry = response.headers['retry-after'] * SECOND || SECOND

                        // caching-related variables
                        const key = reqUrl
                        const { ttl } = cacheParams

                        if (self.debug) {
                          const url = self.showKey ? fullUrl : displayUrl
                          printResponseDebug(response, responseMessage, chalk.yellow(url), self.showHeaders)
                        }

                        if (isFunction(callback)) {
                          if (shouldRetry(statusCode)) {
                            if (--iterationsUntilError === 0)
                              return callback(statusCode)
                            if (!self.retryOptions.auto)
                              return callback(statusCode)
                            if (self.debug)
                              console.log('Resending callback request.\n')
                            return setTimeout(() => sendRequest.bind(self)(callback, iterationsUntilError), retry)
                          } else if (statusCode >= ERROR_THRESHOLD) {
                            return callback(statusCode)
                          } else {
                            self._cacheData(key, ttl, body)
                            return callback(error, JSON.parse(body))
                          }
                        } else {
                          if (shouldRetry(statusCode)) {
                            if (--iterationsUntilError === 0)
                              return reject(statusCode)
                            if (!self.retryOptions.auto)
                              return reject(statusCode)
                            if (self.debug)
                              console.log('Resending promise request.\n')
                            return setTimeout(() => resolve(tryRequest(iterationsUntilError)), retry)
                          } else if (statusCode >= ERROR_THRESHOLD) {
                            return reject(statusCode)
                          } else {
                            self._cacheData(key, ttl, body)
                            return resolve(JSON.parse(body))
                          }
                        }
                      } else {
                        console.log(error, reqUrl)
                      }
                    })
                  } else {
                    // Buffer allows us to avoid the pitfalls of
                    // coding with respect to millisecond granularity.
                    const buffer = SECOND / 4.5
                    return setTimeout(() => sendRequest.bind(self)(callback), buffer)
                  }
                })(cb, iterations)
            } else {
              request({ url: fullUrl }, (error, response, body) => {
                if (response) {
                  var self = this

                  const { statusCode } = response
                  const statusMessage = prettifyStatusMessage(statusCode)

                  if (self.debug) {
                    const url = self.showKey ? fullUrl : displayUrl
                    printResponseDebug(response, statusMessage, chalk.yellow(url), self.showHeaders)
                  }

                  if (isFunction(cb)) {
                    if (statusCode >= ERROR_THRESHOLD)
                      return cb(statusCode)
                    else
                      return cb(error, JSON.parse(body))
                  } else {
                    if (statusCode >= ERROR_THRESHOLD)
                      return reject(statusCode)
                    else
                      return resolve(JSON.parse(body))
                  }
                } else {
                  console.log(error, reqUrl)
                }
              })
            }
          }
        })
      })
    }

    return tryRequest(this.numberOfRetriesBeforeBreak)
  }

  _championMasteryRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `${SERVICES.CHAMPION_MASTERY}/v${VERSIONS.CHAMPION}/${endUrl}`, region, options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.CHAMPION_MASTERY
      }
    }, cb)
  }

  _championRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `${SERVICES.CHAMPION}/v${VERSIONS.CHAMPION}/${endUrl}`,
      region, options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.CHAMPION
      }
    }, cb)
  }

  _spectatorRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      endUrl: `${SERVICES.SPECTATOR}/v${VERSIONS.SPECTATOR}/${endUrl}`,
      region,
      cacheParams: {
        ttl: this.CACHE_TIMERS.SPECTATOR
      }
    }, cb)
  }

  _staticRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `${SERVICES.STATIC_DATA}/v${VERSIONS.STATIC_DATA}/${endUrl}`,
      staticReq: true,
      region,
      options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.STATIC
      }
    }, cb)
  }

  _statusRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `${SERVICES.STATUS}/v${VERSIONS.STATUS}/${endUrl}`,
      region,
      options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.STATUS
      }
    }, cb)
  }

  _gameRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      endUrl: `v${VERSIONS.GAME}/game/${endUrl}`, region,
      cacheParams: {
        ttl: this.CACHE_TIMERS.GAME
      }
    }, cb)
  }

  _leagueRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `${SERVICES.LEAGUE}/v${VERSIONS.LEAGUE}/${endUrl}`, region, options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.LEAGUE
      }
    }, cb)
  }

  _matchRequest({ endUrl, region, options, cacheParams = { ttl: this.CACHE_TIMERS.MATCH } }, cb) {
    return this._baseRequest({
      endUrl: `${SERVICES.MATCH}/v${VERSIONS.MATCH}/${endUrl}`, region, options,
      cacheParams
    }, cb)
  }

  _matchlistRequest({ endUrl, region, options }, cb) {
    return this._matchRequest({
      endUrl: `matchlists/${endUrl}`, region, options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.MATCHLIST
      }
    }, cb)
  }

  _runesMasteriesRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      endUrl: `${SERVICES.RUNES_MASTERIES}/v${VERSIONS.RUNES_MASTERIES}/${endUrl}`, region,
      cacheParams: {
        ttl: this.CACHE_TIMERS.RUNES_MASTERIES
      }
    }, cb)
  }

  _statsRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `v${VERSIONS.STATS}/stats/by-summoner/${endUrl}`, region, options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.STATS
      }
    }, cb)
  }

  _summonerRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      endUrl: `${SERVICES.SUMMONER}/v${VERSIONS.SUMMONER}/summoners/${endUrl}`, region,
      cacheParams: {
        ttl: this.CACHE_TIMERS.SUMMONER
      }
    }, cb)
  }

  _logError(message, expected) {
    throw new Error(
      chalk.bold.yellow(message) + ' ' + chalk.red('request') + ' ' + chalk.bold.red('FAILED') + chalk.red(`; ${expected}`)
    )
  }

  setRegion(region) {
    this.defaultRegion = checkValidRegion(region) ? region : undefined

    if (!this.defaultRegion)
      throw new Error(
        `${chalk.red(`setRegion() by Kindred failed: ${chalk.yellow(region)} is an invalid region.`)}\n`
        + `${(chalk.red(`Try importing ${chalk.yellow('require(\'kindred-api\').REGIONS')} and using one of those values instead.`))}`
      )
  }

  /* CHAMPION-V3 */
  getChamps({ region, options } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.CHAMPION.LIST)

    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._championRequest({
      endUrl: 'champions', region, options
    }, cb)
  }

  getChamp({
    region,
    id, championId
  } = {}, cb) {
    if (Number.isInteger(id) || Number.isInteger(championId)) {
      return this._championRequest({
        endUrl: `champions/${id || championId}`,
        region
      }, cb)
    } else {
      return this._logError(
        this.getChamp.name,
        `required params ${chalk.yellow('`id/championId` (int)')} not passed in`
      )
    }
  }

  /* CHAMPION-MASTERY-V3 */
  getChampMastery({
    region,
    playerId, championId
  } = {}, cb) {
    if (Number.isInteger(playerId) && Number.isInteger(championId)) {
      return this._championMasteryRequest({
        endUrl: `champion-masteries/by-summoner/${playerId}/by-champion/${championId}`, region
      }, cb)
    } else {
      return this._logError(
        this.getChampMastery.name,
        `required params ${chalk.yellow('`playerId` (int) AND `championId` (int)')} not passed in`
      )
    }
  }

  getChampMasteries({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name
  } = {}, cb) {
    if (Number.isInteger(accountId || accId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ accId: accountId || accId, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._championMasteryRequest({
            endUrl: `champion-masteries/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return this._championMasteryRequest({
        endUrl: `champion-masteries/by-summoner/${id || summonerId || playerId}`, region
      }, cb)
    } else if (typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._championMasteryRequest({
            endUrl: `champion-masteries/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else {
      return this._logError(
        this.getChampMasteries.name,
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getTotalChampMasteryScore({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name
  } = {}, cb) {
    if (Number.isInteger(accountId || accId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ accId: accountId || accId, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._championMasteryRequest({
            endUrl: `scores/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return this._championMasteryRequest({
        endUrl: `scores/by-summoner/${id || summonerId || playerId}`, region
      }, cb)
    } else if (typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._championMasteryRequest({
            endUrl: `scores/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else {
      return this._logError(
        this.getTotalChampMasteryScore.name,
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  /* SPECTATOR-V3 */
  getCurrentGame({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name
  } = {}, cb) {
    if (Number.isInteger(accountId || accId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ accId: accountId || accId, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._spectatorRequest({
            endUrl: `active-games/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return this._spectatorRequest({
        endUrl: `active-games/by-summoner/${id || summonerId || playerId}`,
        region
      }, cb)
    } else if (typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._spectatorRequest({
            endUrl: `active-games/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else {
      return this._logError(
        this.getCurrentGame.name,
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  getFeaturedGames({ region } = {}, cb) {
    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._spectatorRequest({
      endUrl: 'featured-games',
      region
    }, cb)
  }

  /* GAME-V1.3 */
  getRecentGames({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name
  } = {}, cb) {
    if (Number.isInteger(accountId || accId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ accId: accountId || accId, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._gameRequest({
            endUrl: `by-summoner/${data.id}/recent`, region
          }, cb))
        })
      })
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return this._gameRequest({
        endUrl: `by-summoner/${id || summonerId || playerId}/recent`,
        region
      }, cb)
    } else if (typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._gameRequest({
            endUrl: `by-summoner/${data.id}/recent`, region
          }, cb))
        })
      })
    } else {
      return this._logError(
        this.getRecentGames.name,
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  /* LEAGUE-V3 */
  getLeagues({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name
  } = {}, cb) {
    if (Number.isInteger(accountId || accId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ accId: accountId || accId, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._leagueRequest({
            endUrl: `leagues/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return this._leagueRequest({
        endUrl: `leagues/by-summoner/${id || summonerId || playerId}`,
        region
      }, cb)
    } else if (typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._leagueRequest({
            endUrl: `leagues/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else {
      return this._logError(
        this.getLeagues.name,
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  getLeaguePositions({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name
  } = {}, cb) {
    if (Number.isInteger(accountId || accId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ accId: accountId || accId, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._leagueRequest({
            endUrl: `positions/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return this._leagueRequest({
        endUrl: `positions/by-summoner/${id || summonerId || playerId}`,
        region
      }, cb)
    } else if (typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._leagueRequest({
            endUrl: `positions/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else {
      this._logError(
        this.getLeaguePositions.name,
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  getChallengers({
    region,
    queue = 'RANKED_SOLO_5x5'
  } = {}, cb) {
    cb = isFunction(arguments[0]) ? arguments[0] : arguments[1]

    if (typeof queue === 'string') {
      return this._leagueRequest({
        endUrl: `challengerleagues/by-queue/${queue}`, region
      }, cb)
    } else {
      this._logError(
        this.getChallengers.name,
        `required params ${chalk.yellow('`queue` (string)')} not passed in`
      )
    }
  }

  getMasters({
    region,
    queue = 'RANKED_SOLO_5x5'
  } = {}, cb) {
    cb = isFunction(arguments[0]) ? arguments[0] : arguments[1]

    if (typeof queue === 'string') {
      return this._leagueRequest({
        endUrl: `masterleagues/by-queue/${queue}`, region
      }, cb)
    } else {
      this._logError(
        this.getMasters.name,
        `required params ${chalk.yellow('`queue` (string)')} not passed in`
      )
    }
  }

  /* STATIC-DATA-V3 */
  getChampionList({ region, options } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.CHAMPION.LIST)

    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'champions', region, options }, cb)
  }

  getChampion({
    region,
    id, championId,
    options
  } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.CHAMPION.ONE)

    if (Number.isInteger(id || championId)) {
      return this._staticRequest({ endUrl: `champions/${id || championId}`, region, options }, cb)
    } else {
      return this._logError(
        this.getChampion.name,
        `required params ${chalk.yellow('`id/championId` (int)')} not passed in`
      )
    }
  }

  getItems({ region, options } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.ITEM.LIST)

    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'items', region, options }, cb)
  }

  getItem({
    region,
    id, itemId,
    options
  } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.ITEM.ONE)

    if (Number.isInteger(id || itemId)) {
      return this._staticRequest({ endUrl: `items/${id || itemId}`, region, options }, cb)
    } else {
      return this._logError(
        this.getItem.name,
        `required params ${chalk.yellow('`id/itemId` (int)')} not passed in`
      )
    }
  }

  getLanguageStrings({ region, options } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.LANGUAGE_STRING.LIST)

    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'language-strings', region, options }, cb)
  }

  getLanguages({ region } = {}, cb) {
    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'languages', region }, cb)
  }

  getMapData({ region, options } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.MAP.LIST)

    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'maps', region, options }, cb)
  }

  getMasteryList({ region, options } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.MASTERY.LIST)

    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'masteries', region, options }, cb)
  }

  getMastery({
    region,
    id, masteryId,
    options
  } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.MASTERY.ONE)

    if (Number.isInteger(id || masteryId)) {
      return this._staticRequest({
        endUrl: `masteries/${id || masteryId}`,
        region, options
      }, cb)
    } else {
      return this._logError(
        this.getMastery.name,
        `required params ${chalk.yellow('`id/masteryId` (int)')} not passed in`
      )
    }
  }

  getProfileIcons({ region, options } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.PROFILE_ICON.LIST)

    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'profile-icons', region, options }, cb)
  }

  getRealmData({ region } = {}, cb) {
    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'realms', region }, cb)
  }

  getRuneList({ region, options } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.RUNE.LIST)

    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'runes', region, options }, cb)
  }

  getRune({
    region,
    id, runeId,
    options
  } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.RUNE.ONE)

    if (Number.isInteger(id || runeId)) {
      return this._staticRequest({ endUrl: `runes/${id || runeId}`, region, options }, cb)
    } else {
      return this._logError(
        this.getRune.name,
        `required params ${chalk.yellow('`id/runeId` (int)')} not passed in`
      )
    }
  }

  getSummonerSpells({ region, options } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.SUMMONER_SPELL.LIST)

    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'summoner-spells', region, options }, cb)
  }

  getSummonerSpell({
    region,
    id, spellId, summonerSpellId,
    options
  } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATIC.SUMMONER_SPELL.ONE)

    if (Number.isInteger(id || spellId || summonerSpellId)) {
      return this._staticRequest({
        endUrl: `summoner-spells/${id || spellId || summonerSpellId}`,
        region, options
      }, cb)
    } else {
      return this._logError(
        this.getSummonerSpell.name,
        `required params ${chalk.yellow('`id/spellId/summonerSpellId` (int)')} not passed in`
      )
    }
  }

  getVersionData({ region, options } = {}, cb) {
    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'versions', region, options }, cb)
  }

  /* STATUS-V3 */
  getShardStatus({ region } = {}, cb) {
    if (isFunction(arguments[0])) {
      cb = arguments[0]
      arguments[0] = undefined
    }

    if (typeof region === 'string' && !checkValidRegion(region))
      return this._logError(
        this.getShardStatus.name,
        'invalid region!'
      )

    return this._statusRequest({ endUrl: 'shard-data', region }, cb)
  }

  /* MATCH-V3 */
  getMatch({
    region,
    id, matchId
  } = {}, cb) {
    if (Number.isInteger(id || matchId)) {
      return this._matchRequest({ endUrl: `matches/${id || matchId}`, region }, cb)
    } else {
      return this._logError(
        this.getMatch.name,
        `required params ${chalk.yellow('`id/matchId` (int)')} not passed in`
      )
    }
  }

  getMatchlist({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name,
    options
  } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.MATCHLIST.GET)

    if (Number.isInteger(accountId || accId)) {
      return this._matchlistRequest({
        endUrl: `by-account/${accountId || accId}`,
        region, options
      }, cb)
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ id, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._matchlistRequest({
            endUrl: `by-account/${data.accountId}`,
            region, options
          }, cb))
        })
      })
    } else if (typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._matchlistRequest({
            endUrl: `by-account/${data.accountId}`,
            region, options
          }, cb))
        })
      })
    } else {
      return this._logError(
        this.getMatchlist.name,
        `required params ${chalk.yellow('`accountId/accId` (int)')}, ${chalk.yellow('`id/summonerId/playerId` (int)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getRecentMatchlist({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name
  } = {}, cb) {
    if (Number.isInteger(accountId || accId)) {
      return this._matchlistRequest({
        endUrl: `by-account/${accountId || accId}/recent`,
        region
      }, cb)
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ id, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._matchlistRequest({
            endUrl: `by-account/${data.accountId}/recent`,
            region
          }, cb))
        })
      })
    } else if (typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._matchlistRequest({
            endUrl: `by-account/${data.accountId}/recent`,
            region
          }, cb))
        })
      })
    } else {
      return this._logError(
        this.getRecentMatchlist.name,
        `required params ${chalk.yellow('`accountId/accId` (int)')}, ${chalk.yellow('`id/summonerId/playerId` (int)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getMatchTimeline({
    region,
    id, matchId
  } = {}, cb) {
    if (Number.isInteger(id || matchId)) {
      return this._matchRequest({
        endUrl: `timelines/by-match/${id || matchId}`,
        region
      }, cb)
    } else {
      return this._logError(
        this.getMatchTimeline.name,
        `required params ${chalk.yellow('`id/matchId` (int)')} not passed in`
      )
    }
  }

  /* RUNES-V3 */
  getRunes({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name
  } = {}, cb) {
    if (Number.isInteger(accountId || accId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ accId: accountId || accId, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._runesMasteriesRequest({
            endUrl: `runes/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return this._runesMasteriesRequest({
        endUrl: `runes/by-summoner/${id || summonerId || playerId}`,
        region
      }, cb)
    } else if (typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._runesMasteriesRequest({
            endUrl: `runes/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else {
      return this._logError(
        this.getRunes.name,
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  /* MASTERIES-V3 */
  getMasteries({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name
  } = {}, cb) {
    if (Number.isInteger(accountId || accId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ accId: accountId || accId, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._runesMasteriesRequest({
            endUrl: `masteries/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return this._runesMasteriesRequest({
        endUrl: `masteries/by-summoner/${id || summonerId || playerId}`,
        region
      }, cb)
    } else if (typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._runesMasteriesRequest({
            endUrl: `masteries/by-summoner/${data.id}`,
            region
          }, cb))
        })
      })
    } else {
      return this._logError(
        this.getMasteries.name,
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  /* STATS-V1.3 */
  getRankedStats({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name,
    options
  } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATS.RANKED)

    if (Number.isInteger(accountId || accId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ accId: accountId || accId, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._statsRequest({
            endUrl: `${data.id}/ranked`,
            region, options
          }, cb))
        })
      })
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return this._statsRequest({
        endUrl: `${id || summonerId || playerId}/ranked`,
        region, options
      }, cb)
    } else if (typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._statsRequest({
            endUrl: `${data.id}/ranked`,
            region, options
          }, cb))
        })
      })
    } else {
      this._logError(
        this.getRankedStats.name,
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  getStatsSummary({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name,
    options
  } = {}, cb) {
    this._verifyOptions(options, QUERY_PARAMS.STATS.SUMMARY)

    if (Number.isInteger(accountId || accId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ accId: accountId || accId, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._statsRequest({
            endUrl: `${data.id}/summary`,
            region, options
          }, cb))
        })
      })
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return this._statsRequest({
        endUrl: `${id || summonerId || playerId}/summary`,
        region, options
      }, cb)
    } else if (typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._statsRequest({
            endUrl: `${data.id}/summary`,
            region, options
          }, cb))
        })
      })
    } else {
      this._logError(
        this.getStatsSummary.name,
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  /* SUMMONER-V3 */
  getSummoner({
    region,
    id, summonerId, playerId,
    accountId, accId,
    name
  } = {}, cb) {
    if (Number.isInteger(id || summonerId || playerId)) {
      return this._summonerRequest({
        endUrl: `${id || summonerId || playerId}`,
        region
      }, cb)
    } else if (typeof name === 'string') {
      return this._summonerRequest({
        endUrl: `by-name/${this._sanitizeName(name)}`,
        region
      }, cb)
    } else if (Number.isInteger(accountId || accId)) {
      return this._summonerRequest({
        endUrl: `by-account/${accountId || accId}`,
        region
      }, cb)
    } else {
      return this._logError(
        this.getSummoner.name,
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  /* Non-parameter-destructuring-thingy functions */
  listChampions(options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Champion.all({
      options, region
    }, cb)
  }

  getChampionById(id, region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Champion.get({
      id, region
    }, cb)
  }

  listFeaturedGames(region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.FeaturedGames.get({
      region
    }, cb)
  }

  listChallengers(queue, region, cb) {
    if (checkValidRegion(queue)) {
      if (isFunction(region)) {
        cb = region
        region = undefined
      }

      region = queue
      queue = undefined
    }

    if (isFunction(queue)) {
      cb = queue
      queue = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.League.challengers({
      queue, region
    }, cb)
  }

  listMasters(queue, region, cb) {
    if (checkValidRegion(queue)) {
      if (isFunction(region)) {
        cb = region
        region = undefined
      }

      region = queue
      queue = undefined
    }

    if (isFunction(queue)) {
      cb = queue
      queue = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.League.masters({
      queue, region
    }, cb)
  }

  getSummonerByAccountId(accId, region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Summoner.get({
      region,
      accId
    }, cb)
  }

  getSummonerById(id, region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Summoner.get({
      region,
      id
    }, cb)
  }

  getSummonerByName(name, region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Summoner.get({
      region,
      name
    }, cb)
  }

  getMasteriesByAccountId(accId, region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Masteries.get({
      region,
      accId
    }, cb)
  }

  getMasteriesById(id, region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Masteries.get({
      region,
      id
    }, cb)
  }

  getMasteriesByName(name, region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Masteries.get({
      region,
      name
    }, cb)
  }

  getMatchById(id, region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Match.get({
      region,
      id
    }, cb)
  }

  getMatchlistByAccountId(accId, options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Matchlist.get({
      accId, options, region
    }, cb)
  }

  getMatchlistById(id, options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Matchlist.get({
      id, options, region
    }, cb)
  }

  getMatchlistByName(name, options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Matchlist.get({
      name, options, region
    }, cb)
  }

  getMatchTimelineById(id, region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Match.timeline({
      id, region
    }, cb)
  }

  getRunesByAccountId(accId, region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Runes.get({
      region,
      accId
    }, cb)
  }

  getRunesById(id, region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Runes.get({
      region,
      id
    }, cb)
  }

  getRunesByName(name, region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Runes.get({
      region,
      name
    }, cb)
  }

  getStaticChampionList(options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.champions({
      region, options
    }, cb)
  }

  getStaticChampionById(id, options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.champion({
      id, options, region
    }, cb)
  }

  getStaticItemList(options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.items({
      options, region
    }, cb)
  }

  getStaticItemById(id, options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.item({
      id, options, region
    }, cb)
  }

  getStaticLanguageStringList(options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.languageStrings({
      options, region
    }, cb)
  }

  getStaticLanguageList(region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Static.languages({
      region
    }, cb)
  }

  getStaticMapList(options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.mapData({
      options, region
    }, cb)
  }

  getStaticMasteryList(options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.masteries({
      options, region
    }, cb)
  }

  getStaticMasteryById(id, options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.mastery({
      id, options, region
    }, cb)
  }

  getStaticProfileIconList(options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.profileIcons({
      options, region
    }, cb)
  }

  getStaticRealmList(region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Static.realm({
      region
    }, cb)
  }

  getStaticRuneList(options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.runes({
      options, region
    }, cb)
  }

  getStaticRuneById(id, options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.rune({
      id, options, region
    }, cb)
  }

  getStaticSummonerSpellList(options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.spells({
      options, region
    }, cb)
  }

  getStaticSummonerSpellById(id, options, region, cb) {
    if (isFunction(options)) {
      cb = options
      options = undefined
    }

    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    if (typeof options === 'string') {
      region = options
      options = undefined
    }

    return this.Static.spell({
      id, options, region
    }, cb)
  }

  getStaticVersionList(region, cb) {
    if (isFunction(region)) {
      cb = region
      region = undefined
    }

    return this.Static.versions({
      region
    }, cb)
  }
}

function QuickStart(apiKey, region, debug) {
  if (typeof region == 'boolean') {
    debug = region
    region = undefined
  }

  return new Kindred({
    key: apiKey,
    defaultRegion: region,
    debug,
    limits: LIMITS.DEV,
    cache: new IMC()
  })
}

function print(err, data) {
  if (err) console.log(err)
  else console.log(data)
}

const InMemoryCache = IMC
const RedisCache = RC

export default {
  Kindred,
  LIMITS,
  QUEUE_STRINGS,
  QUEUE_TYPES,
  REGIONS,
  TIME_CONSTANTS,
  QuickStart,
  print,
  // Caches
  InMemoryCache,
  RedisCache
}