import responseCodes from '../constants/response-codes'

const getResponseMessage = (code) => {
  const message = codes[code]

  if (!message) return
  return message
}

export default getResponseMessage