'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SummonerEndpoint = require('./SummonerEndpoint.js');

Object.keys(_SummonerEndpoint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _SummonerEndpoint[key];
    }
  });
});