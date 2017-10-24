import LeagueSuperclass from './LeagueSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class LeaguesEndpoint extends LeagueSuperclass {
  constructor(config, limiter) {
    super();

    this.config = config;

    this.by = {
      summonerID: this.summonerID.bind(this),
    };

    this.limiter = limiter;
  }

  /**
   * Get leagues in all queues for a given summoner ID.
   * 
   * Implements /lol/league/v3/leagues/by-summoner/{summonerId}.
   *  
   * @param {number} summonerID - The ID of the summoner. 
   */
  summonerID(summonerID) {
    return new Request(
      this.config,
      this.serviceName,
      `leagues/by-summoner/${summonerID}`,
      METHOD_NAMES.LEAGUE.GET_ALL_LEAGUES_FOR_SUMMONER,
      'GET',
      this.limiter,
    );
  }
}

export default LeaguesEndpoint;
