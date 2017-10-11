import Endpoint from 'Endpoint';
import Request from 'RequestClient/Request';

class ChampionEndpoint extends Endpoint {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);
    this.list = this.list.bind(this);

    this.resourceName = 'platform';
  }

  get(val) {
    return new Request(this.config, this.resourceName, `champions/${val}`);
  }

  list() {
    return new Request(this.config, this.resourceName, `champions`);
  }
}

export default ChampionEndpoint;
