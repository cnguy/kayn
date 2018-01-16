import LeagueSuperclass from './LeagueSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class ChallengerEndpoint extends LeagueSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.list = this.list.bind(this)

        this.limiter = limiter
    }

    /**
     * Get the challenger league for given queue.
     *
     * Implements GET `/lol/league/v3/challengerleagues/by-queue/{queue}`.
     *
     * @param {string} queueName - The type of queue (e.g. 'RANKED_SOLO_5x5').
     */
    list(queueName) {
        return new Request(
            this.config,
            this.serviceName,
            `challengerleagues/by-queue/${queueName}`,
            METHOD_NAMES.LEAGUE.GET_CHALLENGER_LEAGUE,
            'GET',
            this.limiter,
        )
    }
}

export default ChallengerEndpoint
