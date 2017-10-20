const {
  Kayn,
  REGIONS,
  METHOD_TYPES,
  BasicJSCache,
  RedisCache,
} = require('../');

const kayn = Kayn()({
  debugOptions: {
    isEnabled: true,
  },
});

module.exports = {
  getKaynInstance: {
    kayn,
    REGIONS,
    METHOD_TYPES,
    BasicJSCache,
    RedisCache,
  },
};
