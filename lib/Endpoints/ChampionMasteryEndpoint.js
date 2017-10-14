import Endpoint from 'Endpoint';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class ChampionMasteryEndpoint extends Endpoint {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);
    this.list = this.list.bind(this);
    this.totalScore = this.totalScore.bind(this);

    this.serviceName = 'champion-mastery';
  }

  get(summonerID) {
    const self = this;
    return function(championID) {
      return new Request(
        self.config,
        self.serviceName,
        `champion-masteries/by-summoner/${summonerID}/by-champion/${championID}`,
        METHOD_NAMES.CHAMPION_MASTERY.GET_CHAMPION_MASTERY,
      );
    };
  }

  list(val) {
    return new Request(
      this.config,
      this.serviceName,
      `champion-masteries/by-summoner/${val}`,
      METHOD_NAMES.CHAMPION_MASTERY.GET_ALL_CHAMPION_MASTERIES,
    );
  }

  totalScore(val) {
    return new Request(
      this.config,
      this.serviceName,
      `scores/by-summoner/${val}`,
      METHOD_NAMES.CHAMPION_MASTERY.GET_CHAMPION_MASTERY_SCORE,
    );
  }
}

export default ChampionMasteryEndpoint;
