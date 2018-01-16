import PlatformSuperclass from './PlatformSuperclass'
import Request from '../RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class ThirdPartyCodeEndpoint extends PlatformSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.by = {
            summonerID: this.summonerID.bind(this),
        }

        this.limiter = limiter
    }

    /**
     * Get third party code for a given summoner ID.
     *
     * Implements GET `/lol/platform/v3/third-party-code/by-summoner/{summonerId}`.
     *
     * @param {number} summonerID - The id of the summoner.
     */
    summonerID(summonerID) {
        return new Request(
            this.config,
            this.serviceName,
            `third-party-code/by-summoner/${summonerID}`,
            METHOD_NAMES.THIRD_PARTY_CODE.GET_BY_SUMMONER_ID,
            'GET',
            this.limiter,
        )
    }
}

export default ThirdPartyCodeEndpoint
