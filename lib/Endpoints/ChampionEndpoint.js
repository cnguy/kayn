import PlatformSuperclass from './PlatformSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class ChampionEndpoint extends PlatformSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.get = this.get.bind(this)
        this.list = this.list.bind(this)

        this.serviceName = 'platform'

        this.limiter = limiter
    }

    /**
     * Retrieve champion by ID.
     *
     * @deprecated Deprecated on Monday, October 15, 2018.
     *
     * Implements GET `/lol/platform/v3/champions/{id}`.
     *
     * @param {number} championID - The ID of the champion.
     */
    get(championID) {
        console.warn(
            'Deprecated method. Static endpoints will be removed on October 15th.',
        )
        return new Request(
            this.config,
            this.serviceName,
            `champions/${championID}`,
            METHOD_NAMES.CHAMPION.GET_CHAMPION_BY_ID,
            'GET',
            this.limiter,
        )
    }

    /**
     * Retrieve all champions.
     *
     * @deprecated Deprecated on Monday, October 15, 2018.
     *
     * Implements GET `/lol/platform/v3/champions`.
     */
    list() {
        console.warn(
            'Deprecated method. Static endpoints will be removed on October 15th.',
        )
        return new Request(
            this.config,
            this.serviceName,
            `champions`,
            METHOD_NAMES.CHAMPION.GET_CHAMPIONS,
            'GET',
            this.limiter,
        )
    }
}

export default ChampionEndpoint
