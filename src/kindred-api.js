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

  _makeUrl(url, region) {
    return `https://${region}.api.riotgames.com/api/lol/${region}/${url}?api_key=${this.key}`
  }

  _baseRequest({ url, region, staticReq = false, options = {} }, cb) {
    if (!region) region = this.defaultRegion
    const proxy = staticReq ? 'global' : region
    const reqUrl = this._makeUrl(url, proxy)

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

  _summonerRequest({ endUrl, region }, cb) {
    return this._baseRequest({
      url: `v${VERSIONS.SUMMONER}/summoner/${endUrl}`, region
    }, cb)
  }

  _leagueRequest({ endUrl, region, options = {} }, cb) {
    return this._baseRequest({
      url: `v${VERSIONS.LEAGUE}/league/${endUrl}`, region, options
    }, cb)
  }

  _logError(message, expected) {
    console.log(
      chalk.bold.red(message), chalk.red('request'), chalk.bold.red('FAILED') + chalk.red(`; ${expected}`)
    )
  }

  getChallengers({ region, type = 'RANKED_SOLO_5x5' }, cb) {
    return this._leagueRequest({
      endUrl: 'challenger', region, options: { type }
    }, cb)
  }

  getMasters({ region, type = 'RANKED_SOLO_5x5' }, cb) {
    return this._leagueRequest({
      endUrl: 'master', region, options: { type }
    }, cb)
  }

  getSummoners({ region, names, ids = null }, cb) {
    if (Array.isArray(names) && names.length > 0) {
      return this._summonerRequest({
        endUrl: `by-name/${names.map(name => this._sanitizeName(name)).join(',')}`
      }, cb)
    } else if (typeof names === 'string') {
      return this._summonerRequest({
        endUrl: `by-name/${names}`
      }, cb)
    } else if (Array.isArray(ids)) {
      return this._summonerRequest({
        endUrl: `${ids.join(',')}`
      }, cb)
    } else if (Number.isInteger(ids)) {
      return this._summonerRequest({
        endUrl: `${ids}`
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

  getNames({ ids }, cb) {
    if (Array.isArray(ids) && ids.length > 0) {
      return this._summonerRequest({
        endUrl: `${ids.join(',')}/name`
      }, cb)
    } else if (Number.isInteger(ids)) {
      return this._summonerRequest({
        endUrl: `${ids}/name`
      }, cb)
    } else {
      this._logError(this.getNames.name, 'ids can be either an array or a single integer')
    }
  }
}

export default Kindred