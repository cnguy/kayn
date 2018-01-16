import Endpoint from '../Endpoint'
import Request from '../RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class SummonerEndpoint extends Endpoint {
    constructor(config, limiter) {
        super()

        this.config = config

        this.by = {
            name: this.summonerName.bind(this),
            id: this.summonerID.bind(this),
            accountID: this.accountID.bind(this),
        }

        this.serviceName = 'summoner'

        this.limiter = limiter
    }

    /**
     * Get a summoner by summoner name.
     *
     * Implements GET `/lol/summoner/v3/summoners/by-name/{summonerName}`.
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
        )
    }

    /**
     * Get a summoner by summoner ID.
     *
     * Implements GET `/lol/summoner/v3/summoners/{summonerId}`.
     *
     * @param {number} summonerID - The id of the summoner.
     */
    summonerID(summonerID) {
        return new Request(
            this.config,
            this.serviceName,
            `summoners/${summonerID}`,
            METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_ID,
            'GET',
            this.limiter,
        )
    }

    /**
     * Get a summoner by account ID.
     *
     * Implements GET `/lol/summoner/v3/summoners/by-account/{accountId}`.
     *
     * @param {number} accountID - The account ID of the summoner.
     */
    accountID(accountID) {
        return new Request(
            this.config,
            this.serviceName,
            `summoners/by-account/${accountID}`,
            METHOD_NAMES.SUMMONER.GET_BY_ACCOUNT_ID,
            'GET',
            this.limiter,
        )
    }
}

export default SummonerEndpoint
