import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticMapEndpoint extends StaticSuperclass {
  constructor(config, limiter) {
    super();

    this.config = config;

    this.get = this.get.bind(this);

    this.resourceName = 'maps';

    this.limiter = limiter;
  }

  /**
   * Retrieve map data.
   */
  get() {
    return new Request(
      this.config,
      this.serviceName,
      this.resourceName,
      METHOD_NAMES.STATIC.GET_MAP_DATA,
      'GET',
      this.limiter,
    );
  }
}

export default StaticMapEndpoint;
