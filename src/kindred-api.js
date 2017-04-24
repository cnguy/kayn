const request = require('request')
const chalk = require('chalk')
const queryString = require('query-string')

import IMC from './cache/in-memory-cache'
import RC from './cache/redis-cache'

import RateLimit from './rate-limit'

import ENDPOINTS_PREFIXES from './constants/endpoints-prefixes'
import TIME_CONSTANTS from './cache/constants/cache-timers'
import CACHE_TIMERS from './cache/constants/endpoint-cache-timers'
import LIMITS from './constants/limits'
import PLATFORM_IDS from './constants/platform-ids'
import REGIONS from './constants/regions'
import REGIONS_BACK from './constants/regions-back'
import VERSIONS from './constants/versions'
import CACHE_TYPES from './constants/caches'

import re from './constants/valid-summoner-name-regex'

import checkAll from './helpers/array-checkers'
import checkValidRegion from './helpers/check-valid-region'
import colorizeStatusMessage from './helpers/colorize-status-message'
import invalidLimits from './helpers/limits-checker'
import printResponseDebug from './helpers/print-response-debug'

class Kindred {
  constructor({
    key, defaultRegion = REGIONS.NORTH_AMERICA, debug = false,
    limits,
    cacheOptions, cacheTTL
  }) {
    this.key = key

    this.defaultRegion = checkValidRegion(defaultRegion) ? defaultRegion : undefined

    if (!this.defaultRegion) {
      console.log(`${chalk.red(`Initialization of Kindred failed: ${chalk.yellow(defaultRegion)} is an invalid region.`)}`)
      console.log(`${(chalk.red(`Try importing ${chalk.yellow("require('./dist/kindred-api').REGIONS")} and using one of those values instead.`))}`)
      process.exit(1)
    }

    this.debug = debug

    if (!cacheOptions) {
      this.cache = {
        get: (args, cb) => cb(null, null),
        set: (args, value) => {}
      }
    } else {
      if (cacheOptions === CACHE_TYPES[0])
        this.cache = new IMC()
      else if (cacheOptions === CACHE_TYPES[1])
        this.cache = new RC()
      else
        this.cache = cacheOptions

      this.CACHE_TIMERS = cacheTTL ? cacheTTL : CACHE_TIMERS
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
    }

    if (limits) {
      if (invalidLimits(limits)) {
        console.log(`${chalk.red(`Initialization of Kindred failed: Invalid ${chalk.yellow('limits')}. Valid examples: ${chalk.yellow('[[10, 10], [500, 600]]')}`)}.`)
        console.log(`${(chalk.red('You can also pass in one of these two strings:'))} dev/prod `)
        console.log(`${(chalk.red('and Kindred will set the limits appropriately.'))}`)
        process.exit(1)
      }

      this.limits = {}

      if (limits === 'dev') limits = LIMITS.DEV
      if (limits === 'prod') limits = LIMITS.PROD

      for (const region of Object.keys(REGIONS)) {
        this.limits[REGIONS[region]] = [
          new RateLimit(limits[0][0], limits[0][1]),
          new RateLimit(limits[1][0], limits[1][1])
        ]
      }
    }

    this.Champion = {
      getChampions: this.getChamps.bind(this),
      getAll: this.getChamps.bind(this),
      all: this.getChamps.bind(this),

      getChampion: this.getChamp.bind(this),
      get: this.getChamp.bind(this)
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
      score: this.getTotalChampMasteryScore.bind(this),
    }

    this.CurrentGame = {
      getCurrentGame: this.getCurrentGame.bind(this),
      get: this.getCurrentGame.bind(this)
    }

    this.FeaturedGames = {
      getFeaturedGames: this.getFeaturedGames.bind(this),
      get: this.getFeaturedGames.bind(this)
    }

    this.Game = {
      getRecentGames: this.getRecentGames.bind(this),
      getRecent: this.getRecentGames.bind(this),
      get: this.getRecentGames.bind(this)
    }

    this.League = {
      getLeagues: this.getLeagues.bind(this),
      get: this.getLeagues.bind(this),

      getLeagueEntries: this.getLeagueEntries.bind(this),
      getEntries: this.getLeagueEntries.bind(this),
      entries: this.getLeagueEntries.bind(this),

      getChallengers: this.getChallengers.bind(this),
      challengers: this.getChallengers.bind(this),

      getMasters: this.getMasters.bind(this),
      masters: this.getMasters.bind(this)
    }

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
    }

