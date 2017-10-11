import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';

class StaticLanguageEndpoint extends StaticSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);

    this.resourceName = 'languages';
  }

  /**
   * Retrieves supported languages data.
   */
  list() {
    return new Request(this.config, this.serviceName, this.resourceName);
  }
}

export default StaticLanguageEndpoint;
