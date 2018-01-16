import SpectatorSuperclass from './SpectatorSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class CurrentGameEndpoint extends SpectatorSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.by = {
            summonerID: this.summonerID.bind(this),
        }

        this.limiter = limiter
    }

    /**
     * Get current game information for the given summoner ID.
     *
     * Implements GET `/lol/spectator/v3/active-games/by-summoner/{summonerId}`.
     *
     * @param {number} summonerID - The ID of a summoner.
     */
    summonerID(summonerID) {
        return new Request(
            this.config,
            this.serviceName,
            `active-games/by-summoner/${summonerID}`,
            METHOD_NAMES.SPECTATOR.GET_CURRENT_GAME_INFO_BY_SUMMONER,
            'GET',
            this.limiter,
        )
    }
}

export default CurrentGameEndpoint
