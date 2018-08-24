import DDragonRequest, {
    DDragonRequestTypes,
} from 'RequestClient/DDragonRequest'
import METHOD_NAMES from 'Enums/method-names'

class DDragonProfileIconEndpoint {
    constructor(config) {
        this.config = config

        this.list = this.list.bind(this)
    }

    list() {
        return new DDragonRequest(
            this.config,
            'profileicon.json',
            DDragonRequestTypes.CDN.DATA,
            METHOD_NAMES.DDRAGON.PROFILE_ICON.LIST
        )
    }
}

export default DDragonProfileIconEndpoint
