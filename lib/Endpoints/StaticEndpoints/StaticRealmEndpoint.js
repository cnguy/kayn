import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticRealmEndpoint extends StaticSuperclass {
  constructor(config, limiter) {
    super();

    this.config = config;

    this.get = this.get.bind(this);

    this.resourceName = 'realms';

    this.limiter = limiter;
  }

  /**
   * Retrieve realm data.
   */
  get() {
    return new Request(
      this.config,
      this.serviceName,
      this.resourceName,
      METHOD_NAMES.STATIC.GET_REALM,
      'GET',
      this.limiter,
    );
  }
}

export default StaticRealmEndpoint;
