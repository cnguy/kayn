import DDragonRequest, {
    DDragonRequestTypes,
} from 'RequestClient/DDragonRequest'
import METHOD_NAMES from 'Enums/method-names'

class DDragonItemEndpoint {
    constructor(config) {
        this.config = config

        this.list = this.list.bind(this)
    }

    list() {
        return new DDragonRequest(
            this.config,
            'item.json',
            DDragonRequestTypes.CDN.DATA,
            METHOD_NAMES.DDRAGON.ITEM_LIST,
        )
    }
}

export default DDragonItemEndpoint
