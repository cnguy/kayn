import StaticSuperclass from './StaticSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class StaticReforgedRunes extends StaticSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.list = this.list.bind(this)
        this.get = this.get.bind(this)

        this.resourceName = 'reforged-runes'

        this.limiter = limiter
    }

    /**
     * Retrieves reforged rune list.
     *
     * Implements GET `/lol/static-data/v3/reforged-runes`.
     */
    list() {
        return new Request(
            this.config,
            this.serviceName,
            this.resourceName,
            METHOD_NAMES.STATIC.GET_REFORGED_RUNE_LIST,
            'GET',
            this.limiter,
        )
    }

    /**
     * Retrieves reforged rune by ID.
     *
     * Implements GET `/lol/static-data/v3/reforged-runes/{id}`.
     *
     * @param {number} id - The ID of the rune.
     */

    get(id) {
        return new Request(
            this.config,
            this.serviceName,
            `${this.resourceName}/${id}`,
            METHOD_NAMES.STATIC.GET_REFORGED_RUNE_BY_ID,
            'GET',
            this.limiter,
        )
    }
}

export default StaticReforgedRunes
