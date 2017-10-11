import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';

class StaticMapEndpoint extends StaticSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);

    this.resourceName = 'maps';
  }

  /**
   * Retrieve map data.
   */
  list() {
    return new Request(this.config, this.serviceName, this.resourceName);
  }
}

export default StaticMapEndpoint;
