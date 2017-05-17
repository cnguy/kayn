import responseCodes from '../constants/response-codes-to-messages'

const getResponseMessage = code => responseCodes[code] || ''

export default getResponseMessage