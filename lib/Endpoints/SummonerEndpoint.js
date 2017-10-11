import Endpoint from '../Endpoint';
import Request from '../RequestClient/Request';

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
      'GET',
    );
  }

  summonerID(val) {
    return new Request(this.config, this.serviceName, `summoners/${val}`);
  }

  accountID(val) {
    return new Request(
      this.config,
      this.serviceName,
      `summoners/by-account/${val}`,
    );
  }
}

export default SummonerEndpoint;
