import SpectatorSuperclass from './SpectatorSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class CurrentGameEndpointV4 extends SpectatorSuperclass {
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
     * Implements GET `/lol/spectator/v4/active-games/by-summoner/{encryptedSummonerId}`.
     *
     * @param {string} summonerID - The ID of a summoner.
     */
    summonerID(summonerID) {
        return new Request(
            this.config,
            this.serviceName,
            `active-games/by-summoner/${summonerID}`,
            METHOD_NAMES.SPECTATOR.GET_CURRENT_GAME_INFO_BY_SUMMONER_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }
}

export default CurrentGameEndpointV4
