'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regions = require('../Enums/regions');

var _regions2 = _interopRequireDefault(_regions);

var _platformIds = require('../Enums/platform-ids');

var _platformIds2 = _interopRequireDefault(_platformIds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var asPlatformID = function asPlatformID(regionAbbr) {
  return _platformIds2.default[Object.keys(_regions2.default).filter(function (key) {
    return _regions2.default[key] === regionAbbr;
  })[0]];
};

var RegionHelper = {
  asPlatformID: asPlatformID
};

exports.default = RegionHelper;