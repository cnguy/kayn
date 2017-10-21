import { expect, should, assert } from 'chai';

import TestUtils from '../../TestUtils';
const { kaynInstance, defaultConfig } = TestUtils;

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance;
import SummonerEndpoint from '../../../dist/lib/Endpoints/SummonerEndpoint';
import mocks from '../../mocks';

describe('SummonerEndpoint', function() {
  this.timeout(0);

  beforeEach(function() {
    this.Summoner = new SummonerEndpoint(defaultConfig);
  });

  describe('.by.name', function() {
    it('should have the correct payload #1', function() {
      const { payload } = this.Summoner.by.name(mocks.summoner.Contractz.name);
      expect(payload).to.deep.equal({
          method: 'GET',
          serviceName: 'summoner',
          endpoint: 'summoners/by-name/Contractz',
          query: [],
          region: '',
      });
    });
  });
});
