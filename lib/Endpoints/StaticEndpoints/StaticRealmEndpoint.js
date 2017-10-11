import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';

class StaticRealmEndpoint extends StaticSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);

    this.resourceName = 'realms';
  }

  /**
   * Retrieve realm data.
   */
  list() {
    return new Request(this.config, this.serviceName, this.resourceName);
  }
}

export default StaticRealmEndpoint;
