import LeagueSuperclass from './LeagueSuperclass';
import Request from 'RequestClient/Request';

class LeaguePositionsEndpoint extends LeagueSuperclass {
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
      `positions/by-summoner/${summonerID}`,
    );
  }
}

export default LeaguePositionsEndpoint;
