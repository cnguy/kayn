import DDragonRequest, {
    DDragonRequestTypes,
} from 'RequestClient/DDragonRequest'
import METHOD_NAMES from 'Enums/method-names'

class DDragonMapEndpoint {
    constructor(config) {
        this.config = config

        this.list = this.list.bind(this)
    }

    list() {
        return new DDragonRequest(
            this.config,
            'map.json',
            DDragonRequestTypes.CDN.DATA,
            METHOD_NAMES.DDRAGON.MAP_LIST,
        )
    }
}

export default DDragonMapEndpoint
