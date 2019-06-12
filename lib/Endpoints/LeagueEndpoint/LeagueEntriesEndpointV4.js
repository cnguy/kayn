import LeagueSuperclass from './LeagueSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class LeagueEntriesEndpointV4 extends LeagueSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.by = {
            summonerID: this.summonerID.bind(this),
        }

        this.list = this.list.bind(this)

        this.limiter = limiter
    }

    /**
     * Get league entries in all queues for a given summoner ID.
     *
     * Implements GET `/lol/league/v4/entries/by-summoner/{encryptedSummonerId}`.
     *
     * @param {string} encryptedSummonerId - The encrypted id of the summoner.
     */
    summonerID(summonerID) {
        return new Request(
            this.config,
            this.serviceName,
            `entries/by-summoner/${summonerID}`,
            METHOD_NAMES.LEAGUE.GET_LEAGUE_ENTRIES_BY_SUMMONER_ID_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }

    /**
     * Get all the league entries.
     *
     * Implements GET `/lol/league/v4/entries/{queue}/{tier}/{division}`.
     *
     * @param {string} queue - The queue to search for. e.g. RANKED_SOLO_5x5
     * @param {string} tier - The tier to search for. e.g. DIAMOND
     * @param {string} division - The division to search for. e.g. I
     */
    list(queue, tier, division) {
        return new Request(
            this.config,
            this.serviceName,
            `entries/${queue}/${tier}/${division}`,
            METHOD_NAMES.LEAGUE.GET_LEAGUE_ENTRIES_BY_QUEUE_TIER_DIVISION_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }
}

export default LeagueEntriesEndpointV4
