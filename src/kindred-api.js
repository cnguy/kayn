const request = require('request')
const chalk = require('chalk')

import VERSIONS from './constants/versions'
import REGIONS from './constants/regions'

class Kindred {
  constructor(key, defaultRegion = REGIONS.NORTH_AMERICA) {
    this.key = key
    this.defaultRegion = defaultRegion
  }

  _sanitizeName(name) {
    return name.replace(/\s/g, '').toLowerCase()
  }

  _makeUrl(url, region, staticReq) {
    const mid = staticReq ? '' : `${region}/`
    return `https://${region}.api.riotgames.com/api/lol/${mid}${url}?api_key=${this.key}`
  }

  _baseRequest({ url, region, staticReq = false, options = {} }, cb) {
    if (!region) region = this.defaultRegion
    const proxy = staticReq ? 'global' : region
    const reqUrl = this._makeUrl(url, proxy, staticReq)
    console.log(reqUrl)
    if (!cb) return console.log(
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

      return cb(error, JSON.parse(body))
    })
  }

  _staticRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      url: `static-data/${region}/v${VERSIONS.STATIC_DATA}/${endUrl}`,
      staticReq: true,
      region,
      options
    }, cb)
  }


  _leagueRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      url: `v${VERSIONS.LEAGUE}/league/${endUrl}`, region, options
    }, cb)
  }

  _summonerRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      url: `v${VERSIONS.SUMMONER}/summoner/${endUrl}`, region
    }, cb)
  }

  _matchListRequest({ endUrl, region, options }, cb) {
    return this._baseRequest({
      url: `v${VERSIONS.MATCH_LIST}/matchlist/by-summoner/${endUrl}`, options
    }, cb)
  }

  _statsRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      url: `v${VERSIONS.STATS}/stats/by-summoner/${endUrl}`, region
    }, cb)
  }

  _logError(message, expected) {
    console.log(
      chalk.bold.red(message), chalk.red('request'), chalk.bold.red('FAILED') + chalk.red(`; ${expected}`)
    )
  }

  getChallengers({ region, options = { type: 'RANKED_SOLO_5x5' } }, cb) {
    return this._leagueRequest({
      endUrl: 'challenger', region, options
    }, cb)
  }

  getMasters({ region, options = { type: 'RANKED_SOLO_5x5' } }, cb) {
    return this._leagueRequest({
      endUrl: 'master', region, options
    }, cb)
  }

  getSummoners({ region, names, ids = null }, cb) {
    if (Array.isArray(names) && names.length > 0) {
      return this._summonerRequest({
        endUrl: `by-name/${names.map(name => this._sanitizeName(name)).join(',')}`,
        region
      }, cb)
    } else if (typeof names === 'string') {
      return this._summonerRequest({
        endUrl: `by-name/${names}`,
        region
      }, cb)
    } else if (Array.isArray(ids) && ids.length > 0) {
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
        ids ?
          'ids can be either an array or a single integer' :
          'names can be either an array or a single string'
      )
    }
  }

  getNames({ region, ids }, cb) {
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
      this._logError(this.getNames.name, 'ids can be either an array or a single integer')
    }
  }

  getRankedStats({ region, id, options }, cb) {
    return this._statsRequest({
      endUrl: `${id}/ranked`,
      region,
      options
    }, cb)
  }

  getMatchList({ region, id, options = { type: 'RANKED_SOLO_5x5' } }, cb) {
    return this._matchListRequest({
      endUrl: `${id}`,
      region,
      options
    }, cb)
  }

  getChampionList({ region, options }, cb)  {
    return this._staticRequest({ endUrl: 'champion', region, options }, cb)
  }

  getChampion({ region, id, options }, cb) {
    return this._staticRequest({ endUrl: `champion/${id}`, region, options }, cb)
  }

  getItems({ region, options }, cb) {
    return this._staticRequest({ endUrl: 'item', region, options }, cb)
  }

  getItem({ region, id, options }, cb) {
    return this._staticRequest({ endUrl: `item/${id}`, region, options }, cb)
  }

  getLanguageStrings({ region, options }, cb) {
    return this._staticRequest({ endUrl: 'language-strings', region, options }, cb)
  }

  getLanguages({ region }, cb) {
    return this._staticRequest({ endUrl: 'languages', region }, cb)
  }

  getMap({ region, options }, cb) {
    return this._staticRequest({ endUrl: 'map', region, options }, cb)
  }

  getMasteryList({ region, options }, cb) {
    return this._staticRequest({ endUrl: 'mastery', region, options }, cb)
  }

  getMastery({ region, id, options }, cb) {
    return this._staticRequest({ endUrl: `mastery/${id}`, region, options }, cb)
  }

  getRealm({ region }, cb) {
    return this._staticRequest({ endUrl: 'realm', region }, cb)
  }

  getRuneList({ region, options }, cb) {
    return this._staticRequest({ endUrl: 'rune', region, options }, cb)
  }

  getRune({ region, id, options }, cb) {
    return this._staticRequest({ endUrl: `rune/${rune}`, region, options }, cb)
  }

  getSummonerSpellsList({ region, options }, cb) {
    return this._staticRequest({ endUrl: 'summoner-spell', region, options }, cb)
  }

  getSummonerSpell({ region, id, options }, cb) {
    return this._staticRequest({ endUrl: 'summoner-spell/${id}', region, options }, cb)
  }

  getVersions({ region, options }, cb) {
    return this._staticRequest({ endUrl: 'versions', region, options }, cb)
  }
}

export default Kindred