const API_HOST = 'api.riotgames.com';
const API_VERSION = 'v3';

const createRequestURL = (platformID, resourceName, endpoint) =>
  `https://${platformID}.${API_HOST}/lol/${resourceName}/${API_VERSION}/${endpoint}`;

const createFullURL = (platformID, resourceName, endpoint, key) => {
  const requestURL = createRequestURL(platformID, resourceName, endpoint);
  return requestURL + getAPIKey(requestURL, key);
};

const getAPIKey = (url, key) => `${getSeparator(url)}api_key=${key}`;

const getSeparator = url => '?'; // @todo

export default {
  createRequestURL,
  createFullURL,
};
