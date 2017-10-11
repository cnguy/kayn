import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';

class StaticVersionEndpoint extends StaticSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);

    this.resourceName = 'versions';
  }

  /**
   * Retrieve version data.
   */
  list() {
    return new Request(this.config, this.serviceName, this.resourceName);
  }
}

export default StaticVersionEndpoint;
