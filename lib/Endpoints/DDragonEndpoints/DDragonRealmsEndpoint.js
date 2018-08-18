import DDragonRequest, {
    DDragonRequestTypes,
} from 'RequestClient/DDragonRequest'
import METHOD_NAMES from 'Enums/method-names'

class DDragonRealmsEndpoint {
    constructor(config) {
        this.config = config

        this.list = this.list.bind(this)
    }

    list(region) {
        return new DDragonRequest(
            this.config,
            `${region}.json`,
            DDragonRequestTypes.REALMS,
        )
    }
}

export default DDragonRealmsEndpoint
