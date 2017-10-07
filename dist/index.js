'use strict';

var _Kayn = require('./lib/Kayn');

var _Kayn2 = _interopRequireDefault(_Kayn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (key) {
  return function (apiLimits) {
    return new _Kayn2.default(key, apiLimits);
  };
};