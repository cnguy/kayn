const request = require('request')
const chalk = require('chalk')

import VERSIONS from './constants/versions'
import REGIONS from './constants/regions'

class Kindred {
    constructor(key, defaultRegion = REGIONS['NORTH_AMERICA']) {
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
        const proxy = (staticReq) ? 'global' : region
        const reqUrl = this._makeUrl(url, proxy)
        if (!cb) return console.log(chalk.red(
            `error: No callback passed in for the method call regarding \`${chalk.yellow(reqUrl)}\``
            ))
        
        request({ url: reqUrl, qs: options }, function (error, response, body) {
            // if (error) console.log('ERROR:', error)
            console.log('statusCode:', response && response.statusCode);
            
            if (cb) return cb(error, body)
            // console.log('body:', body);
        })
    }

    _summonerRequest({ endUrl, region }, cb) {
        return this._baseRequest({
            url: `v${VERSIONS['summoner']}/summoner/${endUrl}`, region
        }, cb)
    }

    _leagueRequest({ endUrl, region, options = {} }, cb) {
        return this._baseRequest({
            url: `v${VERSIONS['league']}/league/${endUrl}`, region, options
            }, cb)
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

    getSummoners({region, names, ids=null}, cb) {
        if (Array.isArray(names)) {
            return this._summonerRequest({
                endUrl: `by-name/${names.map(name => this._sanitizeName(name)).join(',')}`
            }, cb)
        } else if (typeof names === 'string') {
            return this._summonerRequest({
                endUrl: `by-name/${names}`
            }, cb)
        }
    }
}

export default Kindred