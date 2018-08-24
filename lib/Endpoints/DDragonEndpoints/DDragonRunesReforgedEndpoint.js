import DDragonRequest, {
    DDragonRequestTypes,
} from 'RequestClient/DDragonRequest'
import METHOD_NAMES from 'Enums/method-names'

class DDragonRunesReforgedEndpoint {
    constructor(config) {
        this.config = config

        this.list = this.list.bind(this)
    }

    list() {
        return new DDragonRequest(
            this.config,
            'runesReforged.json',
            DDragonRequestTypes.CDN.DATA,
        )
    }
}

export default DDragonRunesReforgedEndpoint
