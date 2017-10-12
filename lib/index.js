import lib from './Kayn';

module.exports = key => config => {
  return new lib(key, config);
};
