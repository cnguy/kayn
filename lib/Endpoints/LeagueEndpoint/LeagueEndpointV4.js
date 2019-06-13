import LeagueSuperclass from './LeagueSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class LeagueEndpointV4 extends LeagueSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.by = {
            uuid: this.uuid.bind(this),
        }

        this.limiter = limiter
    }

    /**
     * Get league with given ID, including inactive entries.
     *
     * Implements GET `/lol/league/v4/leagues/{leagueId}`.
     *
     * @param {string} leagueUUID - The UUID of the league.
     */
    uuid(leagueUUID) {
        return new Request(
            this.config,
            this.serviceName,
            `leagues/${leagueUUID}`,
            METHOD_NAMES.LEAGUE.GET_LEAGUE_BY_ID_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }
}

export default LeagueEndpointV4
