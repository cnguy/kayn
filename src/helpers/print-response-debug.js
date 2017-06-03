const printResponseDebug = (response, statusMessage, reqUrl, headers) => {
  console.log(statusMessage, '@', reqUrl)

  if (headers) {
    console.log({
      'x-rate-limit-type': response.headers['x-rate-limit-type'],
      'x-app-rate-limit-count': response.headers['x-app-rate-limit-count'],
      'x-method-rate-limit-count': response.headers['x-method-rate-limit-count'],
      'x-rate-limit-count': response.headers['x-rate-limit-count'],
      'retry-after': response.headers['retry-after']
    })
    console.log()
  }
}

export default printResponseDebug