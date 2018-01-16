import SpectatorSuperclass from './SpectatorSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class FeaturedGamesEndpoint extends SpectatorSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.list = this.list.bind(this)

        this.limiter = limiter
    }

    /**
     * Get list of featured games.
     *
     * Implements GET `/lol/spectator/v3/featured-games`.
     */
    list() {
        return new Request(
            this.config,
            this.serviceName,
            'featured-games',
            METHOD_NAMES.SPECTATOR.GET_FEATURED_GAMES,
            'GET',
            this.limiter,
        )
    }
}

export default FeaturedGamesEndpoint
