import LeagueSuperclass from './LeagueSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class LeaguePositionsEndpointV4 extends LeagueSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.by = {
            summonerID: this.summonerID.bind(this),
        }

        this.list = this.listLeagueEntries.bind(this)

        this.limiter = limiter
    }

    /**
     * Get league positions in all queues for a given summoner ID.
     *
     * Implements GET `/lol/league/v4/positions/by-summoner/{encryptedSummonerId}`.
     *
     * @param {string} summonerID - The ID of the summoner.
     */
    summonerID(summonerID) {
        return new Request(
            this.config,
            this.serviceName,
            `positions/by-summoner/${summonerID}`,
            METHOD_NAMES.LEAGUE.GET_ALL_LEAGUE_POSITIONS_FOR_SUMMONER_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }

    /**
     * Get all the positional league entries.
     *
     * Implements GET `/lol/league/v4/positions/{positionalQueue}/{tier}/{division}/{position}/{page}`.
     */
    listLeagueEntries(positionalQueue, tier, division, position, page) {
        return new Request(
            this.config,
            this.serviceName,
            `positions/${positionalQueue}/${tier}/${division}/${position}/${page}`,
            METHOD_NAMES.LEAGUE.GET_ALL_POSITIONAL_LEAGUE_ENTRIES_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }
}

export default LeaguePositionsEndpointV4
