import DDragonRequest, {
    DDragonRequestTypes,
} from 'RequestClient/DDragonRequest'
import METHOD_NAMES from 'Enums/method-names'

class DDragonVersionEndpoint {
    constructor(config) {
        this.config = config

        this.list = this.list.bind(this)
    }

    list() {
        return new DDragonRequest(
            this.config,
            'versions.json',
            DDragonRequestTypes.API,
            METHOD_NAMES.DDRAGON.VERSION_LIST,
        )
    }
}

export default DDragonVersionEndpoint
