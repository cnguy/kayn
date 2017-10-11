import PlatformSuperclass from './PlatformSuperclass';
import Request from 'RequestClient/Request';

class MasteriesEndpoint extends PlatformSuperclass {
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
      `masteries/by-summoner/${summonerID}`,
    );
  }
}

export default MasteriesEndpoint;
