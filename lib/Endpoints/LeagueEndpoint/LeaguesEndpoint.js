import LeagueSuperclass from './LeagueSuperclass';
import Request from 'RequestClient/Request';

class LeaguesEndpoint extends LeagueSuperclass {
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
      `leagues/by-summoner/${summonerID}`,
    );
  }
}

export default LeaguesEndpoint;
