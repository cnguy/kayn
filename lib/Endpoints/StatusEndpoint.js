import Endpoint from 'Endpoint';
import Request from 'RequestClient/Request';

class StatusEndpoint extends Endpoint {
  constructor(config) {
    super();

    this.config = config;

    this.get = this.get.bind(this);

    this.serviceName = 'status';
  }

  get() {
    return new Request(this.config, this.serviceName, 'shard-data');
  }
}

export default StatusEndpoint;
