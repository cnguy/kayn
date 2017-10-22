import { expect, should, assert } from 'chai';

import TestUtils from '../../TestUtils';
const { kaynInstance, defaultConfig } = TestUtils;

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance;
import RunesEndpoint from '../../../lib/Endpoints/RunesEndpoint';
import mocks from '../../mocks';

describe('RunesEndpoint', function() {
  this.timeout(0);

  beforeEach(function() {
    this.Runes = new RunesEndpoint(defaultConfig);
  });

  describe('.by.summonerID', function() {
    it('should have the correct payload #1', function() {
      const { Contractz } = mocks.summoner;
      const { payload } = this.Runes.by.summonerID(Contractz.id);
      expect(payload).to.deep.equal({
        method: 'GET',
        serviceName: 'platform',
        endpoint: `runes/by-summoner/${Contractz.id}`,
        query: [],
        region: '',
      });
    });
  });
});
