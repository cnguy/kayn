import Endpoint from 'Endpoint'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class StatusEndpoint extends Endpoint {
    constructor(config, limiter) {
        super()

        this.config = config

        this.get = this.get.bind(this)

        this.serviceName = 'status'

        this.limiter = limiter
    }

    /**
     * Get League of Legends status for the given shard.
     *
     * Implements GET `/lol/status/v3/shard-data`.
     */
    get() {
        return new Request(
            this.config,
            this.serviceName,
            'shard-data',
            METHOD_NAMES.LOL_STATUS.GET_SHARD_DATA,
            'GET',
            this.limiter,
        )
    }
}

export default StatusEndpoint
