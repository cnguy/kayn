import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticMapEndpoint extends StaticSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);

    this.resourceName = 'maps';
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
    );
  }
}

export default StaticMapEndpoint;
