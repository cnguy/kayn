'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var API_HOST = 'api.riotgames.com';
var API_VERSION = 'v3';

var createRequestURL = function createRequestURL(platformID, resourceName, endpoint) {
  return 'https://' + platformID + '.' + API_HOST + '/lol/' + resourceName + '/' + API_VERSION + '/' + endpoint;
};

var createFullURL = function createFullURL(platformID, resourceName, endpoint, key) {
  var requestURL = createRequestURL(platformID, resourceName, endpoint);
  return requestURL + getAPIKey(requestURL, key);
};

var getAPIKey = function getAPIKey(url, key) {
  return getSeparator(url) + 'api_key=' + key;
};

var getSeparator = function getSeparator(url) {
  return '?';
}; // @todo

exports.default = {
  createRequestURL: createRequestURL,
  createFullURL: createFullURL
};