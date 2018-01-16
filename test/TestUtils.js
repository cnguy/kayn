const {
    Kayn,
    REGIONS,
    METHOD_NAMES,
    BasicJSCache,
    RedisCache,
} = require('../lib')

const kayn = Kayn()({
    debugOptions: {
        isEnabled: true,
        showKey: true,
    },
})

const defaultConfig = {
    region: 'na',
    debugOptions: {
        isEnabled: true,
        showKey: false,
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 1000,
    },
    cacheOptions: {
        cache: null,
        ttls: {},
    },
}

export default {
    kaynInstance: {
        kayn,
        REGIONS,
        METHOD_NAMES,
        BasicJSCache,
        RedisCache,
    },
    defaultConfig,
}
