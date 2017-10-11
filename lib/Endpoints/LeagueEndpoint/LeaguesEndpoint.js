import LeagueSuperclass from './LeagueSuperclass';
import Request from 'RequestClient/Request';

class LeaguesEndpoint extends LeagueSuperclass {
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
      `leagues/by-summoner/${summonerID}`,
    );
  }
}

export default LeaguesEndpoint;
