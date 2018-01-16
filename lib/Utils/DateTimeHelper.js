const checkIfDateParam = tag => tag === 'beginTime' || tag === 'endTime'

const getEpoch = time => {
    if (typeof time === 'string') {
        return new Date(0).setUTCMilliseconds(new Date(time))
    }
    if (typeof time === 'object') {
        return new Date(0).setUTCMilliseconds(time)
    }
    if (typeof time === 'number') {
        return time
    }
    return 0
}

export default {
    checkIfDateParam,
    getEpoch,
}
