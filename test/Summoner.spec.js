const chai = require('chai');

const { expect, should, assert } = chai;

const TestUtils = require('./TestUtils');

const { kayn, REGIONS, METHOD_TYPES } = TestUtils.getKaynInstance;
const mocks = require('./mocks');

describe('Summoner', function() {
  this.timeout(0);

  describe('.by.name', function() {
    it('should work', async function() {
      const summoner = await kayn.Summoner.by.name(
        mocks.summoner.Contractz.name,
      );
      expect(summoner.name).to.equal(mocks.summoner.Contractz.name);
      expect(summoner.id).to.equal(mocks.summoner.Contractz.id);
    });
  });
});
