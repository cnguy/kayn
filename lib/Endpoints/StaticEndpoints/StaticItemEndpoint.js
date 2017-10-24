import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticItemEndpoint extends StaticSuperclass {
  constructor(config, limiter) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
    this.get = this.get.bind(this);

    this.resourceName = 'items';

    this.limiter = limiter;
  }

  /**
   * Retrieves item list.
   */
  list() {
    return new Request(
      this.config,
      this.serviceName,
      this.resourceName,
      METHOD_NAMES.STATIC.GET_ITEM_LIST,
      'GET',
      this.limiter,
    );
  }

  /**
   * Retrieves item by ID.
   * @param {number} itemID - The ID of the item. 
   */
  get(itemID) {
    return new Request(
      this.config,
      this.serviceName,
      `${this.resourceName}/${itemID}`,
      METHOD_NAMES.STATIC.GET_ITEM_BY_ID,
      'GET',
      this.limiter,
    );
  }
}

export default StaticItemEndpoint;
