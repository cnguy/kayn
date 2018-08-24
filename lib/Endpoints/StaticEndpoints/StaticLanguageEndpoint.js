import StaticSuperclass from './StaticSuperclass'
import Request from 'RequestClient/Request'
import METHOD_NAMES from 'Enums/method-names'

class StaticLanguageEndpoint extends StaticSuperclass {
    constructor(config, limiter) {
        super()

        this.config = config

        this.list = this.list.bind(this)

        this.resourceName = 'languages'

        this.limiter = limiter
    }

    /**
     * Retrieves supported languages data.
     *
     * @deprecated
     * 
     * Implements GET `/lol/static-data/v3/languages`.
     */
    list() {
        console.warn('Deprecated method. Static endpoints will be removed on August 27th.')
        return new Request(
            this.config,
            this.serviceName,
            this.resourceName,
            METHOD_NAMES.STATIC.GET_LANGUAGES,
            'GET',
            this.limiter,
        )
    }
}

export default StaticLanguageEndpoint
