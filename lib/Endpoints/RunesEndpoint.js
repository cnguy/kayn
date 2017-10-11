import PlatformSuperclass from './PlatformSuperclass';
import Request from 'RequestClient/Request';

class RunesEndpoint extends PlatformSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);
  }

  get(summonerID) {
    return new Request(
      this.config,
      this.serviceName,
      `runes/by-summoner/${summonerID}`,
    );
  }
}

export default RunesEndpoint;
