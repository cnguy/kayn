import StaticSuperclass from './StaticSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class StaticReforgedRunePaths extends StaticSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.list = this.list.bind(this)
        this.get = this.get.bind(this)

        this.resourceName = 'reforged-rune-paths'

        this.limiter = limiter
    }

    /**
     * Retrieves reforged rune path list.
     *
     * @deprecated
     *
     * Implements GET `/lol/static-data/v3/reforged-rune-paths`.
     */
    list() {
        console.warn(
            'Deprecated method. Static endpoints will be removed on August 27th.',
        )
        return new Request(
            this.config,
            this.serviceName,
            this.resourceName,
            METHOD_NAMES.STATIC.GET_REFORGED_RUNE_PATH_LIST,
            'GET',
            this.limiter,
        )
    }

    /**
     * Retrieves reforged rune path by ID.
     *
     * Implements GET `/lol/static-data/v3/reforged-rune-paths/{id}`.
     *
     * @param {number} id - The ID of the rune.
     */

    get(id) {
        return new Request(
            this.config,
            this.serviceName,
            `${this.resourceName}/${id}`,
            METHOD_NAMES.STATIC.GET_REFORGED_RUNE_PATH_BY_ID,
            'GET',
            this.limiter,
        )
    }
}

export default StaticReforgedRunePaths
