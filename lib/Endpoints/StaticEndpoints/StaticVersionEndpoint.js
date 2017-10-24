import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticVersionEndpoint extends StaticSuperclass {
  constructor(config, limiter) {
    super();

    this.config = config;

    this.list = this.list.bind(this);

    this.resourceName = 'versions';

    this.limiter = limiter;
  }

  /**
   * Retrieve version data.
   */
  list() {
    return new Request(
      this.config,
      this.serviceName,
      this.resourceName,
      METHOD_NAMES.STATIC.GET_VERSIONS,
      'GET',
      this.limiter,
    );
  }
}

export default StaticVersionEndpoint;
