import LeagueSuperclass from './LeagueSuperclass';
import Request from 'RequestClient/Request';

class LeagueEndpoint extends LeagueSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.leagues = this.leagues.bind(this);
    this.positions = this.positions.bind(this);
  }

  leagues(summonerID) {
    return new Request(
      this.config,
      this.resourceName,
      `leagues/by-summoner/${summonerID}`,
    );
  }

  positions(summonerID) {
    return new Request(
      this.config,
      this.resourceName,
      `positions/by-summoner/${summonerID}`,
    );
  }
}

export default LeagueEndpoint;
