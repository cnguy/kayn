import { expect, should, assert } from 'chai';

import TestUtils from '../../TestUtils';
const { kaynInstance, defaultConfig } = TestUtils;

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance;
import MasteriesEndpoint from '../../../lib/Endpoints/MasteriesEndpoint';
import mocks from '../../mocks';

describe('MasteriesEndpoint', function() {
  this.timeout(0);

  beforeEach(function() {
    this.Masteries = new MasteriesEndpoint(defaultConfig);
  });

  describe('.by.summonerID', function() {
    it('should have the correct payload #1', function() {
      const { Contractz } = mocks.summoner;
      const { payload } = this.Masteries.by.summonerID(Contractz.id);
      expect(payload).to.deep.equal({
        method: 'GET',
        serviceName: 'platform',
        endpoint: `masteries/by-summoner/${Contractz.id}`,
        query: [],
        region: '',
      });
    });
  });
});
