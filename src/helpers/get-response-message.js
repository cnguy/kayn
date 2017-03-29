import responseCodes from '../constants/response-codes'

const getResponseMessage = (code) => {
  const message = responseCodes[code]
  if (!message) return
  return message
}

export default getResponseMessage