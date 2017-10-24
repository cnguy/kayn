import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticMasteryEndpoint extends StaticSuperclass {
  constructor(config, limiter) {
    super();

    this.config = config;

    this.list = this.list.bind(this);
    this.get = this.get.bind(this);

    this.resourceName = 'masteries';

    this.limiter = limiter;
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
      'GET',
      this.limiter,
    );
  }

  /**
   * Retrieves mastery by ID.
   * @param {number} masteryID - The ID of the mastery. 
   */
  get(masteryID) {
    return new Request(
      this.config,
      this.serviceName,
      `${this.resourceName}/${masteryID}`,
      METHOD_NAMES.STATIC.GET_MASTERY_BY_ID,
      'GET',
      this.limiter,
    );
  }
}

export default StaticMasteryEndpoint;
