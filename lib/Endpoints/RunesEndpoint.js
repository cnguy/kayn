import PlatformSuperclass from './PlatformSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class RunesEndpoint extends PlatformSuperclass {
  constructor(config, limiter) {
    super();

    this.config = config;

    this.by = {
      summonerID: this.summonerID.bind(this),
    };

    this.limiter = limiter;
  }

  /**
   * Get rune pages for a given summoner ID.
   * 
   * Implements /lol/platform/v3/runes/by-summoner/{summonerId}.
   *  
   * @param {number} summonerID - The ID of the summoner. 
   */
  summonerID(summonerID) {
    return new Request(
      this.config,
      this.serviceName,
      `runes/by-summoner/${summonerID}`,
      METHOD_NAMES.RUNES.GET_RUNE_PAGES_BY_SUMMONER_ID,
      'GET',
      this.limiter,
    );
  }
}

export default RunesEndpoint;
