import StaticSuperclass from './StaticSuperclass';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StaticLanguageStringsEndpoint extends StaticSuperclass {
  constructor(config, limiter) {
    super();

    this.config = config;

    this.list = this.list.bind(this);

    this.resourceName = 'language-strings';

    this.limiter = limiter;
  }

  /**
   * Retrieves language strings data.
   */
  list() {
    return new Request(
      this.config,
      this.serviceName,
      this.resourceName,
      METHOD_NAMES.STATIC.GET_LANGUAGE_STRINGS,
      'GET',
      this.limiter,
    );
  }
}

export default StaticLanguageStringsEndpoint;
