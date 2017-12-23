import { struct } from 'superstruct';

import METHOD_NAMES from 'Enums/method-names';

export const DEFAULT_KAYN_CONFIG = {
    region: 'na',
    debugOptions: {
        isEnabled: true,
        showKey: false,
        loggers: {},
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 1000,
        burst: false,
    },
    cacheOptions: {
        cache: null,
        ttls: {},
    },
};

const ttlsValidator = {};
Object.keys(METHOD_NAMES).forEach(s => {
    Object.keys(METHOD_NAMES[s]).forEach(
        t => (ttlsValidator[METHOD_NAMES[s][t]] = 'number?'),
    );
});

export const KAYN_CONFIG_STRUCT = struct({
    region: 'string',
    debugOptions: {
        isEnabled: 'boolean',
        showKey: 'boolean',
        loggers: 'any',
    },
    requestOptions: {
        shouldRetry: 'boolean',
        numberOfRetriesBeforeAbort: 'number',
        delayBeforeRetry: 'number',
        burst: 'boolean',
    },
    cacheOptions: {
        cache: 'any',
        ttls: ttlsValidator,
    },
    key: 'string',
});
