import LeagueSuperclass from './LeagueSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class LeaguePositionsEndpoint extends LeagueSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.by = {
            summonerID: this.summonerID.bind(this),
        }

        this.limiter = limiter
    }

    /**
     * Get league positions in all queues for a given summoner ID.
     *
     * Implements GET `/lol/league/v3/positions/by-summoner/{summonerId}`.
     *
     * @param {number} summonerID - The ID of the summoner.
     */
    summonerID(summonerID) {
        return new Request(
            this.config,
            this.serviceName,
            `positions/by-summoner/${summonerID}`,
            METHOD_NAMES.LEAGUE.GET_ALL_LEAGUE_POSITIONS_FOR_SUMMONER,
            'GET',
            this.limiter,
        )
    }
}

export default LeaguePositionsEndpoint
