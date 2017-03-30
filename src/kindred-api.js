const request = require('request')
const chalk = require('chalk')
const XRegExp = require('xregexp')

import RateLimit from './rate-limit'

import PLATFORM_IDS from './constants/platform-ids'
import REGIONS from './constants/regions'
import REGIONS_BACK from './constants/regions-back'
import VERSIONS from './constants/versions'

import checkAll from './helpers/array-checkers'
import getResponseMessage from './helpers/get-response-message'

const re = XRegExp('^[0-9\\p{L} _\\.]+$')

class Kindred {
  constructor({ key, defaultRegion = REGIONS.NORTH_AMERICA, debug = false, limits }) {
    this.key = key
    this.defaultRegion = defaultRegion
    this.debug = debug

    if (limits) {
      this.limits = {}

      for (const region of Object.keys(REGIONS)) {
        this.limits[REGIONS[region]] = [
          new RateLimit(limits[0][0], limits[0][1]),
          new RateLimit(limits[1][0], limits[1][1])
        ]
      }
    }
  }

  canMakeRequest(region) {
    if (!this.limits[region][0].requestAvailable() || !this.limits[region][1].requestAvailable()) {
      return false
    }

    return true
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
    const prefix = !status && !observerMode && !championMastery ? `api/lol/${mid}` : ''

    return `https://${region}.api.riotgames.com/${prefix}${encodeURI(query)}?api_key=${this.key}`
  }

  _baseRequest({ endUrl, region = this.defaultRegion, status = false, observerMode = false, staticReq = false, championMastery = false, options = {} }, cb) {
    const proxy = staticReq ? 'global' : region
    const reqUrl = this._makeUrl(endUrl, proxy, staticReq, status, observerMode, championMastery)

    if (!cb) {
      console.log(
        chalk.red(
          `error: No callback passed in for the method call regarding \`${chalk.yellow(reqUrl)}\``
        )
      )
      return
    }

    if (this.limits) {
      var self = this;
      (function sendRequest(callback) {
        if (self.canMakeRequest(region)) {
          if (!staticReq) {
            self.limits[region][0].addRequest()
            self.limits[region][1].addRequest()
          }

          request({ url: reqUrl, qs: options }, (error, response, body) => {
            let statusMessage
            const { statusCode } = response

            if (statusCode >= 200 && statusCode < 300)
              statusMessage = chalk.green(statusCode)
            else if (statusCode >= 400 && statusCode < 500)
              statusMessage = chalk.red(`${statusCode} ${getResponseMessage(statusCode)}`)
            else if (statusCode >= 500)
              statusMessage = chalk.bold.red(`${statusCode} ${getResponseMessage(statusCode)}`)

            if (self.debug) {
              console.log(statusMessage, reqUrl)
              console.log({
                'x-app-rate-limit-count': response.headers['x-app-rate-limit-count'],
                'x-method-rate-limit-count': response.headers['x-method-rate-limit-count'],
                'x-rate-limit-count': response.headers['x-rate-limit-count'],
                'retry-after': response.headers['retry-after']
              })
              console.log()
            }

            if (statusCode >= 500 && self.limits) {
              if (self.debug) console.log('!!! resending request !!!')
              setTimeout(() => { sendRequest.bind(self)(callback) }, 1000)
            }

            if (statusCode === 429 && self.limits) {
              if (self.debug) console.log('!!! resending request !!!')
              setTimeout(() => {
                sendRequest.bind(self)(callback)
              }, (response.headers['retry-after'] * 1000) + 50)
            }

            if (statusCode >= 400) return callback(statusMessage + ' : ' + chalk.yellow(reqUrl))
            else return callback(error, JSON.parse(body))
          })
        } else {
          setTimeout(() => { sendRequest.bind(self)(callback) }, 1000)
        }
      })(cb)
    } else {
      request({ url: reqUrl, qs: options }, (error, response, body) => {
        let statusMessage
        const { statusCode } = response

        if (statusCode >= 200 && statusCode < 300)
          statusMessage = chalk.green(statusCode)
        else if (statusCode >= 400 && statusCode < 500)
          statusMessage = chalk.red(`${statusCode} ${getResponseMessage(statusCode)}`)
        else if (statusCode >= 500)
          statusMessage = chalk.bold.red(`${statusCode} ${getResponseMessage(statusCode)}`)

        if (this.debug) {
          console.log(response && statusMessage, reqUrl)
          console.log({
            'x-app-rate-limit-count': response.headers['x-app-rate-limit-count'],
            'x-method-rate-limit-count': response.headers['x-method-rate-limit-count'],
            'x-rate-limit-count': response.headers['x-rate-limit-count'],
            'retry-after': response.headers['retry-after']
          })
        }

        if (statusCode >= 400) return cb(statusMessage + ' : ' + chalk.yellow(reqUrl))
        else return cb(error, JSON.parse(body))
      })
    }
  }

