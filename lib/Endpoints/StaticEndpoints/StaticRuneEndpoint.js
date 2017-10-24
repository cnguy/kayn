import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticRuneEndpoint extends StaticSuperclass {
  constructor(config, limiter) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
    this.get = this.get.bind(this);

    this.resourceName = 'runes';

    this.limiter = limiter;
  }

  /**
   * Retrieves rune list.
   */
  list() {
    return new Request(
      this.config,
      this.serviceName,
      this.resourceName,
      METHOD_NAMES.STATIC.GET_RUNE_LIST,
      'GET',
      this.limiter,
    );
  }

  /**
   * Retrieves rune by ID.
   * @param {number} runeID - The ID of the rune. 
   */
  get(runeID) {
    return new Request(
      this.config,
      this.serviceName,
      `${this.resourceName}/${runeID}`,
      METHOD_NAMES.STATIC.GET_RUNE_BY_ID,
      'GET',
      this.limiter,
    );
  }
}

export default StaticRuneEndpoint;
