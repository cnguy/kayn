import PlatformSuperclass from './PlatformSuperclass'
import Request from '../RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class ThirdPartyCodeEndpointV4 extends PlatformSuperclass {
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
     * Implements GET `/lol/platform/v4/third-party-code/by-summoner/{encryptedSummonerId}`.
     *
     * @param {string} summonerID - The id of the summoner.
     */
    summonerID(summonerID) {
        return new Request(
            this.config,
            this.serviceName,
            `third-party-code/by-summoner/${summonerID}`,
            METHOD_NAMES.THIRD_PARTY_CODE.GET_BY_SUMMONER_ID_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }
}

export default ThirdPartyCodeEndpointV4
