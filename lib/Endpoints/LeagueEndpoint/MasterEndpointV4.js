import LeagueSuperclass from './LeagueSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class MasterEndpointV4 extends LeagueSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.list = this.list.bind(this)

        this.limiter = limiter
    }

    /**
     * Get the challenger league for given queue.
     *
     * Implements GET `/lol/league/v4/masterleagues/by-queue/{queue}`.
     *
     * @param {string} queueName - The type of queue (e.g. 'RANKED_SOLO_5x5').
     */
    list(queueName) {
        return new Request(
            this.config,
            this.serviceName,
            `masterleagues/by-queue/${queueName}`,
            METHOD_NAMES.LEAGUE.GET_MASTER_LEAGUE_V4,
            'GET',
            this.limiter,
            null,
            false,
            4,
        )
    }
}

export default MasterEndpointV4
