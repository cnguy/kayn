import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticChampionEndpoint extends StaticSuperclass {
  constructor(config, limiter) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
    this.get = this.get.bind(this);

    this.resourceName = 'champions';

    this.limiter = limiter;
  }

  /**
   * Retrieves champion list.
   */
  list() {
    return new Request(
      this.config,
      this.serviceName,
      this.resourceName,
      METHOD_NAMES.STATIC.GET_CHAMPION_LIST,
      'GET',
      this.limiter,
    );
  }

  /**
   * Retrieves champion by ID.
   * @param {number} championID - The id of the champion. 
   */
  get(championID) {
    return new Request(
      this.config,
      this.serviceName,
      `${this.resourceName}/${championID}`,
      METHOD_NAMES.STATIC.GET_CHAMPION_BY_ID,
      'GET',
      this.limiter
    );
  }
}

export default StaticChampionEndpoint;
