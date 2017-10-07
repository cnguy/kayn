import lib from './lib/Kayn';

module.exports = key => apiLimits => {
  return new lib(key, apiLimits);
};
