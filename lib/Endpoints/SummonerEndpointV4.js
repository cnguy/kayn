import Endpoint from '../Endpoint'
import Request from '../RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class SummonerEndpointV4 extends Endpoint {
    constructor(config, limiter) {
        super()

        this.config = config

        this.by = {
            name: this.summonerName.bind(this),
        }

        this.serviceName = 'summoner'

        this.limiter = limiter
    }

    /**
     * Get a summoner by summoner name.
     *
     * Implements GET `/lol/summoner/v4/summoners/by-name/{summonerName}`.
     *
     * @param {string} summonerName - The name of the summoner.
     */
    summonerName(summonerName) {
        return new Request(
            this.config,
            this.serviceName,
            `summoners/by-name/${encodeURI(summonerName)}`,
            METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }
}

export default SummonerEndpointV4
