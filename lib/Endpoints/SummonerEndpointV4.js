import Endpoint from '../Endpoint'
import Request from '../RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class SummonerEndpointV4 extends Endpoint {
    constructor(config, limiter) {
        super()

        this.config = config

        this.by = {
            accountID: this.accountID.bind(this),
            name: this.summonerName.bind(this),
            puuid: this.puuid.bind(this),
            id: this.summonerID.bind(this),
        }

        this.serviceName = 'summoner'

        this.limiter = limiter
    }

    /**
     * Get a summoner by account ID.
     *
     * Implements GET `/lol/summoner/v4/summoners/by-account/{encryptedAccountId}`.
     *
     * @param {string} accountID - The account ID of the summoner.
     */
    accountID(accountID) {
        return new Request(
            this.config,
            this.serviceName,
            `summoners/by-account/${accountID}`,
            METHOD_NAMES.SUMMONER.GET_BY_ACCOUNT_ID_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
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
            METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }

    /**
     * Get a summoner by summoner puuid.
     *
     * Implements GET `/lol/summoner/v4/summoners/by-puuid/{encryptedPUUID}`.
     *
     * @param {string} puuid - The puuid of the summoner.
     */
    puuid(puuid) {
        return new Request(
            this.config,
            this.serviceName,
            `summoners/by-puuid/${puuid}`,
            METHOD_NAMES.SUMMONER.GET_BY_PUUID_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }

    /**
     * Get a summoner by summoner ID.
     *
     * Implements GET `/lol/summoner/v4/summoners/{encryptedSummonerId}`.
     *
     * @param {string} summonerID - The id of the summoner.
     */
    summonerID(summonerID) {
        return new Request(
            this.config,
            this.serviceName,
            `summoners/${summonerID}`,
            METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_ID_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }
}

export default SummonerEndpointV4
