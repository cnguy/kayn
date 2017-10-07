'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ParameterHelper = require('./Utils/ParameterHelper');

var _ParameterHelper2 = _interopRequireDefault(_ParameterHelper);

var _Errors = require('./Errors');

var _Errors2 = _interopRequireDefault(_Errors);

var _SummonerEndpoint = require('./Endpoints/SummonerEndpoint');

var _SummonerEndpoint2 = _interopRequireDefault(_SummonerEndpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('dotenv').config();

var defaultConfig = {
  region: 'na', // default region to be used if not passed in
  debugOptions: {
    isEnabled: false,
    showKey: false,
    showHeaders: true
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    timeout: 3000
  },
  cacheOptions: {
    constructor: null,
    ttls: {}
  }
};

var Kayn = function () {
  function Kayn() {
    var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.env.RIOT_LOL_API_KEY;
    var apiLimits = arguments[1];
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultConfig;

    _classCallCheck(this, Kayn);

    if (!_ParameterHelper2.default.isKeyValid(key) || !_ParameterHelper2.default.areLimitsValid(apiLimits)) {
      throw new Error('Failed to initialize Kayn');
    }

    this.config = _extends({}, config, {
      key: key
    });

    // Set up interfaces
    this.Summoner = new _SummonerEndpoint2.default(this.config);
  }

  _createClass(Kayn, [{
    key: 'getConfig',
    value: function getConfig() {
      return this.config;
    }
  }, {
    key: 'flushCache',
    value: function flushCache() {}
  }, {
    key: 'enableCaching',
    value: function enableCaching() {}
  }]);

  return Kayn;
}();

exports.default = Kayn;