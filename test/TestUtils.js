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

// Kayn normally initializes some default config. However, for tests, we hav eto explicit because
// there is no `kayn` object to initialize stuffs, and so we'll end up with a bunch of undefineds if we don't pass
// in what we want to test. :P
const defaultConfig = {
    region: 'na',
    apiURLPrefix: 'https://%s.api.riotgames.com',
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
