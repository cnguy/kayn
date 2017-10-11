import Endpoint from 'Endpoint';
import Request from 'RequestClient/Request';

class StatusEndpoint extends Endpoint {
  constructor(config) {
    super();

    this.config = config;

    this.list = this.list.bind(this);

    this.serviceName = 'status';
  }

  list() {
    return new Request(this.config, this.serviceName, 'shard-data');
  }
}

export default StatusEndpoint;
