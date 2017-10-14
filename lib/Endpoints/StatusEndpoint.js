import Endpoint from 'Endpoint';
import Request from 'RequestClient/Request';
import METHOD_NAMES from 'Enums/method-names';

class StatusEndpoint extends Endpoint {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);

    this.serviceName = 'status';
  }

  get() {
    return new Request(
      this.config,
      this.serviceName,
      'shard-data',
      METHOD_NAMES.LOL_STATUS.GET_SHARD_DATA,
    );
  }
}

export default StatusEndpoint;
