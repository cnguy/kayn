// @flow
// $FlowFixMe
const chalk = require('chalk')

import getResponseMessage from './get-response-message'

const statusCodeBisector = [200, 400, 500]

const prettifyStatusMessage = (statusCode: number): string => {
  const capsMessage = getResponseMessage(statusCode).toUpperCase()
  const msg = `${statusCode} ${capsMessage}`

  if (statusCode >= statusCodeBisector[0] && statusCode < statusCodeBisector[1])
    return chalk.green(statusCode)
  else if (statusCode >= statusCodeBisector[1] && statusCode < statusCodeBisector[2])
    return chalk.red(msg)
  else
    return chalk.bold.red(msg)
}

export default prettifyStatusMessage