const request = require('request')
const chalk = require('chalk')

import PLATFORM_IDS from './constants/platform-ids'
import REGIONS from './constants/regions'
import REGIONS_BACK from './constants/regions-back'
import VERSIONS from './constants/versions'

import checkAll from './helpers/array-checkers'

class Kindred {
  constructor(key, defaultRegion = REGIONS.NORTH_AMERICA) {
    this.key = key
    this.defaultRegion = defaultRegion
  }

  _sanitizeName(name) {
    return name.replace(/\s/g, '').toLowerCase()
  }

  _makeUrl(url, region, statusReq, status, observerMode) {
    const mid = statusReq ? '' : `${region}/`
    const starter = (!status && !observerMode) ? `api/lol/${mid}` : observerMode ? '' : 'lol/status/'

    return `https://${region}.api.riotgames.com/${starter}${url}?api_key=${this.key}`
  }

  _baseRequest({ url, region = this.defaultRegion, status = false, observerMode = false, staticReq = false, options = {} }, cb) {
    const proxy = staticReq ? 'global' : region
    const reqUrl = this._makeUrl(url, proxy, staticReq, status, observerMode)
    console.log(reqUrl)
    if (!cb)
      console.log(
        chalk.red(
          `error: No callback passed in for the method call regarding \`${chalk.yellow(reqUrl)}\``
        )
      )

    request({ url: reqUrl, qs: options }, function (error, response, body) {
      let statusMessage
      const { statusCode } = response

      if (statusCode >= 200 && statusCode < 300) {
        statusMessage = chalk.green(statusCode)
      } else if (statusCode >= 400 && statusCode < 500) {
        statusMessage = chalk.red(statusCode)
      } else if (statusCode >= 500) {
        statusMessage = chalk.bold.red(statusCode)
      }

      console.log('status code:', response && statusMessage)

      if (error) return cb(error)
      else return cb(error, JSON.parse(body))
    })
  }

