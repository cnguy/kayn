import StaticSuperclass from './StaticSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class StaticRealmEndpoint extends StaticSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.get = this.get.bind(this)

        this.resourceName = 'realms'

        this.limiter = limiter
    }

    /**
     * Retrieve realm data.
     *
     * @deprecated
     *
     * Implements GET `/lol/static-data/v3/realms`.
     */
    get() {
        console.warn(
            'Deprecated method. Static endpoints will be removed on August 27th.',
        )
        return new Request(
            this.config,
            this.serviceName,
            this.resourceName,
            METHOD_NAMES.STATIC.GET_REALM,
            'GET',
            this.limiter,
        )
    }
}

export default StaticRealmEndpoint
