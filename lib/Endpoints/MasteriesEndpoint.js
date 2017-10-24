import PlatformSuperclass from './PlatformSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class MasteriesEndpoint extends PlatformSuperclass {
  constructor(config, limiter) {
    super();

    this.config = config;

    this.by = {
      summonerID: this.summonerID.bind(this),
    };

    this.limiter = limiter;
  }

  /**
   * Get mastery pages for a given summoner ID.
   * 
   * Implements /lol/platform/v3/masteries/by-summoner/{summonerId}.
   *  
   * @param {number} summonerID - The ID of the summoner. 
   */
  summonerID(summonerID) {
    return new Request(
      this.config,
      this.serviceName,
      `masteries/by-summoner/${summonerID}`,
      METHOD_NAMES.MASTERIES.GET_MASTERY_PAGES_BY_SUMMONER_ID,
      'GET',
      this.limiter,
    );
  }
}

export default MasteriesEndpoint;
