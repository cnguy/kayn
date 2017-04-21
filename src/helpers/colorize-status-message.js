const chalk = require('chalk')

import getResponseMessage from './get-response-message'

const statusCodeBisector = [200, 400, 500]

const colorizeStatusMessage = statusCode => {
  if (statusCode >= statusCodeBisector[0] && statusCode < statusCodeBisector[1])
    return chalk.green(statusCode)
  else if (statusCode >= statusCodeBisector[1] && statusCode < statusCodeBisector[2])
    return chalk.red(`${statusCode} ${getResponseMessage(statusCode)}`)
  else
    return chalk.bold.red(`${statusCode} ${getResponseMessage(statusCode)}`)
}

export default colorizeStatusMessage