import DateTimeHelper from './DateTimeHelper';

const API_HOST = 'api.riotgames.com';
const API_VERSION = 'v3';

const createRequestURL = (platformID, resourceName, endpoint) =>
  `https://${platformID}.${API_HOST}/lol/${resourceName}/${API_VERSION}/${endpoint}`;

const getURLWithKey = (platformID, resourceName, endpoint, key) => {
  const requestURL = createRequestURL(platformID, resourceName, endpoint);
  return requestURL + getAPIKey(requestURL, key);
};

const getAPIKey = (url, key) =>
  `${url.lastIndexOf('?') === -1 ? '?' : '&'}api_key=${key ? key : ''}`;

const appendKey = (str, key, value) =>
  str + (str ? '&' : '') + `${key}=${value}`;

const arrayToOptions = array =>
  array.reduce((final, curr) => ({ ...final, ...curr }), {});

const stringifyOptions = (options, endUrl) => {
  let stringifiedOpts = '';

  for (const key of Object.keys(options)) {
    if (Array.isArray(options[key])) {
      for (const value of options[key]) {
        stringifiedOpts = appendKey(stringifiedOpts, key, value);
      }
    } else {
      if (DateTimeHelper.checkIfDateParam(key)) {
        options[key] = DateTimeHelper.getEpoch(options[key]);
      }
      stringifiedOpts = appendKey(stringifiedOpts, key, options[key]);
    }
  }

  return stringifiedOpts;
};

const getQueryParamString = arrayOfOpts => {
  const str = stringifyOptions(arrayToOptions(arrayOfOpts));
  return str ? `?${encodeURI(str)}` : '';
};

const getURLWithQuery = (region, resourceName, endpoint, queryArray) =>
  createRequestURL(region, resourceName, endpoint) +
  getQueryParamString(queryArray);

export default {
  createRequestURL,
  getURLWithKey,
  getURLWithQuery,
};
