import SpectatorSuperclass from './SpectatorSuperclass';
import Request from 'RequestClient/Request';

class CurrentGameEndpoint extends SpectatorSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.by = {
      id: this.id.bind(this),
    };
  }

  id(summonerID) {
    return new Request(
      this.config,
      this.serviceName,
      `active-games/by-summoner/${summonerID}`,
    );
  }
}

export default CurrentGameEndpoint;
