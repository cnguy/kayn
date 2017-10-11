import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';

class StaticMasteryEndpoint extends StaticSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
    this.get = this.get.bind(this);

    this.resourceName = 'masteries';
  }

  /**
   * Retrieves mastery list.
   */
  list() {
    return new Request(this.config, this.serviceName, this.resourceName);
  }

  /**
   * Retrieves mastery by ID.
   * @param {number} masteryID - The id of the mastery. 
   */
  get(masteryID) {
    return new Request(
      this.config,
      this.serviceName,
      `${this.resourceName}/${masteryID}`,
    );
  }
}

export default StaticMasteryEndpoint;
