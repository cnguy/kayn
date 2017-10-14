import PlatformSuperclass from './PlatformSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class RunesEndpoint extends PlatformSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.by = {
      summonerID: this.summonerID.bind(this),
    };
  }

  summonerID(summonerID) {
    return new Request(
      this.config,
      this.serviceName,
      `runes/by-summoner/${summonerID}`,
      METHOD_NAMES.RUNES.GET_RUNE_PAGES_BY_SUMMONER_ID,
    );
  }
}

export default RunesEndpoint;
