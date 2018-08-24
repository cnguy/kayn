import DDragonRequest, {
    DDragonRequestTypes,
} from 'RequestClient/DDragonRequest'
import METHOD_NAMES from 'Enums/method-names'

class DDragonLanguageEndpoint {
    constructor(config) {
        this.config = config

        this.list = this.list.bind(this)
    }

    list() {
        return new DDragonRequest(
            this.config,
            'languages.json',
            DDragonRequestTypes.CDN.BASE,
            METHOD_NAMES.DDRAGON.LANGUAGE_LIST,
        )
    }
}

export default DDragonLanguageEndpoint
