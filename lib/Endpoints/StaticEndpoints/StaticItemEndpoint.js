import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticItemEndpoint extends StaticSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
    this.get = this.get.bind(this);

    this.resourceName = 'items';
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
    );
  }

  /**
   * Retrieves item by ID.
   * @param {number} itemID - The id of the item. 
   */
  get(itemID) {
    return new Request(
      this.config,
      this.serviceName,
      `${this.resourceName}/${itemID}`,
      METHOD_NAMES.STATIC.GET_ITEM_BY_ID,
    );
  }
}

export default StaticItemEndpoint;
