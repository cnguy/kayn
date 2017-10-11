import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';

class StaticChampionEndpoint extends StaticSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
    this.get = this.get.bind(this);

    this.resourceName = 'champions';
  }

  /**
   * Retrieves champion list.
   */
  list() {
    return new Request(this.config, this.serviceName, this.resourceName);
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
    );
  }
}

export default StaticChampionEndpoint;
