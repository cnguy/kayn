import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

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
    return new Request(
      this.config,
      this.serviceName,
      this.resourceName,
      METHOD_NAMES.STATIC.GET_MASTERY_LIST,
    );
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
      METHOD_NAMES.STATIC.GET_MASTERY_BY_ID,
    );
  }
}

export default StaticMasteryEndpoint;
