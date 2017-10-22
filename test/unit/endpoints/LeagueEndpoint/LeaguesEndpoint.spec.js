import { expect, should, assert } from 'chai';

import TestUtils from '../../../TestUtils';
const { kaynInstance, defaultConfig } = TestUtils;

const { kayn, REGIONS, METHOD_TYPES } = kaynInstance;
import LeaguesEndpoint from '../../../../lib/Endpoints/LeagueEndpoint/LeaguesEndpoint';
import mocks from '../../../mocks';

describe('LeaguesEndpoint', function() {
  this.timeout(0);

  beforeEach(function() {
    this.Leagues = new LeaguesEndpoint(defaultConfig);
  });

  describe('.by.summonerID', function() {
    it('should have the correct payload #1', function() {
      const { Contractz } = mocks.summoner;
      const { payload } = this.Leagues.by.summonerID(Contractz.id);
      expect(payload).to.deep.equal({
        method: 'GET',
        serviceName: 'league',
        endpoint: `leagues/by-summoner/${Contractz.id}`,
        query: [],
        region: '',
      });
    });
  });
});
