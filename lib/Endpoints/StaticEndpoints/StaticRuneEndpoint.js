import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticRuneEndpoint extends StaticSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
    this.get = this.get.bind(this);

    this.resourceName = 'runes';
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
    );
  }

  /**
   * Retrieves rune by ID.
   * @param {number} runeID - The id of the mastery. 
   */
  get(runeID) {
    return new Request(
      this.config,
      this.serviceName,
      `${this.resourceName}/${runeID}`,
      METHOD_NAMES.STATIC.GET_RUNE_BY_ID,
    );
  }
}

export default StaticRuneEndpoint;
