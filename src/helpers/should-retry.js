// @flow

import RESPONSE_CODES from '../constants/response-codes'

const ISE = RESPONSE_CODES.INTERNAL_SERVICE_ERROR
const RLE = RESPONSE_CODES.RATE_LIMIT_EXCEEDED

const shouldRetry = (code: number): boolean =>
    code >= ISE || code === RLE

export default shouldRetry