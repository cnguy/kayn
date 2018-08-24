import DDragonRequest, {
    DDragonRequestTypes,
} from 'RequestClient/DDragonRequest'
import METHOD_NAMES from 'Enums/method-names'

class DDragonLanguageStringEndpoint {
    constructor(config) {
        this.config = config

        this.list = this.list.bind(this)
    }

    list() {
        return new DDragonRequest(
            this.config,
            'language.json',
            DDragonRequestTypes.CDN.DATA,
            METHOD_NAMES.DDRAGON.LANGUAGE_STRING_LIST,
        )
    }
}

export default DDragonLanguageStringEndpoint
