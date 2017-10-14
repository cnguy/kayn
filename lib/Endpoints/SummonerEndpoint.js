import Endpoint from '../Endpoint';
import Request from '../RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class SummonerEndpoint extends Endpoint {
  constructor(config) {
    super();

    this.config = config;

    this.by = {
      name: this.summonerName.bind(this),
      id: this.summonerID.bind(this),
      accountID: this.accountID.bind(this),
    };

    this.serviceName = 'summoner';
  }

  summonerName(val) {
    return new Request(
      this.config,
      this.serviceName,
      `summoners/by-name/${val}`,
      METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_NAME,
    );
  }

  summonerID(val) {
    return new Request(
      this.config,
      this.serviceName,
      `summoners/${val}`,
      METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_ID,
    );
  }

  accountID(val) {
    return new Request(
      this.config,
      this.serviceName,
      `summoners/by-account/${val}`,
      METHOD_NAMES.SUMMONER.GET_BY_ACCOUNT_ID,
    );
  }
}

export default SummonerEndpoint;
