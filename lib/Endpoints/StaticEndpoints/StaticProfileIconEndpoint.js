import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticProfileIconEndpoint extends StaticSuperclass {
  constructor(config, limiter) {
    super();

    this.config = config;

    this.list = this.list.bind(this);

    this.resourceName = 'profile-icons';

    this.limiter = limiter;
  }

  /**
   * Retrieve profile icons.
   */
  list() {
    return new Request(
      this.config,
      this.serviceName,
      this.resourceName,
      METHOD_NAMES.STATIC.GET_PROFILE_ICONS,
      'GET',
      this.limiter,
    );
  }
}

export default StaticProfileIconEndpoint;
