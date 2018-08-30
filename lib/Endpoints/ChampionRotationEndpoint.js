import PlatformSuperclass from './PlatformSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class ChampionRotationEndpoint extends PlatformSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.list = this.list.bind(this)

        this.serviceName = 'platform'

        this.limiter = limiter
    }

    /**
     * Returns champion rotations, including free-to-play and low-level free-to-play rotations.
     *
     * Implements GET `/lol/platform/v3/champion-rotations`.
     */
    list() {
        return new Request(
            this.config,
            this.serviceName,
            `champion-rotations`,
            METHOD_NAMES.CHAMPION.GET_CHAMPION_ROTATIONS,
            'GET',
            this.limiter,
        )
    }
}

export default ChampionRotationEndpoint
