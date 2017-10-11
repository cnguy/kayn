import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';

class StaticProfileIconEndpoint extends StaticSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);

    this.resourceName = 'profile-icons';
  }

  /**
   * Retrieve profile icons.
   */
  list() {
    return new Request(this.config, this.serviceName, this.resourceName);
  }
}

export default StaticProfileIconEndpoint;
