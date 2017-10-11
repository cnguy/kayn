import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';

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
    return new Request(this.config, this.serviceName, this.resourceName);
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
    );
  }
}

export default StaticItemEndpoint;
