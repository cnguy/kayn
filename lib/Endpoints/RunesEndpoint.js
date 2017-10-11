import PlatformSuperclass from './PlatformSuperclass';
import Request from 'RequestClient/Request';

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
    );
  }
}

export default RunesEndpoint;
