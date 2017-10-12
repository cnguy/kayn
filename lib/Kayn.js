require('dotenv').config();

import ParameterHelper from './Utils/ParameterHelper';
import Errors from './Errors';

import ChallengerEndpoint from './Endpoints/LeagueEndpoint/ChallengerEndpoint';
import ChampionEndpoint from './Endpoints/ChampionEndpoint';
import ChampionMasteryEndpoint from './Endpoints/ChampionMasteryEndpoint';
import CurrentGameEndpoint from './Endpoints/SpectatorEndpoint/CurrentGameEndpoint';
import FeaturedGamesEndpoint from './Endpoints/SpectatorEndpoint/FeaturedGamesEndpoint';
import LeaguePositionsEndpoint from './Endpoints/LeagueEndpoint/LeaguePositionsEndpoint';
import LeaguesEndpoint from './Endpoints/LeagueEndpoint/LeaguesEndpoint';
import MasterEndpoint from './Endpoints/LeagueEndpoint/MasterEndpoint';
import MasteriesEndpoint from './Endpoints/MasteriesEndpoint';
import MatchEndpoint from './Endpoints/MatchEndpoint/MatchEndpoint';
import MatchlistEndpoint from './Endpoints/MatchEndpoint/MatchlistEndpoint';
import RunesEndpoint from './Endpoints/RunesEndpoint';
import StaticChampionEndpoint from './Endpoints/StaticEndpoints/StaticChampionEndpoint';
import StaticItemEndpoint from './Endpoints/StaticEndpoints/StaticItemEndpoint';
import StaticLanguageStringsEndpoint from './Endpoints/StaticEndpoints/StaticLanguageStringsEndpoint';
import StaticLanguageEndpoint from './Endpoints/StaticEndpoints/StaticLanguageEndpoint';
import StaticMapEndpoint from './Endpoints/StaticEndpoints/StaticMapEndpoint';
import StaticMasteryEndpoint from './Endpoints/StaticEndpoints/StaticMasteryEndpoint';
import StaticProfileIconEndpoint from './Endpoints/StaticEndpoints/StaticProfileIconEndpoint';
import StaticRealmEndpoint from './Endpoints/StaticEndpoints/StaticRealmEndpoint';
import StaticRuneEndpoint from './Endpoints/StaticEndpoints/StaticRuneEndpoint';
import StaticSummonerSpellEndpoint from './Endpoints/StaticEndpoints/StaticSummonerSpellEndpoint.js';
import StaticVersionEndpoint from './Endpoints/StaticEndpoints/StaticVersionEndpoint';
import StatusEndpoint from './Endpoints/StatusEndpoint';
import SummonerEndpoint from './Endpoints/SummonerEndpoint';

const defaultConfig = {
  region: 'na', // default region to be used if not passed in
  debugOptions: {
    isEnabled: false,
    showKey: false,
    showHeaders: false,
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1000,
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
      ...defaultConfig,
      ...config,
      key,
    };

    // Set up interfaces
    this.Challenger = new ChallengerEndpoint(this.config);
    this.Champion = new ChampionEndpoint(this.config);
    this.ChampionMastery = new ChampionMasteryEndpoint(this.config);
    this.CurrentGame = new CurrentGameEndpoint(this.config);
    this.FeaturedGames = new FeaturedGamesEndpoint(this.config);
    this.LeaguePositions = new LeaguePositionsEndpoint(this.config);
    this.Leagues = new LeaguesEndpoint(this.config);
    this.Master = new MasterEndpoint(this.config);
    this.Masteries = new MasteriesEndpoint(this.config);
    this.Match = new MatchEndpoint(this.config);
    this.Matchlist = new MatchlistEndpoint(this.config);
    this.Runes = new RunesEndpoint(this.config);
    this.Static = {
      Champion: new StaticChampionEndpoint(this.config),
      Item: new StaticItemEndpoint(this.config),
      LanguageString: new StaticLanguageStringsEndpoint(this.config),
      Language: new StaticLanguageEndpoint(this.config),
      Map: new StaticMapEndpoint(this.config),
      Mastery: new StaticMasteryEndpoint(this.config),
      ProfileIcon: new StaticProfileIconEndpoint(this.config),
      Realm: new StaticRealmEndpoint(this.config),
      Rune: new StaticRuneEndpoint(this.config),
      SummonerSpell: new StaticSummonerSpellEndpoint(this.config),
      Version: new StaticVersionEndpoint(this.config),
    };
    this.Summoner = new SummonerEndpoint(this.config);
    this.Status = new StatusEndpoint(this.config);
  }

  getConfig() {
    return this.config;
  }

  flushCache() {}

  enableCaching() {}
}

export default Kayn;
