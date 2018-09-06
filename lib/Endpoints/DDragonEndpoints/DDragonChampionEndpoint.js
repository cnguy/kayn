import DDragonRequest, {
    DDragonRequestTypes,
} from 'RequestClient/DDragonRequest'
import METHOD_NAMES from 'Enums/method-names'

class DDragonChampionEndpoint {
    constructor(config) {
        this.config = config

        this.get = this.get.bind(this)
        this.list = this.list.bind(this)
        this.listFull = this.listFull.bind(this)
        this.Helpers = {
            getDataById: this.getDataById.bind(this),
            getDataByIdWithParentAsId: this.getDataByIdWithParentAsId.bind(
                this,
            ),
        }
    }

    get(championName) {
        return new DDragonRequest(
            this.config,
            `champion/${championName}.json`,
            DDragonRequestTypes.CDN.DATA,
            METHOD_NAMES.DDRAGON.CHAMPION_GET,
        )
    }

    list() {
        return new DDragonRequest(
            this.config,
            'champion.json',
            DDragonRequestTypes.CDN.DATA,
            METHOD_NAMES.DDRAGON.CHAMPION_LIST,
        )
    }

    // Own method to make it explicit that they are cached differently.
    listFull() {
        return new DDragonRequest(
            this.config,
            'championFull.json',
            DDragonRequestTypes.CDN.DATA,
            METHOD_NAMES.DDRAGON.CHAMPION_LIST_FULL,
        )
    }

    getDataById(championName) {
        return new DDragonRequest(
            this.config,
            `champion/${championName}.json`,
            DDragonRequestTypes.CDN.DATA,
            METHOD_NAMES.DDRAGON.CHAMPION_GET_DATA_BY_ID,
            ({ data, ...rest }) => {
                return {
                    ...rest,
                    data: transform(ID_WITH_KEY, data),
                }
            },
        )
    }

    getDataByIdWithParentAsId(championName) {
        return new DDragonRequest(
            this.config,
            `champion/${championName}.json`,
            DDragonRequestTypes.CDN.DATA,
            METHOD_NAMES.DDRAGON.CHAMPION_GET_DATA_BY_ID_PARENT_TOO,
            ({ data, ...rest }) => {
                return {
                    ...rest,
                    data: transform(ID_WITH_KEY_AND_PARENT_AS_ID, data),
                }
            },
        )
    }

    listById() {}
    listByIdWithParentAsIdToo() {}

    listFullById() {}
    listFullByIdWithParentAsIdToo() {}
}

const swapIdAndKey = data => ({ ...data, id: data.key, key: data.id })
const makeParentId = data => ({
    [data.key]: { ...data, id: data.key, key: data.id },
})

const ID_WITH_KEY = 'id_with_key'
const ID_WITH_KEY_AND_PARENT_AS_ID = 'id_with_key_and_parent_as_id'

const transform = (type, data) => {
    const nameKey = Object.keys(data)
    // There is only 1 key (which is the name).
    const object = data[nameKey]
    const fn = {
        [ID_WITH_KEY]: {
            [nameKey]: swapIdAndKey(object),
        },
        [ID_WITH_KEY_AND_PARENT_AS_ID]: makeParentId(object),
    }[type]
    return fn
}

export default DDragonChampionEndpoint
