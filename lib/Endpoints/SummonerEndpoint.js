import Endpoint from '../Endpoint';
import Request from '../RequestClient/Request';

class SummonerEndpoint extends Endpoint {
  constructor(config) {
    super();

    this.name = this.name.bind(this);
    this.id = this.id.bind(this);
    this.accountID = this.accountID.bind(this);

    this.config = config;

    this.by = {
      name: this.name,
      id: this.id,
      accountID: this.accountID,
    };

    this.serviceName = 'summoner';
  }

  name(val) {
    return new Request(
      this.config,
      this.serviceName,
      `summoners/by-name/${val}`,
      'GET',
    );
  }

  id(val) {
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
