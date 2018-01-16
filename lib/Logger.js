const loggerPrefix = 'kayn'
const loggerFactory = namespace =>
    require('debug')(`${loggerPrefix}:${namespace}`)
const initLogger = loggerFactory('init')
const requestLoggerFactory = namespace => loggerFactory(`request:${namespace}`)
const requestIncomingLoggerFactory = namespace =>
    requestLoggerFactory(`incoming:${namespace}`)
const requestSuccessLogger = requestIncomingLoggerFactory('success')
const requestErrorLogger = requestIncomingLoggerFactory('error')
const cacheLoggerFactory = namespace => loggerFactory(`cache:${namespace}`)
const cacheSetLogger = cacheLoggerFactory('set')
const cacheGetLogger = cacheLoggerFactory('get')
const requestOutgoingLogger = requestLoggerFactory('outgoing')

const setupLoggers = config => {
    config.debugOptions.loggers.initLogger = initLogger
    config.debugOptions.loggers.request = {
        incoming: {
            success: requestSuccessLogger,
            failure: requestErrorLogger,
        },
        outgoing: requestOutgoingLogger,
    }
    config.debugOptions.loggers.cache = {
        set: cacheSetLogger,
        get: cacheGetLogger,
    }
    initLogger('Initialized loggers.')
}

export default setupLoggers
