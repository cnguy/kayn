'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isKeyValid = function isKeyValid(key) {
  return key && typeof key === 'string';
};
var areLimitsValid = function areLimitsValid(limits) {
  return limits && Array.isArray(limits) && limits.every(function (limit) {
    return typeof limit.count === 'number' && typeof limit.per === 'number';
  });
};

var ParameterHelper = {
  isKeyValid: isKeyValid,
  areLimitsValid: areLimitsValid
};

exports.default = ParameterHelper;