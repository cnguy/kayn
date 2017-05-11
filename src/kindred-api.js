const request = require('request')
const chalk = require('chalk')
const queryString = require('query-string')

import IMC from './cache/in-memory-cache'
import RC from './cache/redis-cache'

import RateLimit from './rate-limit'

import SERVICES from './constants/services'
import TIME_CONSTANTS from './cache/constants/cache-timers'
import CACHE_TIMERS from './cache/constants/endpoint-cache-timers'
import LIMITS from './constants/limits'
import PLATFORM_IDS from './constants/platform-ids'
import QUEUE_TYPES from './constants/queue-types'
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
    limits, spread,
    cacheOptions, cacheTTL
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
        + `${(chalk.red(`Try importing ${chalk.yellow("require('./dist/kindred-api').REGIONS")} and using one of those values instead.`))}`
      )
    }

    this.debug = debug

    if (!cacheOptions) {
      this.cache = {
        get: (args, cb) => cb(null, null),
        set: (args, value) => { }
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
        throw new Error()
      }

      this.limits = {}

      if (limits === 'dev') limits = LIMITS.DEV
      if (limits === 'prod') limits = LIMITS.PROD

      this.spread = spread

      for (const region of Object.keys(REGIONS)) {
        this.limits[REGIONS[region]] = [
          new RateLimit(limits[0][0], limits[0][1]),
          new RateLimit(limits[1][0], limits[1][1]),
          this.spread ? new RateLimit(limits[0][0] / 10, 0.8) : null
        ]
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
      get: this.getShardStatus.bind(this),
    }

    this.Match = {
      getMatch: this.getMatch.bind(this),
      get: this.getMatch.bind(this),

      getMatchTimeline: this.getMatchTimeline.bind(this),
      getTimeline: this.getMatchTimeline.bind(this),
      timeline: this.getMatchTimeline.bind(this),

      by: {
        id: this.getMatchById.bind(this)
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

    this.Tournament = {
      getDTOByCode: this.getDTOByCode.bind(this),

      DTO: { // hmm i like this
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
    }

    this.Ex = {
      getSummonerByAccId: this.getSummonerByAccId.bind(this),
      getMatchlistByName: this.getMatchlistByName.bind(this),
      getRunesBySummonerId: this.getRunesBySummonerId.bind(this),
      getRunesByAccountId: this.getRunesByAccountId.bind(this),
      staticRuneList: this.staticRuneList.bind(this)
    }
  }

  canMakeRequest(region) {
    if (this.spread) {
      return (
        this.limits[region][0].requestAvailable() &&
        this.limits[region][1].requestAvailable() &&
        this.limits[region][2].requestAvailable()
      )
    } else {
      return (
        this.limits[region][0].requestAvailable() &&
        this.limits[region][1].requestAvailable()
      )
    }
  }

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
        let stringifiedOpts = ''

        if (endUrl.lastIndexOf('v3') == -1) {
          for (const key of Object.keys(options)) {
            if (Array.isArray(options[key])) {
              options[key] = options[key].join(',')
            }
          }

          stringifiedOpts = queryString.stringify(options).replace(/%2C/, ',')
        } else {
          for (const key of Object.keys(options)) {
            if (Array.isArray(options[key])) {
              for (let i = 0; i < options[key].length; ++i) {
                if (stringifiedOpts) stringifiedOpts += '&'
                stringifiedOpts += `${key}=${options[key][i]}`
              }
            } else {
              if (stringifiedOpts) stringifiedOpts += '&'
              stringifiedOpts += `${key}=${options[key]}`
            }
          }
        }

        const postfix = stringifiedOpts ? '?' + stringifiedOpts : ''
        const reqUrl = this._makeUrl(endUrl + postfix, region, staticReq, status, observerMode, championMastery)
        const fullUrl = reqUrl + (reqUrl.lastIndexOf('?') === -1 ? '?' : '&') + `api_key=${this.key}`

        this.cache.get({ key: reqUrl }, (err, data) => {
          if (data) {
            if (this.debug) console.log(`${chalk.green('CACHE HIT')} ${fullUrl}`)
            var json = JSON.parse(data)
            if (cb) return cb(err, json)
            else return resolve(json)
          } else {
            if (this.limits) {
              var self = this

                ; (function sendRequest(callback) {
                  if (self.canMakeRequest(region)) {
                    if (!staticReq) {
                      self.limits[region][0].addRequest()
                      self.limits[region][1].addRequest()
                      if (self.spread) {
                        self.limits[region][2].addRequest()
                      }
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
                          if (statusCode >= 500) {
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
                  var self = this

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
      endUrl: `${SERVICES.CHAMPION_MASTERY}/v${VERSIONS.CHAMPION}/${endUrl}`, region, options,
      championMastery: true,
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

  _staticRequest({ endUrl, region = this.defaultRegion, options }, cb) {
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
      endUrl: `${SERVICES.LEAGUE}/v${VERSIONS.LEAGUE}/${endUrl}`, region, options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.LEAGUE
      }
    }, cb)
  }

  _matchRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `${SERVICES.MATCH}/v${VERSIONS.MATCH}/${endUrl}`, region, options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.MATCH
      }
    }, cb)
  }

  _matchlistRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `v${VERSIONS.MATCH_LIST}/matchlist/by-summoner/${endUrl}`, region, options,
      cacheParams: {
        ttl: this.CACHE_TIMERS.MATCH_LIST
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

  _tournamentRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      endUrl: `${SERVICES.TOURNAMENT}/v${VERSIONS.TOURNAMENT}`, region,
      cacheParams: {
        ttl: this.CACHE_TIMERS.TOURNAMENT
      }
    }, cb)
  }

  _logError(message, expected) {
    throw new Error(
      chalk.bold.yellow(message) + " " + chalk.red('request') + " " + chalk.bold.red('FAILED') + chalk.red(`; ${expected}`)
    )
  }

  setRegion(region) {
    this.defaultRegion = checkValidRegion(region) ? region : undefined

    if (!this.defaultRegion)
      throw new Error(
        `${chalk.red(`setRegion() by Kindred failed: ${chalk.yellow(region)} is an invalid region.`)}\n`
        + `${(chalk.red(`Try importing ${chalk.yellow("require('./dist/kindred-api').REGIONS")} and using one of those values instead.`))}`
      )
  }

  /* CHAMPION-V3 */
  getChamps({ region, options } = {}, cb) {
    if (typeof arguments[0] === 'function') {
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
    region = this.defaultRegion,
    playerId, championId,
    options
  } = {}, cb) {
    if (Number.isInteger(playerId) && Number.isInteger(championId)) {
      return this._championMasteryRequest({
        endUrl: `champion-masteries/by-summoner/${playerId}/by-champion/${championId}`, region, options
      }, cb)
    } else {
      return this._logError(
        this.getChampMastery.name,
        `required params ${chalk.yellow('`playerId` (int) AND `championId` (int)')} not passed in`
      )
    }
  }

  getChampMasteries({
    region = this.defaultRegion,
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
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getTotalChampMasteryScore({
    region = this.defaultRegion,
    accountId, accId,
    id, summonerId, playerId,
    name,
    options
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
        endUrl: `scores/by-summoner/${id || summonerId || playerId}`, region, options
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
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  /* SPECTATOR-V3 */
  getCurrentGame({ // TODO: Rework promise requests for 404's.
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
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
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
    if (typeof arguments[0] === 'function') {
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
        `required params ${chalk.yellow('`id/summonerId/playerId` (int)')}, ${chalk.yellow('`accountId/accId` (int)')}, or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  /* LEAGUE-V3 */
  getLeagues({
    region,
    accountId, accId,
    id, summonerId, playerId,
    name,
    options
  } = {}, cb) {
    if (Number.isInteger(accountId || accId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ accId: accountId || accId, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._leagueRequest({
            endUrl: `leagues/by-summoner/${data.id}`,
            region, options
          }, cb))
        })
      })
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return this._leagueRequest({
        endUrl: `leagues/by-summoner/${id || summonerId || playerId}`,
        region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._leagueRequest({
            endUrl: `leagues/by-summoner/${data.id}`,
            region, options
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
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
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
    cb = typeof arguments[0] === 'function' ? arguments[0] : arguments[1]

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
    cb = typeof arguments[0] === 'function' ? arguments[0] : arguments[1]

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
    if (typeof arguments[0] === 'function') {
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
    if (typeof arguments[0] === 'function') {
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
    if (typeof arguments[0] === 'function') {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'language-strings', region, options }, cb)
  }

  getLanguages({ region } = {}, cb) {
    if (typeof arguments[0] === 'function') {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'languages', region }, cb)
  }

  getMapData({ region, options } = {}, cb) {
    if (typeof arguments[0] === 'function') {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'maps', region, options }, cb)
  }

  getMasteryList({ region, options } = {}, cb) {
    if (typeof arguments[0] === 'function') {
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

  getProfileIcons({ region, options }, cb) {
    if (typeof arguments[0] === 'function') {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'profile-icons', region, options }, cb)
  }

  getRealmData({ region } = {}, cb) {
    if (typeof arguments[0] === 'function') {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'realms', region }, cb)
  }

  getRuneList({ region, options } = {}, cb) {
    if (typeof arguments[0] === 'function') {
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
    if (typeof arguments[0] === 'function') {
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
    if (typeof arguments[0] === 'function') {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._staticRequest({ endUrl: 'versions', region, options }, cb)
  }

  /* STATUS-V3 */
  getShardStatus({ region } = {}, cb) {
    if (typeof arguments[0] === 'function') {
      cb = arguments[0]
      arguments[0] = undefined
    }

    return this._statusRequest({ endUrl: 'shard-data', region }, cb)
  }

  /* MATCH-V3 */
  getMatch({
    region,
    id, matchId,
    options
  } = {}, cb) {
    if (Number.isInteger(id || matchId)) {
      return this._matchRequest({ endUrl: `matches/${id || matchId}`, region, options }, cb)
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
    options = { queue: QUEUE_TYPES.TEAM_BUILDER_RANKED_SOLO }
  } = {}, cb) {
    if (Number.isInteger(accountId || accId)) {
      return this._matchRequest({
        endUrl: `matchlists/by-account/${accountId || accId}`,
        region, options
      }, cb)
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ id, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._matchRequest({
            endUrl: `matchlists/by-account/${data.accountId}`,
            region, options
          }, cb))
        })
      })
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._matchRequest({
            endUrl: `matchlists/by-account/${data.accountId}`,
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
      return this._matchRequest({
        endUrl: `matchlists/by-account/${accountId || accId}/recent`,
        region
      }, cb)
    } else if (Number.isInteger(id || summonerId || playerId)) {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ id, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._matchRequest({
            endUrl: `matchlists/by-account/${data.accountId}/recent`,
            region
          }, cb))
        })
      })
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return new Promise((resolve, reject) => {
        return this.getSummoner({ name, region }, (err, data) => {
          if (err) { cb ? cb(err) : reject(err); return }
          return resolve(this._matchRequest({
            endUrl: `matchlists/by-account/${data.accountId}/recent`,
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
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
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

  /* TOURNAMENT-V3 */
  getDTOByCode(code, cb) {
    if (typeof code === 'string') {
      return this._tournamentRequest({
        endUrl: `lobby-events/codes/${code}`
      }, cb)
    } else {
      return this._logError(
        this.getDTOByCode.name,
        `required params ${chalk.yellow('`code` (string)')} not passed in`
      )
    }
  }

  getLobbyListEventsByCode(code, cb) {
    if (typeof code === 'string') {
      return this._tournamentRequest({
        endUrl: `lobby-events/by-code/${code}`
      }, cb)
    } else {
      return this._logError(
        this.getLobbyListEventsByCode.name,
        `required params ${chalk.yellow('`code` (string)')} not passed in`
      )
    }
  }

  /* Non-parameter-destructuring-thingy functions */
  listChampions(options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Champion.all({
      options, region
    }, cb)
  }

  getChampionById(id, region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Champion.get({
      id, region
    }, cb)
  }

  listFeaturedGames(region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.FeaturedGames.get({
      region
    }, cb)
  }

  listChallengers(queue, region, cb) {
    if (typeof queue == 'function') {
      cb = queue
      queue = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.League.challengers({
      queue, region
    }, cb)
  }

  listMasters(queue, region, cb) {
    if (typeof queue == 'function') {
      cb = queue
      queue = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.League.masters({
      queue, region
    }, cb)
  }

  getSummonerByAccountId(accId, region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Summoner.get({
      region,
      accId
    }, cb)
  }

  getSummonerById(id, region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Summoner.get({
      region,
      id
    }, cb)
  }

  getSummonerByName(name, region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Summoner.get({
      region,
      name
    }, cb)
  }

  getMasteriesByAccountId(accId, region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Masteries.get({
      region,
      accId
    }, cb)
  }

  getMasteriesById(id, region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Masteries.get({
      region,
      id
    }, cb)
  }

  getMasteriesByName(name, region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Masteries.get({
      region,
      name
    }, cb)
  }

  getMatchById(id, region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Match.get({
      region,
      id
    }, cb)
  }

  getMatchlistByAccountId(accId, options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Matchlist.get({
      region,
      accId
    }, cb)
  }

  getMatchlistById(id, options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Matchlist.get({
      region,
      id
    }, cb)
  }

  getMatchlistByName(name, options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Matchlist.get({
      name, options, region
    }, cb)
  }

  getRunesByAccountId(accId, region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Runes.get({
      region,
      accId
    }, cb)
  }

  getRunesById(id, region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Runes.get({
      region,
      id
    }, cb)
  }

  getRunesByName(name, region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Runes.get({
      region,
      name
    }, cb)
  }

  getStaticChampionList(options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.champions({
      region, options
    }, cb)
  }

  getStaticChampionById(id, options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.champion({
      id, options, region
    }, cb)
  }

  getStaticItemList(options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.items({
      options, region
    }, cb)
  }

  getStaticItemById(id, options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.item({
      id, options, region
    }, cb)
  }

  getStaticLanguageStringList(options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.languageStrings({
      options, region
    }, cb)
  }

  getStaticLanguageList(region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Static.languages({
      region
    }, cb)
  }

  getStaticMapList(options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.mapData({
      options, region
    }, cb)
  }

  getStaticMasteryList(options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.masteries({
      options, region
    }, cb)
  }

  getStaticMasteryById(id, options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.mastery({
      id, options, region
    }, cb)
  }

  getStaticProfileIconList(options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.profileIcons({
      options, region
    }, cb)
  }

  getStaticRealmList(region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Static.realm({
      region
    }, cb)
  }

  getStaticRuneList(options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.runes({
      options, region
    }, cb)
  }

  getStaticRuneById(id, options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.rune({
      id, options, region
    }, cb)
  }

  getStaticSummonerSpellList(options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.spells({
      options, region
    }, cb)
  }

  getStaticSummonerSpellById(id, options, region, cb) {
    if (typeof options == 'function') {
      cb = options
      options = undefined
    }

    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    if (typeof options == 'string') {
      region = options
      options = undefined
    }

    return this.Static.spell({
      id, options, region
    }, cb)
  }

  getStaticVersionList(region, cb) {
    if (typeof region == 'function') {
      cb = region
      region = undefined
    }

    return this.Static.versions({
      region
    }, cb)
  }

  /* Examples */
  getSummonerByAccId(accId, region, cb) {
    return this.Summoner.get({
      region,
      accId
    }, cb)
  }

  getRunesBySummonerId(id, region, cb) {
    return this.Runes.get({
      region,
      id
    }, cb)
  }

  staticRuneList(region, options, cb) {
    return this.Static.runes({
      region, options
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
  QUEUE_TYPES,
  QuickStart,
  print
}