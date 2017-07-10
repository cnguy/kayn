// @flow

import codeToMessage from '../constants/response-codes-to-messages'

const getResponseMessage = (code: number): string =>
    codeToMessage(code) || ''

export default getResponseMessage