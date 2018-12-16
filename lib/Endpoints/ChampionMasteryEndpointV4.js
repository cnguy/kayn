import Endpoint from 'Endpoint'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class ChampionMasteryEndpointV4 extends Endpoint {
    constructor(config, limiter) {
        super()

        this.config = config

        this.get = this.get.bind(this)
        this.list = this.list.bind(this)
        this.totalScore = this.totalScore.bind(this)

        this.serviceName = 'champion-mastery'

        this.limiter = limiter
    }

    /**
     * Get a champion mastery by player ID and champion ID. Returns a function that takes in a champion ID.
     *
     * Implements GET `/lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}/by-champion/{championId}`.
     *
     * @param {string} summonerID - The ID of the summoner.
     * @returns {ChampionMastery.get.inner} - The curried function.
     */
    get(summonerID) {
        const self = this
        /**
         * @name ChampionMastery.get.inner
         */
        return function(championID) {
            return new Request(
                self.config,
                self.serviceName,
                `champion-masteries/by-summoner/${summonerID}/by-champion/${championID}`,
                METHOD_NAMES.CHAMPION_MASTERY.GET_CHAMPION_MASTERY_V4,
                'GET',
                self.limiter,
                null,
                false,
                4,
            )
        }
    }

    /**
     * Get all champion mastery entries sorted by number of champion points descending.
     *
     * Implements GET `/lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}`.
     *
     * @param {string} summonerID - The ID of the summoner.
     */
    list(summonerID) {
        return new Request(
            this.config,
            this.serviceName,
            `champion-masteries/by-summoner/${summonerID}`,
            METHOD_NAMES.CHAMPION_MASTERY.GET_ALL_CHAMPION_MASTERIES_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }

    /**
     * Get all champion mastery entries sorted by number of champion points descending.
     *
     * Implements GET `/lol/champion-mastery/v4/scores/by-summoner/{encryptedSummonerId}`.
     *
     * @param {number} summonerID - The ID of the summoner.
     */
    totalScore(summonerID) {
        return new Request(
            this.config,
            this.serviceName,
            `scores/by-summoner/${summonerID}`,
            METHOD_NAMES.CHAMPION_MASTERY.GET_CHAMPION_MASTERY_SCORE_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }
}

export default ChampionMasteryEndpointV4
