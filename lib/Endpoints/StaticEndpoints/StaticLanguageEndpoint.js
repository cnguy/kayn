import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

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
    return new Request(
      this.config,
      this.serviceName,
      this.resourceName,
      METHOD_NAMES.STATIC.GET_LANGUAGES,
    );
  }
}

export default StaticLanguageEndpoint;