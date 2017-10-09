require('dotenv').config();

import ParameterHelper from './Utils/ParameterHelper';
import Errors from './Errors';

import ChampionMasteryEndpoint from './Endpoints/ChampionMasteryEndpoint';
import MatchEndpoint from './Endpoints/MatchEndpoint/MatchEndpoint';
import MatchlistEndpoint from './Endpoints/MatchEndpoint/MatchlistEndpoint';
import SummonerEndpoint from './Endpoints/SummonerEndpoint';

const defaultConfig = {
  region: 'na', // default region to be used if not passed in
  debugOptions: {
    isEnabled: false,
    showKey: false,
    showHeaders: true,
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    timeout: 3000,
  },
  cacheOptions: {
    constructor: null,
    ttls: {},
  },
};

class Kayn {
  constructor(key = process.env.RIOT_LOL_API_KEY, config = defaultConfig) {
    if (!ParameterHelper.isKeyValid(key)) {
      throw new Error('Failed to initialize Kayn');
    }

    this.config = {
      ...config,
      key,
    };

    // Set up interfaces
    this.ChampionMastery = new ChampionMasteryEndpoint(this.config);
    this.Match = new MatchEndpoint(this.config);
    this.Matchlist = new MatchlistEndpoint(this.config);
    this.Summoner = new SummonerEndpoint(this.config);
  }

  getConfig() {
    return this.config;
  }

  flushCache() {}

  enableCaching() {}
}

export default Kayn;
