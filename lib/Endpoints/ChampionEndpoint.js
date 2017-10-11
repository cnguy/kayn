import PlatformSuperclass from './PlatformSuperclass';
import Request from 'RequestClient/Request';

class ChampionEndpoint extends PlatformSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);
    this.list = this.list.bind(this);

    this.serviceName = 'platform';
  }

  get(val) {
    return new Request(this.config, this.serviceName, `champions/${val}`);
  }

  list() {
    return new Request(this.config, this.serviceName, `champions`);
  }
}

export default ChampionEndpoint;
