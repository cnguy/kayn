import DDragonRequest, {
    DDragonRequestTypes,
} from 'RequestClient/DDragonRequest'
import METHOD_NAMES from 'Enums/method-names'

class DDragonSummonerSpellEndpooint {
    constructor(config) {
        this.config = config

        this.get = this.get.bind(this)
    }

    get() {
        return new DDragonRequest(
            this.config,
            '',
            DDragonRequestTypes.CDN.TARBALL,
        )
    }
}

export default DDragonSummonerSpellEndpooint