  _observerRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      url: `observer-mode/rest/${endUrl}`,
      observerMode: true,
      region
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
      url: `static-data/${region}/v${VERSIONS.STATIC_DATA}/${endUrl}`,
      staticReq: true,
      region,
      options
    }, cb)
  }

  _gameRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      url: `v${VERSIONS.GAME}/game/${endUrl}`, region
    }, cb)
  }

  _leagueRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      url: `v${VERSIONS.LEAGUE}/league/${endUrl}`, region, options
    }, cb)
  }

  _statusRequest({ endUrl, region }, cb) {
    return this._baseRequest({ url: `v${VERSIONS.STATUS}/${endUrl}`, region, status: true }, cb)
  }

  _matchRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      url: `v${VERSIONS.MATCH}/match/${endUrl}`, region, options
    }, cb)
  }

  _matchListRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      url: `v${VERSIONS.MATCH_LIST}/matchlist/by-summoner/${endUrl}`, region, options
    }, cb)
  }

  _statsRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      url: `v${VERSIONS.STATS}/stats/by-summoner/${endUrl}`, region, options
    }, cb)
  }

  _summonerRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      url: `v${VERSIONS.SUMMONER}/summoner/${endUrl}`, region
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

  getCurrentGame({ region = this.defaultRegion, id } = {}, cb) {
    if (!id || !Number.isInteger(id)) return this._logError(
      this.getCurrentGame.name,
      `required params ${chalk.yellow('`id` (int)')} not passed in`
    )
    const platformId = PLATFORM_IDS[REGIONS_BACK[region]]
    return this._currentGameRequest({ endUrl: `${id}`, platformId, region }, cb)
  }

  getFeaturedGames({ region } = {}, cb) {
    return this._observerRequest({
      endUrl: 'featured',
      region
    }, cb = region ? cb : arguments[0])
  }

  getRecentGames({ region, id } = {}, cb) {
    if (!id || !Number.isInteger(id)) return this._logError(
      this.getRecentGames.name,
      `required params ${chalk.yellow('`id` (int)')} not passed in`
    )
    return this._gameRequest({ endUrl: `by-summoner/${id}/recent`, region }, cb)
  }

  getLeagues({ region, ids } = {}, cb) {
    if (checkAll.int(ids)) {
      return this._leagueRequest({ endUrl: `by-summoner/${ids.join(',')}`, region }, cb)
    } else if (Number.isInteger(ids)) {
      return this._leagueRequest({ endUrl: `by-summoner/${ids}`, region }, cb)
    } else {
      this._logError(
        this.getLeagues.name,
        'ids can be either an array of integers or a single integer'
      )
    }
  }

  getLeagueEntries({ region, ids } = {}, cb) {
    if (checkAll.int(ids)) {
      return this._leagueRequest({ endUrl: `by-summoner/${ids.join(',')}/entry`, region }, cb)
    } else if (Number.isInteger(ids)) {
      return this._leagueRequest({ endUrl: `by-summoner/${ids}/entry`, region }, cb)
    } else {
      this._logError(
        this.getLeagues.name,
        'ids can be either an array of integers or a single integer'
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
    }, cb)
  }

  getSummoners({ region, names, ids } = {}, cb) {
    if (checkAll.string(names)) {
      return this._summonerRequest({
        endUrl: `by-name/${names.map(name => this._sanitizeName(name)).join(',')}`,
        region
      }, cb)
    } else if (typeof names === 'string') {
      return this._summonerRequest({
        endUrl: `by-name/${names}`,
        region
      }, cb)
    } else if (checkAll.int(ids)) {
      return this._summonerRequest({
        endUrl: `${ids.join(',')}`,
        region
      }, cb)
    } else if (Number.isInteger(ids)) {
      return this._summonerRequest({
        endUrl: `${ids}`,
        region
      }, cb)
    } else {
      this._logError(
        this.getSummoners.name,
        !names && !ids ? 'required parameters not passed' :
        ids ?
          'ids can be either an array of integers or a single integer' :
          'names can be either an array of strings or a single string'
      )
    }
  }

  getSummoner({ region, name, id } = {}, cb) {
    if (typeof name === 'string') return this.getSummoners({ region, names: [name] }, cb)
    if (Number.isInteger(id)) return this.getSummoners({ region, ids: [id] }, cb)
    return this._logError(
      this.getSummoner.name,
      `required parameters ${chalk.yellow('`name` (string)')} or ${chalk.yellow('`id` (int)')} not passed in`
    )
  }

  getSummonerNames({ region, ids } = {}, cb) {
    if (Array.isArray(ids) && ids.length > 0) {
      return this._summonerRequest({
        endUrl: `${ids.join(',')}/name`,
        region
      }, cb)
    } else if (Number.isInteger(ids)) {
      return this._summonerRequest({
        endUrl: `${ids}/name`,
        region
      }, cb)
    } else {
      this._logError(this.getSummonerNames.name, 'ids can be either an array or a single integer')
    }
  }

  getRankedStats({ region, id, options } = {}, cb) {
    if (!id || !Number.isInteger(id)) return this._logError(
      this.getRankedStats.name,
      `required params ${chalk.yellow('`id` (int)')} not passed in`
    )
    return this._statsRequest({ endUrl: `${id}/ranked`, region, options }, cb)
  }

  getShardStatus({ region }, cb) {
    return this._statusRequest({ endUrl: 'shard', region }, cb = region ? cb : arguments[0])
  }

  getShardList({ region }, cb) {
    return this._statusRequest({ endUrl: 'shards', region }, cb = region ? cb : arguments[0])
  }

  getMatch({ region, id, options = { includeTimeline: true } }, cb) {
    if (!id || !Number.isInteger(id)) return this._logError(
      this.getMatch.name,
      `required params ${chalk.yellow('`id` (int)')} not passed in`
    )
    return this._matchRequest({ endUrl: `${id}`, region, options }, cb)
  }

  getMatchList({ region, id, options = { type: 'RANKED_SOLO_5x5' } } = {}, cb) {
    if (!id || !Number.isInteger(id)) return this._logError(
      this.getMatchList.name,
      `required params ${chalk.yellow('`id` (int)')} not passed in`
    )
    return this._matchListRequest({ endUrl: `${id}`, region, options }, cb)
  }

  getChampionList({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'champion', region, options }, cb = region || options ? cb : arguments[0])
  }

  getChampion({ region, id, options } = {}, cb) {
    if (!id || !Number.isInteger(id)) return this._logError(
      this.getChampion.name,
      `required params ${chalk.yellow('`id` (int)')} not passed in`
    )
    return this._staticRequest({ endUrl: `champion/${id}`, region, options }, cb)
  }

  getItems({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'item', region, options }, cb = region || options ? cb : arguments[0])
  }

  getItem({ region, id, options } = {}, cb) {
    if (!id || !Number.isInteger(id)) return this._logError(
      this.getItem.name,
      `required params ${chalk.yellow('`id` (int)')} not passed in`
    )
    return this._staticRequest({ endUrl: `item/${id}`, region, options }, cb)
  }

  getLanguageStrings({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'language-strings', region, options }, cb = region ? cb : arguments[0])
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

  getMastery({ region, id, options } = {}, cb) {
    if (!id || !Number.isInteger(id)) return this._logError(
      this.getMastery.name,
      `required params ${chalk.yellow('`id` (int)')} not passed in`
    )
    return this._staticRequest({ endUrl: `mastery/${id}`, region, options }, cb)
  }

  getRealm({ region } = {}, cb) {
    return this._staticRequest({ endUrl: 'realm', region }, cb = region ? cb : arguments[0])
  }

  getRuneList({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'rune', region, options }, cb = region || options ? cb : arguments[0])
  }

  getRune({ region, id, options } = {}, cb) {
    if (!id || !Number.isInteger(id)) return this._logError(
      this.getRune.name,
      `required params ${chalk.yellow('`id` (int)')} not passed in`
    )
    return this._staticRequest({ endUrl: `rune/${id}`, region, options }, cb)
  }

  getSummonerSpellsList({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'summoner-spell', region, options }, cb = region || options ? cb : arguments[0])
  }

  getSummonerSpell({ region, id, options } = {}, cb) {
    if (!id || !Number.isInteger(id)) return this._logError(
      this.getSummonerSpell.name,
      `required params ${chalk.yellow('`id` (int)')} not passed in`
    )
    return this._staticRequest({ endUrl: 'summoner-spell/${id}', region, options }, cb)
  }

  getVersions({ region, options } = {}, cb) {
    return this._staticRequest({ endUrl: 'versions', region, options }, cb = region || options ? cb : arguments[0])
  }
}

export default Kindred