import LeagueSuperclass from './LeagueSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

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
      METHOD_NAMES.LEAGUE.GET_ALL_LEAGUES_FOR_SUMMONER,
    );
  }
}

export default LeaguesEndpoint;