  _observerRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      endUrl: `observer-mode/rest/${endUrl}`,
      observerMode: true,
      region
    }, cb)
  }

  _championRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `v${VERSIONS.CHAMPION}/${endUrl}`,
      region, options
    }, cb)
  }

  _championMasteryRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `championmastery/location/${endUrl}`, options,
      championMastery: true
    }, cb)
  }

  _currentGameRequest({ endUrl, region, platformId }, cb) {
    return this._observerRequest({
      endUrl: `consumer/getSpectatorGameInfo/${platformId}/${endUrl}`,
      region
    }, cb)
  }

  _staticRequest({ endUrl, region = this.defaultRegion, options }, cb) {
    return this._baseRequest({
      endUrl: `static-data/${region}/v${VERSIONS.STATIC_DATA}/${endUrl}`,
      staticReq: true,
      region,
      options
    }, cb)
  }

  _statusRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `lol/status/v${VERSIONS.STATUS}/${endUrl}`,
      status: true,
      options
    }, cb)
  }

  _gameRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      endUrl: `v${VERSIONS.GAME}/game/${endUrl}`, region
    }, cb)
  }

  _leagueRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `v${VERSIONS.LEAGUE}/league/${endUrl}`, region, options
    }, cb)
  }

  _matchRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `v${VERSIONS.MATCH}/match/${endUrl}`, region, options
    }, cb)
  }

  _matchListRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `v${VERSIONS.MATCH_LIST}/matchlist/by-summoner/${endUrl}`, region, options
    }, cb)
  }

  _runesMasteriesRequest({ endUrl, region }, cb) {
    return this._summonerRequest({ endUrl, region }, cb)
  }

  _statsRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      endUrl: `v${VERSIONS.STATS}/stats/by-summoner/${endUrl}`, region, options
    }, cb)
  }

  _summonerRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      endUrl: `v${VERSIONS.SUMMONER}/summoner/${endUrl}`, region
    }, cb)
  }

  _logError(message, expected) {
    console.log(
      chalk.bold.yellow(message), chalk.red('request'), chalk.bold.red('FAILED') + chalk.red(`; ${expected}`)
    )
  }

  setRegion(region) {
    this.defaultRegion = region
  }

  /* CHAMPION-V1.2 */
  getChamps({ region, options }, cb) {
    return this._championRequest({
      endUrl: `champion`, region, options
    }, cb = region || options ? cb : arguments[0])
  }

  getChamp({ region, id, championID }, cb) {
    if (Number.isInteger(id) || Number.isInteger(championID)) {
      return this._championRequest({
        endUrl: `champion/${id || championID}`,
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
  getChampMastery({ region = this.defaultRegion, playerID, championID, options } = {}, cb) {
    if (Number.isInteger(playerID) && Number.isInteger(championID)) {
      const location = PLATFORM_IDS[REGIONS_BACK[region]]

      return this._championMasteryRequest({
        endUrl: `${location}/player/${playerID}/champion/${championID}`, region, options
      }, cb)
    } else {
      return this._logError(
        this.getChampMastery.name,
        `required params ${chalk.yellow('`playerID` (int) AND `championID` (int)')} not passed in`
      )
    }
  }

  getChampMasteries({ region = this.defaultRegion, id, summonerID, playerID, name, options } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      const location = PLATFORM_IDS[REGIONS_BACK[region]]

      return this._championMasteryRequest({
        endUrl: `${location}/player/${id || summonerID || playerID}/champions`, region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      const location = PLATFORM_IDS[REGIONS_BACK[region]]

      return this.getSummoner({ name, region }, (err, data) => {
        if (err) return cb(err)
        return this._championMasteryRequest({
          endUrl: `${location}/player/${data[this._sanitizeName(name)].id}/champions`,
          region
        }, cb)
      })
    } else {
      return this._logError(
        this.getChampMasteries.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getTotalChampMasteryScore({ region = this.defaultRegion, id, summonerID, playerID, name, options } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      const location = PLATFORM_IDS[REGIONS_BACK[region]]

      return this._championMasteryRequest({
        endUrl: `${location}/player/${id || summonerID || playerID}/score`, region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      const location = PLATFORM_IDS[REGIONS_BACK[region]]

      return this.getSummoner({ name, region }, (err, data) => {
        if (err) return cb(err)
        return this._championMasteryRequest({
          endUrl: `${location}/player/${data[this._sanitizeName(name)].id}/score`,
          region
        }, cb)
      })
    } else {
      return this._logError(
        this.getTotalChampMasteryScore.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getTopChamps({ region = this.defaultRegion, id, summonerID, playerID, name, options } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      const location = PLATFORM_IDS[REGIONS_BACK[region]]

      return this._championMasteryRequest({
        endUrl: `${location}/player/${id || summonerID || playerID}/topchampions`, region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      const location = PLATFORM_IDS[REGIONS_BACK[region]]

      return this.getSummoner({ name, region }, (err, data) => {
        if (err) return cb(err)
        return this._championMasteryRequest({
          endUrl: `${location}/player/${data[this._sanitizeName(name)].id}/topchampions`,
          region
        }, cb)
      })
    } else {
      return this._logError(
        this.getTopChamps.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  /* CURRENT-GAME-V1.0 */
  getCurrentGame({ region = this.defaultRegion, id, summonerID, playerID, name } = {}, cb) {
    const platformId = PLATFORM_IDS[REGIONS_BACK[region]]

    if (Number.isInteger(id || summonerID || playerID)) {
      return this._currentGameRequest({
        endUrl: `${id || summonerID || playerID}`,
        platformId, region
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return this.getSummoner({ name, region }, (err, data) => {
        if (err) return cb(err)
        return this._currentGameRequest({
          endUrl: `${data[this._sanitizeName(name)].id}`, platformId, region
        }, cb)
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
    return this._observerRequest({
      endUrl: 'featured',
      region
    }, cb = region ? cb : arguments[0])
  }

  /* GAME-V1.3 */
  getRecentGames({ region, id, summonerID, playerID, name } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._gameRequest({
        endUrl: `by-summoner/${id || summonerID || playerID}/recent`,
        region
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return this.getSummoner({ name, region }, (err, data) => {
        if (err) return cb(err)
        return this._gameRequest({
          endUrl: `by-summoner/${data[this._sanitizeName(name)].id}/recent`, region
        }, cb)
      })
    } else {
      return this._logError(
        this.getRecentGames.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  /* LEAGUE-V2.5 */
  getLeagues({ region, ids, id, summonerIDs, summonerID, playerIDs, playerID, names, name } = {}, cb) {
    if (checkAll.int(ids || summonerIDs || playerIDs)) {
      return this._leagueRequest({
        endUrl: `by-summoner/${(ids || summonerIDs || playerIDs).join(',')}`,
        region
      }, cb)
    } else if (Number.isInteger(ids || id || summonerIDs || summonerID || playerIDs || playerID)) {
      return this._leagueRequest({
        endUrl: `by-summoner/${ids || id || summonerIDs || summonerID || playerIDs || playerID}`,
        region
      }, cb)
    } else if (checkAll.string(names)) {
      return this.getSummoners({ names, region }, (err, data) => {
        if (err) return cb(err)

        let args = []

        for (let name of names)
          args.push(data[this._sanitizeName(name)].id)

        return this._leagueRequest({ endUrl: `by-summoner/${args.join(',')}`, region }, cb)
      })
    } else if (typeof arguments[0] === 'object' && (typeof names === 'string' || typeof name === 'string')) {
      return this.getSummoner({ name: names || name, region }, (err, data) => {
        if (err) return cb(err)

        return this._leagueRequest({
          endUrl: `by-summoner/${data[this._sanitizeName(names || name)].id}`,
          region
        }, cb)
      })
    } else {
      return this._logError(
        this.getLeagues.name,
        `required params ${chalk.yellow('`ids/summonerIDs/playerIDs` ([int]/int)')}, ${chalk.yellow('`id/summonerID/playerID` (int)')}, ${chalk.yellow('`names` ([str]/str)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getLeagueEntries({ region, ids, id, summonerIDs, summonerID, playerIDs, playerID, names, name } = {}, cb) {
    if (checkAll.int(ids || summonerIDs || playerIDs)) {
      return this._leagueRequest({
        endUrl: `by-summoner/${(ids || summonerIDs || playerIDs).join(',')}/entry`,
        region
      }, cb)
    } else if (Number.isInteger(ids || id || summonerIDs || summonerID || playerIDs || playerID)) {
      return this._leagueRequest({
        endUrl: `by-summoner/${ids || id || summonerIDs || summonerID || playerIDs || playerID}/entry`,
        region
      }, cb)
    } else if (checkAll.string(names)) {
      return this.getSummoners({ names, region }, (err, data) => {
        if (err) return cb(err)

        let args = []

        for (let name of names)
          args.push(data[this._sanitizeName(name)].id)

        return this._leagueRequest({ endUrl: `by-summoner/${args.join(',')}/entry`, region }, cb)
      })
    } else if (typeof arguments[0] === 'object' && (typeof names === 'string' || typeof name === 'string')) {
      return this.getSummoner({ name: names || name, region }, (err, data) => {
        if (err) return cb(err)
        return this._leagueRequest({
          endUrl: `by-summoner/${data[this._sanitizeName(names || name)].id}/entry`,
          region
        }, cb)
      })
    } else {
      this._logError(
        this.getLeagueEntries.name,
        `required params ${chalk.yellow('`ids/summonerIDs/playerIDs` ([int]/int)')}, ${chalk.yellow('`id/summonerID/playerID` (int)')}, ${chalk.yellow('`names` ([str]/str)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getChallengers({ region, options = { type: 'RANKED_SOLO_5x5' } } = {}, cb) {
    return this._leagueRequest({
      endUrl: 'challenger', region, options
    }, cb = region ? cb : arguments[0])
  }

  getMasters({ region, options = { type: 'RANKED_SOLO_5x5' } } = {}, cb) {
    return this._leagueRequest({
      endUrl: 'master', region, options
    }, cb = region ? cb : arguments[0])
  }

  /* LOL-STATIC-DATA-V1.2 */
  getChampionList({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'champion', region, options }, cb = region || options ? cb : arguments[0])
  }

  getChampion({ region, id, championID, options } = {}, cb) {
    if (Number.isInteger(id || championID)) {
      return this._staticRequest({ endUrl: `champion/${id || championID}`, region, options }, cb)
    } else {
      return this._logError(
        this.getChampion.name,
        `required params ${chalk.yellow('`id/championID` (int)')} not passed in`
      )
    }
  }

  getItems({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'item', region, options }, cb = region || options ? cb : arguments[0])
  }

  getItem({ region, id, itemID, options } = {}, cb) {
    if (Number.isInteger(id || itemID)) {
      return this._staticRequest({ endUrl: `item/${id || itemID}`, region, options }, cb)
    } else {
      return this._logError(
        this.getItem.name,
        `required params ${chalk.yellow('`id/itemID` (int)')} not passed in`
      )
    }
  }

  getLanguageStrings({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'language-strings', region, options }, cb = region || options ? cb : arguments[0])
  }

  getLanguages({ region } = {}, cb) {
    return this._staticRequest({ endUrl: 'languages', region }, cb = region ? cb : arguments[0])
  }

  getMap({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'map', region, options }, cb = region || options ? cb : arguments[0])
  }

  getMasteryList({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'mastery', region, options }, cb = region || options ? cb : arguments[0])
  }

  getMastery({ region, id, masteryID, options } = {}, cb) {
    if (Number.isInteger(id || masteryID)) {
      return this._staticRequest({
        endUrl: `mastery/${id || masteryID}`,
        region, options
      }, cb)
    } else {
      return this._logError(
        this.getMastery.name,
        `required params ${chalk.yellow('`id/masteryID` (int)')} not passed in`
      )
    }
  }

  getRealmData({ region } = {}, cb) {
    return this._staticRequest({ endUrl: 'realm', region }, cb = region ? cb : arguments[0])
  }

  getRuneList({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'rune', region, options }, cb = region || options ? cb : arguments[0])
  }

  getRune({ region, id, runeID, options } = {}, cb) {
    if (Number.isInteger(id || runeID)) {
      return this._staticRequest({ endUrl: `rune/${id || runeID}`, region, options }, cb)
    } else {
      return this._logError(
        this.getRune.name,
        `required params ${chalk.yellow('`id/runeID` (int)')} not passed in`
      )
    }
  }

  getSummonerSpells({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'summoner-spell', region, options }, cb = region || options ? cb : arguments[0])
  }

  getSummonerSpell({ region, id, spellID, summonerSpellID, options } = {}, cb) {
    if (Number.isInteger(id || spellID || summonerSpellID)) {
      return this._staticRequest({
        endUrl: `summoner-spell/${id || spellID || summonerSpellID}`,
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
    return this._staticRequest({ endUrl: 'versions', region, options }, cb = region || options ? cb : arguments[0])
  }

  /* LOL-STATUS-V1.0 */
  getShardStatus({ region } = {}, cb) {
    return this._statusRequest({ endUrl: 'shard', region }, cb = region ? cb : arguments[0])
  }

  getShardList({ region } = {}, cb) {
    return this._statusRequest({ endUrl: 'shards', region }, cb = region ? cb : arguments[0])
  }

  /* MATCH-V2.2 */
  getMatch({ region, id, matchID, options = { includeTimeline: true } } = {}, cb) {
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
  getMatchList({ region, id, summonerID, playerID, name, options = { rankedQueues: 'RANKED_SOLO_5x5' } } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._matchListRequest({
        endUrl: `${id || summonerID || playerID}`,
        region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return this.getSummoner({ name, region }, (err, data) => {
        if (err) return cb(err)
        return this._matchListRequest({
          endUrl: `${data[this._sanitizeName(name)].id}`,
          region, options
        }, cb)
      })
    } else {
      return this._logError(
        this.getMatchList.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  /* RUNES-MASTERIES-V1.4 */
  getRunes({ region, ids, id, summonerIDs, summonerID, playerIDs, playerID, names, name } = {}, cb) {
    if (checkAll.int(ids || summonerIDs || playerIDs)) {
      return this._runesMasteriesRequest({
        endUrl: `${(ids || summonerIDs || playerIDs).join()}/runes`,
        region
      }, cb)
    } else if (Number.isInteger(ids || id || summonerIDs || summonerID || playerIDs || playerID)) {
      return this._runesMasteriesRequest({
        endUrl: `${ids || id || summonerIDs || summonerID || playerIDs || playerID}/runes`,
        region
      }, cb)
    } else if (checkAll.string(names)) {
      return this.getSummoners({ names, region }, (err, data) => {
        if (err) return cb(err)

        let args = []

        for (let name of names)
          args.push(data[this._sanitizeName(name)].id)

        return this._runesMasteriesRequest({
          endUrl: `${args.join(',')}/runes`,
          region
        }, cb)
      })
    } else if (typeof arguments[0] === 'object' && (typeof names === 'string' || typeof name === 'string')) {
      return this.getSummoner({ name: names || name, region }, (err, data) => {
        if (err) return cb(err)
        return this._runesMasteriesRequest({
          endUrl: `${data[this._sanitizeName(names || name)].id}/runes`,
          region
        }, cb)
      })
    } else {
      return this._logError(
        this.getRunes.name,
        `required params ${chalk.yellow('`ids/summonerIDs/playerIDs` ([int]/int)')}, ${chalk.yellow('`id/summonerID/playerID` (int)')}, ${chalk.yellow('`names` ([str]/str)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getMasteries({ region, ids, id, summonerIDs, summonerID, playerIDs, playerID, names, name } = {}, cb) {
    if (checkAll.int(ids || summonerIDs || playerIDs)) {
      return this._runesMasteriesRequest({
        endUrl: `${(ids || summonerIDs || playerIDs).join()}/masteries`,
        region
      }, cb)
    } else if (Number.isInteger(ids || id || summonerIDs || summonerID || playerIDs || playerID)) {
      return this._runesMasteriesRequest({
        endUrl: `${ids || id || summonerIDs || summonerID || playerIDs || playerID}/masteries`,
        region
      }, cb)
    } else if (checkAll.string(names)) {
      return this.getSummoners({ names, region }, (err, data) => {
        if (err) return cb(err)

        let args = []

        for (let name of names)
          args.push(data[this._sanitizeName(name)].id)

        return this._runesMasteriesRequest({
          endUrl: `${args.join(',')}/masteries`,
          region
        }, cb)
      })
    } else if (typeof arguments[0] === 'object' && (typeof names === 'string' || typeof name === 'string')) {
      return this.getSummoner({ name: names || name, region }, (err, data) => {
        if (err) return cb(err)
        return this._runesMasteriesRequest({
          endUrl: `${data[this._sanitizeName(names || name)].id}/masteries`,
          region
        }, cb)
      })
    } else {
      return this._logError(
        this.getMasteries.name,
        `required params ${chalk.yellow('`ids/summonerIDs/playerIDs` ([int]/int)')}, ${chalk.yellow('`id/summonerID/playerID` (int)')}, ${chalk.yellow('`names` ([str]/str)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  /* STATS-V1.3 */
  getRankedStats({ region, id, summonerID, playerID, name, options } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._statsRequest({
        endUrl: `${id || summonerID || playerID}/ranked`,
        region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return this.getSummoner({ name, region }, (err, data) => {
        if (err) return cb(err)
        return this._statsRequest({
          endUrl: `${data[this._sanitizeName(name)].id}/ranked`,
          region, options
        }, cb)
      })
    } else {
      this._logError(
        this.getRankedStats.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  getStatsSummary({ region, id, summonerID, playerID, name, options } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this._statsRequest({
        endUrl: `${id || summonerID || playerID}/summary`,
        region, options
      }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return this.getSummoner({ name, region }, (err, data) => {
        if (err) return cb(err)
        return this._statsRequest({
          endUrl: `${data[this._sanitizeName(name)].id}/summary`,
          region, options
        }, cb)
      })
    } else {
      this._logError(
        this.getRankedStats.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  /* SUMMONER-V1.4 */
  getSummoners({ region, ids, id, summonerIDs, summonerID, playerIDs, playerID, names, name } = {}, cb) {
    if (checkAll.int(ids || summonerIDs || playerIDs)) {
      return this._summonerRequest({
        endUrl: `${(ids || summonerIDs || playerIDs).join(',')}`,
        region
      }, cb)
    } else if (Number.isInteger(ids || id || summonerIDs || summonerID || playerIDs || playerID)) {
      return this._summonerRequest({
        endUrl: `${ids || id || summonerIDs || summonerID || playerIDs || playerID}`,
        region
      }, cb)
    } else if (checkAll.string(names)) {
      return this._summonerRequest({
        endUrl: `by-name/${names.map(name => this._sanitizeName(name)).join(',')}`,
        region
      }, cb)
    } else if (typeof arguments[0] === 'object' && (typeof names === 'string' || typeof name === 'string')) {
      return this._summonerRequest({
        endUrl: `by-name/${this._sanitizeName(names || name)}`,
        region
      }, cb)
    } else {
      this._logError(
        this.getSummoners.name,
        `required params ${chalk.yellow('`ids/summonerIDs/playerIDs` ([int]/int)')}, ${chalk.yellow('`id/summonerID/playerID` (int)')}, ${chalk.yellow('`names` ([str]/str)')}, or ${chalk.yellow('`name` (str)')} not passed in`
      )
    }
  }

  getSummoner({ region, id, summonerID, playerID, name } = {}, cb) {
    if (Number.isInteger(id || summonerID || playerID)) {
      return this.getSummoners({ region, ids: [id || summonerID || playerID] }, cb)
    } else if (typeof arguments[0] === 'object' && typeof name === 'string') {
      return this.getSummoners({ region, names: [name] }, cb)
    } else {
      return this._logError(
        this.getSummoner.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} or ${chalk.yellow('`name` (string)')} not passed in`
      )
    }
  }

  getSummonerNames({ region, ids, id, summonerIDs, summonerID, playerIDs, playerID } = {}, cb) {
    if (checkAll.int(ids || summonerIDs || playerIDs)) {
      return this._summonerRequest({
        endUrl: `${(ids || summonerIDs || playerIDs).join(',')}/name`,
        region
      }, cb)
    } else if (Number.isInteger(ids || id || summonerIDs || summonerID || playerIDs || playerID)) {
      return this._summonerRequest({
        endUrl: `${ids || id || summonerIDs || summonerID || playerIDs || playerID}/name`,
        region
      }, cb)
    } else {
      this._logError(
        this.getSummonerNames.name,
        `required params ${chalk.yellow('required params `ids/summonerIDs/playerIDs` ([int]/int)')} or ${chalk.yellow('`id/summonerID/playerID` (int)')} not passed in`
      )
    }
  }

  getSummonerName({ region, id, summonerID, playerID } = {}, cb) {
    if (Number.isInteger(id)) {
      return this.getSummonerNames({ region, id: id || summonerID || playerID }, cb)
    } else {
      this._logError(
        this.getSummonerName.name,
        `required params ${chalk.yellow('`id/summonerID/playerID` (int)')} not passed in`
      )
    }
  }
}

export default {
  Kindred,
  REGIONS
}