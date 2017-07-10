// @flow

const responseStrings = {
  [200]: 'Success',
  [400]: 'Bad Request',
  [401]: 'Unauthorized',
  [403]: 'Forbidden',
  [404]: 'Data Not Found',
  [405]: 'Method not allowed',
  [415]: 'Unsupported Media Type',
  [429]: 'Rate Limit Exceeded',
  [500]: 'Internal Service Error',
  [503]: 'Service Unavailable',
  [504]: 'Gateway Timeout'
}

const get = (code: number): string => responseStrings[code]

export default get