    this.Status = {
      getShardStatus: this.getShardStatus.bind(this),
      getStatus: this.getShardStatus.bind(this),
      get: this.getShardStatus.bind(this),
    }

    this.Match = {
      getMatch: this.getMatch.bind(this),
      get: this.getMatch.bind(this)
    }

    this.MatchList = {
      getMatchList: this.getMatchList.bind(this),
      get: this.getMatchList.bind(this)
    }

    this.RunesMasteries = {
      getRunes: this.getRunes.bind(this),
      runes: this.getRunes.bind(this),

      getMasteries: this.getMasteries.bind(this),
      masteries: this.getMasteries.bind(this)
    }

    this.Runes = {
      get: this.getRunes.bind(this)
    }

    this.Masteries = {
      get: this.getMasteries.bind(this)
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
    }
  }

  canMakeRequest(region) {
    return !(!this.limits[region][0].requestAvailable() || !this.limits[region][1].requestAvailable())
  }

  _sanitizeName(name) {
    if (this._validName(name)) {
      return name.replace(/\s/g, '').toLowerCase()
    } else {
      this._logError(
        this._validName.name,
        `Name ${chalk.yellow(name)} is not valid. Request failed.`
      )
      process.exit(1)
    }
  }

  _validName(name) {
    return re.test(name)
  }

  _makeUrl(query, region, staticReq, status, observerMode, championMastery) {
    const mid = staticReq ? '' : `${region}/`
    const oldPrefix = !status && !observerMode && !championMastery ? `api/lol/${mid}` : ''
    const prefix = `lol/`// `api/lol/${mid}`
    const base = 'api.riotgames.com' // future: api.pvp.net
    
    const oldUrl = `https://${region}.api.riotgames.com/${oldPrefix}${encodeURI(query)}`
    const newUrl = `https://${PLATFORM_IDS[REGIONS_BACK[region]].toLowerCase()}.${base}/${prefix}${encodeURI(query)}`

    /* TODO: Small hack. Leave here until Riot has implemented all endpoints. */
    if (newUrl.lastIndexOf('v3') == -1)
      return oldUrl

    return newUrl
  }

  _baseRequest({
    endUrl,
    region = this.defaultRegion,
    status = false, observerMode = false, staticReq = false, championMastery = false,
    options = {},
    cacheParams = {}
  }, cb) {
    const tryRequest = () => {
      return new Promise((resolve, reject) => {
        for (const key of Object.keys(options)) {
          if (Array.isArray(options[key])) {
            options[key] = options[key].join(',')
          }
        }

        const stringifiedOpts = queryString.stringify(options).replace(/%2C/, ',')
        const postfix = stringifiedOpts ? '?' + stringifiedOpts : ''
        const reqUrl = this._makeUrl(endUrl + postfix, region, staticReq, status, observerMode, championMastery)
        const fullUrl = reqUrl + (reqUrl.lastIndexOf('?') === -1 ? '?' : '&') + `api_key=${this.key}`

        this.cache.get({ key: reqUrl }, (err, data) => {
          if (data) {
            var json = JSON.parse(data)
            if (cb) return cb(err, json)
            else return resolve(json)
          } else {
            if (this.limits) {
              var self = this;

              (function sendRequest(callback) {
                if (self.canMakeRequest(region)) {
                  if (!staticReq) {
                    self.limits[region][0].addRequest()
                    self.limits[region][1].addRequest()
                  }

                  request({ url: fullUrl }, (error, response, body) => {
                    if (response && body) {
                      const { statusCode } = response
                      const statusMessage = colorizeStatusMessage(statusCode)

                      if (self.debug) printResponseDebug(response, statusMessage, fullUrl)

                      if (typeof callback === 'function') {
                        if (statusCode >= 500) {
                          if (self.debug) console.log('!!! resending request !!!')
                          setTimeout(() => { sendRequest.bind(self)(callback) }, 1000)
                        }

                        if (statusCode === 429) {
                          if (self.debug) console.log('!!! resending request !!!')
                          setTimeout(() => {
                            sendRequest.bind(self)(callback)
                          }, (response.headers['retry-after'] * 1000) + 50)
                        }

                        if (statusCode >= 400) {
                          return callback(statusMessage + ' : ' + chalk.yellow(reqUrl))
                        } else {
                          if (Number.isInteger(cacheParams.ttl) && cacheParams.ttl > 0)
                            self.cache.set({ key: reqUrl, ttl: cacheParams.ttl }, body)
                          return callback(error, JSON.parse(body))
                        }
                      } else {
                        if (statusCode === 500) {
                          if (self.debug) console.log('!!! resending promise request !!!')
                          setTimeout(() => { return reject('retry') }, 1000)
                        } else if (statusCode === 429) {
                          if (self.debug) console.log('!!! resending promise request !!!')
                          setTimeout(() => { return reject('retry') }, (response.headers['retry-after'] * 1000) + 50)
                        } else if (error || statusCode >= 400) {
                          return reject('err:', error, statusCode)
                        } else {
                          if (Number.isInteger(cacheParams.ttl) && cacheParams.ttl > 0)
                            self.cache.set({ key: reqUrl, ttl: cacheParams.ttl }, body)
                          return resolve(JSON.parse(body))
                        }
                      }
                    } else {
                      console.log(error, fullUrl)
                    }
                  })
                } else {
                  setTimeout(() => { sendRequest.bind(self)(callback) }, 1000)
                }
              })(cb)
            } else {
              request({ url: fullUrl }, (error, response, body) => {
                if (response) {
                  const { statusCode } = response
                  const statusMessage = colorizeStatusMessage(statusCode)

                  if (self.debug) printResponseDebug(response, statusMessage, fullUrl)

                  if (typeof cb === 'function') {
                    if (statusCode >= 400)
                      return cb(statusMessage + ' : ' + chalk.yellow(reqUrl))
                    else
                      return cb(error, JSON.parse(body))
                  } else {
                    if (error)
                      return reject('err:', error)
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

    if (!cb) return tryRequest()
                      .catch(tryRequest).catch(tryRequest).catch(tryRequest)
                      .then(data => data)

    return tryRequest()
  }

  _championMasteryRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `${ENDPOINTS_PREFIXES.CHAMPION_MASTERY}/v${VERSIONS.CHAMPION}/${endUrl}`, region, options,
      championMastery: true,
      cacheParams: {
        ttl: this.CACHE_TIMERS.CHAMPION_MASTERY
      }
    }, cb)
  }

  _championRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `${ENDPOINTS_PREFIXES.CHAMPION}/v${VERSIONS.CHAMPION}/${endUrl}`,
      region, options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.CHAMPION
      }
    }, cb)
  }

  _spectatorRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      endUrl: `${ENDPOINTS_PREFIXES.SPECTATOR}/v${VERSIONS.SPECTATOR}/${endUrl}`,
      region,
      cacheParams: {
        ttl: this.CACHE_TIMERS.SPECTATOR
      }
    }, cb)
  }

  _staticRequest({ endUrl, region = this.defaultRegion, options }, cb) {
    return this._baseRequest({
      endUrl: `${ENDPOINTS_PREFIXES.STATIC_DATA}/v${VERSIONS.STATIC_DATA}/${endUrl}`,
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
      endUrl: `${ENDPOINTS_PREFIXES.STATUS}/v${VERSIONS.STATUS}/${endUrl}`,
      status: true,
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
      endUrl: `v${VERSIONS.LEAGUE}/league/${endUrl}`, region, options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.LEAGUE
      }
    }, cb)
  }

  _matchRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `v${VERSIONS.MATCH}/match/${endUrl}`, region, options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.MATCH
      }
    }, cb)
  }

  _matchListRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `v${VERSIONS.MATCH_LIST}/matchlist/by-summoner/${endUrl}`, region, options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.MATCH_LIST
      }
    }, cb)
  }

  _runesMasteriesRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      endUrl: `${ENDPOINTS_PREFIXES.RUNES_MASTERIES}/v${VERSIONS.RUNES_MASTERIES}/${endUrl}`, region,
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
      endUrl: `${ENDPOINTS_PREFIXES.SUMMONER}/v${VERSIONS.SUMMONER}/summoners/${endUrl}`, region,
      cacheParams: {
        ttl: this.CACHE_TIMERS.SUMMONER
      }
    }, cb)
  }

  _logError(message, expected) {
    console.log(
      chalk.bold.yellow(message), chalk.red('request'), chalk.bold.red('FAILED') + chalk.red(`; ${expected}`)
    )
  }

  setRegion(region) {
    this.defaultRegion = checkValidRegion(region) ? region : undefined

    console.log(`${chalk.red(`setRegion() by Kindred failed: ${chalk.yellow(region)} is an invalid region.`)}`)
    console.log(`${(chalk.red(`Try importing ${chalk.yellow("require('./dist/kindred-api').REGIONS")} and using one of those values instead.`))}`)
    process.exit(1)
  }

  /* CHAMPION-V1.2 */
  getChamps({ region, options } = {}, cb) {
    return this._championRequest({
      endUrl: 'champions', region, options
    }, cb = arguments.length === 2 ? cb : arguments[0])
  }

  getChamp({
    region,
    id, championID
  } = {}, cb) {
    if (Number.isInteger(id) || Number.isInteger(championID)) {
      return this._championRequest({
        endUrl: `champions/${id || championID}`,
        region
      }, cb)
    } else {
      return this._logError(
        this.getChamp.name,
        `required params ${chalk.yellow('`id/championID` (int)')} not passed in`
      )
    }
  }

  /* CHAMPIONMASTERY */
  getChampMastery({
    region = this.defaultRegion,
    playerID, championID,
    options
  } = {}, cb) {
    if (Number.isInteger(playerID) && Number.isInteger(championID)) {
      return this._championMasteryRequest({
        endUrl: `champion-masteries/by-summoner/${playerID}/by-champion/${championID}`, region, options
      }, cb)
    } else {
      return this._logError(
        this.getChampMastery.name,
        `required params ${chalk.yellow('`playerID` (int) AND `championID` (int)')} not passed in`
      )
    }
  }

  getChampMasteries({
    region = this.defaultRegion,
    id, summonerID, playerID,
    name,
    options
  } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._championMasteryRequest({
        endUrl: `champion-masteries/by-summoner/${id || summonerID || playerID}`, region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
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
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getTotalChampMasteryScore({
    region = this.defaultRegion,
    id, summonerID, playerID,
    name,
    options
  } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._championMasteryRequest({
        endUrl: `scores/by-summoner/${id || summonerID || playerID}`, region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
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
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  /* CURRENT-GAME-V1.0 */
  getCurrentGame({
    region = this.defaultRegion,
    id, summonerID, playerID,
    name
  } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._spectatorRequest({
        endUrl: `active-games/by-summoner/${id || summonerID || playerID}`,
        region
      }, cb = region ? cb: arguments[0])
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._spectatorRequest({
            endUrl: `active-games/by-summoner/${data.id}`,
            region
          }, cb = region ? cb: arguments[0]))
        })
      })
    } else {
      return this._logError(
        this.getCurrentGame.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  /* FEATURED-GAMES-V1.0 */
  getFeaturedGames({ region } = {}, cb) {
    return this._spectatorRequest({
      endUrl: 'featured-games',
      region
    }, cb = region ? cb: arguments[0])
  }

  /* GAME-V1.3 */
  getRecentGames({
    region,
    id, summonerID, playerID,
    name
  } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._gameRequest({
        endUrl: `by-summoner/${id || summonerID || playerID}/recent`,
        region
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
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
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  /* LEAGUE-V2.5 */
  getLeagues({
    region,
    id, summonerID, playerID,
    name,
    options
  } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._leagueRequest({
        endUrl: `by-summoner/${id || summonerID || playerID}`,
        region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._leagueRequest({
            endUrl: `by-summoner/${data.id}`,
            region, options
          }, cb))
        })
      })
    } else {
      return this._logError(
        this.getLeagues.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getLeagueEntries({
    region,
    id, summonerID, playerID,
    name
  } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._leagueRequest({
        endUrl: `by-summoner/${id || summonerID || playerID}/entry`,
        region
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._leagueRequest({
            endUrl: `by-summoner/${data.id}/entry`,
            region
          }, cb))
        })
      })
    } else {
      this._logError(
        this.getLeagueEntries.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getChallengers({
    region,
    options = { type: 'RANKED_SOLO_5x5' }
  } = {}, cb) {
    return this._leagueRequest({
      endUrl: 'challenger', region, options
    }, cb = arguments.length === 2 ? cb : arguments[0])
  }

  getMasters({
    region,
    options = { type: 'RANKED_SOLO_5x5' }
  } = {}, cb) {
    return this._leagueRequest({
      endUrl: 'master', region, options
    }, cb = arguments.length === 2 ? cb : arguments[0])
  }

  /* LOL-STATIC-DATA-V1.2 */
  getChampionList({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'champions', region, options }, cb = arguments.length === 2 ? cb : arguments[0])
  }

  getChampion({
    region,
    id, championID,
    options
  } = {}, cb) {
    if (Number.isInteger(id || championID)) {
      return this._staticRequest({ endUrl: `champions/${id || championID}`, region, options }, cb)
    } else {
      return this._logError(
        this.getChampion.name,
        `required params ${chalk.yellow('`id/championID` (int)')} not passed in`
      )
    }
  }

  getItems({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'items', region, options }, cb = arguments.length === 2 ? cb : arguments[0])
  }

  getItem({
    region,
    id, itemID,
    options
  } = {}, cb) {
    if (Number.isInteger(id || itemID)) {
      return this._staticRequest({ endUrl: `items/${id || itemID}`, region, options }, cb)
    } else {
      return this._logError(
        this.getItem.name,
        `required params ${chalk.yellow('`id/itemID` (int)')} not passed in`
      )
    }
  }

  getLanguageStrings({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'language-strings', region, options }, cb = arguments.length === 2 ? cb : arguments[0])
  }

  getLanguages({ region } = {}, cb) {
    return this._staticRequest({ endUrl: 'languages', region }, cb = region ? cb : arguments[0])
  }

  getMapData({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'maps', region, options }, cb = arguments.length === 2 ? cb : arguments[0])
  }

  getMasteryList({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'masteries', region, options }, cb = arguments.length === 2 ? cb : arguments[0])
  }

  getMastery({
    region,
    id, masteryID,
    options
  } = {}, cb) {
    if (Number.isInteger(id || masteryID)) {
      return this._staticRequest({
        endUrl: `masteries/${id || masteryID}`,
        region, options
      }, cb)
    } else {
      return this._logError(
        this.getMastery.name,
        `required params ${chalk.yellow('`id/masteryID` (int)')} not passed in`
      )
    }
  }

  getProfileIcons({ region, options }, cb) {
    return this._staticRequest({ endUrl: 'profile-icons', region, options }, cb = arguments.length === 2 ? cb : arguments[0])
  }

  getRealmData({ region } = {}, cb) {
    return this._staticRequest({ endUrl: 'realms', region }, cb = region ? cb : arguments[0])
  }

  getRuneList({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'runes', region, options }, cb = arguments.length === 2 ? cb : arguments[0])
  }

  getRune({
    region,
    id, runeID,
    options
  } = {}, cb) {
    if (Number.isInteger(id || runeID)) {
      return this._staticRequest({ endUrl: `runes/${id || runeID}`, region, options }, cb)
    } else {
      return this._logError(
        this.getRune.name,
        `required params ${chalk.yellow('`id/runeID` (int)')} not passed in`
      )
    }
  }

  getSummonerSpells({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'summoner-spells', region, options }, cb = arguments.length === 2 ? cb : arguments[0])
  }

  getSummonerSpell({
    region,
    id, spellID, summonerSpellID,
    options
  } = {}, cb) {
    if (Number.isInteger(id || spellID || summonerSpellID)) {
      return this._staticRequest({
        endUrl: `summoner-spells/${id || spellID || summonerSpellID}`,
        region, options
      }, cb)
    } else {
      return this._logError(
        this.getSummonerSpell.name,
        `required params ${chalk.yellow('`id/spellID/summonerSpellID` (int)')} not passed in`
      )
    }
  }

  getVersionData({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'versions', region, options }, cb = arguments.length === 2 ? cb : arguments[0])
  }

  /* LOL-STATUS-V1.0 */
  getShardStatus({ region } = {}, cb) {
    return this._statusRequest({ endUrl: 'shard-data', region }, cb = region ? cb : arguments[0])
  }

  /* MATCH-V2.2 */
  getMatch({
    region,
    id, matchID,
    options = { includeTimeline: true }
  } = {}, cb) {
    if (Number.isInteger(id || matchID)) {
      return this._matchRequest({ endUrl: `${id || matchID}`, region, options }, cb)
    } else {
      return this._logError(
        this.getMatch.name,
        `required params ${chalk.yellow('`id/matchID` (int)')} not passed in`
      )
    }
  }

  /* MATCHLIST-V2.2 */
  getMatchList({
    region,
    id, summonerID, playerID,
    name,
    options = { rankedQueues: 'TEAM_BUILDER_RANKED_SOLO' }
  } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._matchListRequest({
        endUrl: `${id || summonerID || playerID}`,
        region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._matchListRequest({
            endUrl: `${data.id}`,
            region, options
          }, cb))
        })
      })
    } else {
      return this._logError(
        this.getMatchList.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  /* RUNES-MASTERIES-V1.4 */
  getRunes({
    region,
    id, summonerID, playerID,
    name
  } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._runesMasteriesRequest({
        endUrl: `runes/by-summoner/${id || summonerID || playerID}`,
        region
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
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
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getMasteries({
    region,
    id, summonerID, playerID,
    name
  } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._runesMasteriesRequest({
        endUrl: `masteries/by-summoner/${id || summonerID || playerID}`,
        region
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
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
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  /* STATS-V1.3 */
  getRankedStats({
    region,
    id, summonerID, playerID,
    name,
    options
  } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._statsRequest({
        endUrl: `${id || summonerID || playerID}/ranked`,
        region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
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
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  getStatsSummary({
    region,
    id, summonerID, playerID,
    name,
    options
  } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._statsRequest({
        endUrl: `${id || summonerID || playerID}/summary`,
        region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
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
        this.getRankedStats.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  /* SUMMONER-V1.4 */
  getSummoner({
    region,
    id, summonerID, playerID,
    accountID,
    name
  } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._summonerRequest({
        endUrl: `${id || summonerID || playerID}`,
        region
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return this._summonerRequest({
        endUrl: `by-name/${this._sanitizeName(name)}`,
        region
      }, cb)
    } else if (Number.isInteger(accountID)) {
      return this._summonerRequest({
        endUrl: `by-account/${accountID}`,
        region
      }, cb)
    } else {
      return this._logError(
        this.getSummoner.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')}, ${chalk.yellow('`accountID` (int)')}, or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }
}

function QuickStart(apiKey, region, debug) {
  return new Kindred({
    key: apiKey,
    defaultRegion: region,
    debug,
    limits: LIMITS.DEV,
    cacheOptions: CACHE_TYPES[0],
  })
}

function print(err, data) {
  if (err) console.log(err)
  else console.log(data)
}

export default {
  Kindred,
  REGIONS,
  LIMITS,
  TIME_CONSTANTS,
  CACHE_TYPES,
  QuickStart,
  print
}