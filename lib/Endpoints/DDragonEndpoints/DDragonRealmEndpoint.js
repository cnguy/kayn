import DDragonRequest, {
    DDragonRequestTypes,
} from 'RequestClient/DDragonRequest'
import METHOD_NAMES from 'Enums/method-names'

class DDragonRealmEndpoint {
    constructor(config) {
        this.config = config

        this.list = this.list.bind(this)
    }

    list(region) {
        return new DDragonRequest(
            this.config,
            `${region || this.config.region}.json`,
            DDragonRequestTypes.REALMS,
            METHOD_NAMES.DDRAGON.REALM_LIST,
        )
    }
}

export default DDragonRealmEndpoint
