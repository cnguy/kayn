import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';

class StaticLanguageStringsEndpoint extends StaticSuperclass {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);

    this.resourceName = 'language-strings';
  }

  /**
   * Retrieves language strings data.
   */
  list() {
    return new Request(this.config, this.serviceName, this.resourceName);
  }
}

export default StaticLanguageStringsEndpoint;
