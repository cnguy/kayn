import StaticSuperclass from './StaticSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class StaticTarballLinksEndpoint extends StaticSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.get = this.get.bind(this)

        this.resourceName = 'tarball-links'

        this.limiter = limiter
    }

    /**
     * Retrieves full tarball link.
     *
     * @deprecated
     *
     * Implements GET `/lol/static-data/v3/tarball-links`.
     */
    get() {
        console.warn(
            'Deprecated method. Static endpoints will be removed on August 27th.',
        )
        return new Request(
            this.config,
            this.serviceName,
            this.resourceName,
            METHOD_NAMES.STATIC.GET_TARBALL_LINK,
            'GET',
            this.limiter,
        )
    }
}

export default StaticTarballLinksEndpoint
